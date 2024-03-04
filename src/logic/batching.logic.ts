import { IBatchingContainer } from "./../models/batching.model";
import { IListParams, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import Inventory from "../models/inventory.model";
import Batching, { IBatching, batchingStatus } from "../models/batching.model";
import Formula, { IFormula } from "../models/formula.model";
import InventoryStock, {
  IInventoryStock,
} from "../models/inventory-stock.model";
import mongoose, { FilterQuery } from "mongoose";
import { IProcessedQuery, processQuery } from "./utils";
import { calculateMaterials } from "./forecast.logic";
import { ClientSession, ObjectId } from "mongodb";
import { moveInventory } from "./inventory-movements.logic";
import {
  IInventoryMovement,
  movementTypes,
} from "../models/inventory-movements.model";

//TODO:LISTING PARAMETER GENERALIZING
export const listBatching = async (query: string): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);
  const list = await Batching.paginate(_filter, {
    page: _page,
    limit: _count,
    leanWithId: true,
    sort: { date_created: "desc" },
  });

  return { status: status.OK, data: { message: null, res: list } };
};
export const createBatching = async (
  batching: IBatching
): Promise<ILogicResponse> => {
  batching._id = new mongoose.Types.ObjectId();
  batching.date_created = new Date();
  let has_enough_overall = true;

  batching.status = batchingStatus.DRAFT;
  const materials = await calculateMaterials([
    { product_code: batching.product_code, amount: batching.quantity },
  ]);
  for (const material of materials) {
    const test = await Inventory.findById(material.product_id); //If draft check available quantity, otherwise check on hand quantity; with the required quantity to figure out if we have enough

    let has_enough =
      test.stock.on_hand - test.stock.allocated >= material.required_amount;
    if (has_enough === false) {
      has_enough_overall = false;
    }
    batching.ingredients = [
      ...batching.ingredients,
      {
        _id: new mongoose.Types.ObjectId().toHexString(),
        product_id: material.product_id,
        product_code: material.product_code,
        product_name: material.product_name,
        required_amount: material.required_amount,
        used_containers: [],
        total_used_amount: 0,
        avoid_recur: material.avoid_recur ?? false,
        has_enough: has_enough,
      },
    ];
  }
  batching.has_enough = has_enough_overall;
  const _batching = new Batching(batching);
  _batching.save();
  return {
    status: status.OK,
    data: { message: "Batching Created", res: _batching },
  };
};

export const getBatching = async (_id): Promise<ILogicResponse> => {
  let _status: number;

  const _batching = await Batching.findById(_id);
  if (!_batching) {
    _status = status.OK;
    return {
      status: _status,
      data: { message: "No Batching Order Found", res: null },
    };
  }
  let temp = [];
  for (const ingr of _batching.ingredients) {
    const test = await Inventory.findById(ingr.product_id); //If draft check available quantity, otherwise check on hand quantity; with the required quantity to figure out if we have enough
    let has_enough =
      _batching.status === batchingStatus.DRAFT
        ? test.stock.on_hand - test.stock.allocated >= ingr.required_amount
        : test.stock.on_hand >= ingr.required_amount;
    /*Explanation:
    0: not enough,
    1: enough,
    */
    temp = [...temp, { ...ingr, has_enough: has_enough }];
  }
  _batching.ingredients = temp;
  _status = status.OK;

  return {
    status: _status,
    data: { message: "Batching Order", res: _batching },
  };
};

export const confirmBatching = async (
  batching: IBatching
): Promise<ILogicResponse> => {
  let has_enough_overall = true;
  for (const material of batching.ingredients) {
    const test = await Inventory.findById(material.product_id); //If draft check available quantity, otherwise check on hand quantity; with the required quantity to figure out if we have enough

    let has_enough =
      test.stock.on_hand - test.stock.allocated >= material.required_amount;
    if (has_enough === false) {
      has_enough_overall = false;
    }
    await moveInventory({
      product_id: material.product_id, //ALLOCATING THE PRODUCTION #
      product_code: material.product_code,
      name: material.product_name,
      module_source: Batching.modelName,
      movement_source_type: movementTypes.ON_HAND,
      movement_target_type: movementTypes.ALLOCATED,
      amount: material.required_amount,
      movement_date: new Date(),
      target_location: {
        _id: "",
        code: "",
      },
    });
  }
  batching.status = batchingStatus.SCHEDULED;
  batching.has_enough = has_enough_overall;
  // Batching.updateOne({ _id: batching._id }, { batching });
  await Batching.findOneAndUpdate({ _id: batching._id }, batching);
  // batching.save(); //!not working for some dumb reason???
  return {
    status: status.OK,
    data: { message: "Batching Scheduled", res: batching },
  };
};

export const generateBOM = async (
  batching: IBatching
): Promise<ILogicResponse> => {
  let materials = [];
  for (const material of batching.ingredients) {
    const containerFill = await fillContainers(
      material.product_id,
      material.required_amount
    );

    materials = [
      ...materials,
      {
        ...material,
        used_containers: containerFill.containers,
      },
    ];
  }
  batching.ingredients = materials;
  batching.status = batchingStatus.IN_PROGRESS;
  batching.save();
  return {
    status: status.OK,
    data: { message: "BOM Created", res: batching },
  };
};

export const finishBatching = async (
  batching: IBatching
): Promise<ILogicResponse> => {
  for (const material of batching.ingredients) {
    moveInventory({
      product_id: material.product_id,
      product_code: material.product_code,
      name: material.product_name,
      module_source: Batching.modelName,
      movement_target_type: movementTypes.ALLOCATED,
      amount: -material.required_amount, //DEALLOCATING THE AMOUNT THAT WAS SET ASIDE.
      movement_date: new Date(),
      target_location: null,
    });
    for (const container of material.used_containers) {
      moveInventory({
        product_id: material.product_id,
        product_code: material.product_code,
        name: material.product_name,
        module_source: Batching.modelName,
        movement_target_type: movementTypes.ON_HAND,
        lot_number: container.lot_number,
        amount: -container.used_amount,
        container_id: container._id,
        target_location: null,
        movement_date: new Date(),
      });
    }
  }
  batching.status = batchingStatus.FINISHED;
  batching.save();

  return {
    status: status.OK,
    data: { message: "Batch Finished.", res: batching },
  };
};

export const cancelBatching = async (
  batching: IBatching
): Promise<ILogicResponse> => {
  for (const material of batching.ingredients) {
    moveInventory({
      product_id: material.product_id,
      product_code: material.product_code,
      name: material.product_name,
      module_source: Batching.modelName,
      movement_source_type: movementTypes.ALLOCATED,
      movement_target_type: movementTypes.ON_HAND,
      amount: -material.required_amount, //DEALLOCATING THE AMOUNT THAT WAS SET ASIDE.
      movement_date: new Date(),
      target_location: null,
    });
  }
  batching.status = batchingStatus.CANCELLED;
  batching.save();

  return {
    status: status.OK,
    data: { message: "Batch Cancelled.", res: batching },
  };
};

const fillContainers = async (product_id: string, amount: number) => {
  let cont_array: IBatchingContainer[] = [];
  let rem_amount = amount;
  const containers = await InventoryStock.find({ product_id: product_id });
  // console.log(product_id, containers, "CONTAINERS AAAAAAAAAAA");
  if (containers) {
    for (const container of containers) {
      container!.remaining_amount += parseFloat(
        ((Math.random() * 12 * 7) / 6).toFixed(2) //this is to be removed, for testing right now.
      );
      const available_amount =
        container.remaining_amount - container.allocated_amount;
      const has_enough = rem_amount <= available_amount;

      console.log(
        rem_amount,
        "Test123",
        available_amount,
        "Container Amount: ",
        container.remaining_amount,
        "Allocated Amount: ",
        container.allocated_amount
      );
      if (available_amount > 0) {
        cont_array = [
          ...cont_array,
          {
            _id: container._id,
            lot_number: container.lot_number,
            confirm_lot_number: "",
            used_amount: 0,
          },
        ];
        rem_amount -= available_amount;
        // container.allocated_amount = has_enough ? rem_amount : available_amount; //TODO:deallocate this amount .. somehow..
        // rem_amount = rem_amount - (has_enough ? rem_amount : available_amount);
        container.save();
      }
      if (has_enough || rem_amount <= 0) break;
    }
  }
  return {
    containers: cont_array,
  };
};
