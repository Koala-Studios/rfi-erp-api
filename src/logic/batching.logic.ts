import { IBatchingContainer } from './../models/batching.model';
import { IListParams, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import Inventory from "../models/inventory.model";
import Batching, { IBatching, batchingStatus } from "../models/batching.model";
import Formula, { IFormula } from "../models/formula.model";
import InventoryStock, { IInventoryStock } from "../models/inventory-stock.model";
import mongoose, { FilterQuery } from "mongoose";
import { IProcessedQuery, processQuery } from "./utils";
import { calculateMaterials } from "./forecast.logic";
import { ObjectId } from "mongodb";
import { moveInventory } from "./inventory-movements.logic";
import { movementTypes } from "../models/inventory-movements.model";

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
  _status = status.OK;

  return {
    status: _status,
    data: { message: "Batching Order", res: _batching },
  };
};

export const createBOM = async (
  batching: IBatching
): Promise<ILogicResponse> => {
  const materials = await calculateMaterials([
    { product_code: batching.product_code, amount: batching.quantity },
  ]);
  for (const material of materials) {
    const newId = new mongoose.Types.ObjectId();
    const containerFill = await fillContainers(material.product_id, material.required_amount);
    console.log(containerFill, 'contFill')
    batching.ingredients = [
      ...batching.ingredients,
      {
        _id: new mongoose.Types.ObjectId().toHexString(),
        product_id: material.product_id,
        product_code: material.product_code,
        product_name: material.product_name,
        required_amount: material.required_amount,
        used_containers: containerFill.containers,
        used_amount: 0,
        has_enough: containerFill.has_enough
      },
    ];
    moveInventory({
      product_id: material.product_id, //ALLOCATING THE PRODUCTION #
      product_code: material.product_code,
      name: material.product_name,
      module_source: Batching.modelName,
      movement_target_type: movementTypes.ALLOCATED,
      amount: material.required_amount,
      movement_date: new Date(),
    });
  }
  batching.save();
  return {
    status: status.OK,
    data: { message: "Batch Created", res: batching },
  };
};

export const finishBatching = async (
  batching: IBatching
): Promise<ILogicResponse> => {
  for (const material of batching.ingredients) {
    const newId = new mongoose.Types.ObjectId();
    batching.ingredients = [
      ...batching.ingredients,
      {
        _id: new mongoose.Types.ObjectId().toHexString(),
        product_id: material.product_id,
        product_code: material.product_code,
        product_name: material.product_name,
        required_amount: material.required_amount,
        used_containers: material.used_containers,
        used_amount: 0,
      },
    ];
    moveInventory({
      product_id: material.product_id,
      product_code: material.product_code,
      name: material.product_name,
      module_source: Batching.modelName,
      movement_target_type: movementTypes.ALLOCATED,
      amount: -material.required_amount, //DEALLOCATING THE AMOUNT THAT WAS SET ASIDE.
      movement_date: new Date(),
    });
    for (const container of material.used_containers) {
      moveInventory({
        product_id: material.product_id, //UPDATING CONTAINER QTY
        product_code: material.product_code,
        name: material.product_name,
        module_source: Batching.modelName,
        movement_target_type: movementTypes.ON_HAND,
        lot_number: container.lot_number,
        container_id: container._id,
        amount: -container.used_amount, //REMOVING USED AMT FROM CONTAINERS
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


const fillContainers = async (product_id: string, amount: number) => {
  let cont_array: IBatchingContainer[] = []
  let rem_amount = amount;
  const containers = await InventoryStock.find({ 'product_id': product_id });
  console.log(product_id, containers, 'CONTAINERS AAAAAAAAAAA')
  if (containers) {
    for (const container of containers) {
      container.remaining_amount += (Math.random() * 12.145) * 7 / 6
      const available_amount = container.remaining_amount - container.allocated_amount;
      const has_enough = rem_amount <= available_amount;

      console.log(rem_amount, 'Test123', available_amount, 'Container Amount: ', container.remaining_amount, 'Allocated Amount: ', container.allocated_amount)
      if (available_amount > 0) {
        cont_array = [...cont_array, { _id: container._id, lot_number: container.lot_number, amount_to_use: has_enough ? rem_amount : available_amount, used_amount: 0 }]
        container.allocated_amount = has_enough ? rem_amount : available_amount; //TODO:deallocate this amount .. somehow..
        rem_amount = rem_amount - (has_enough ? rem_amount : available_amount)
        container.save();
      }
      if (has_enough || rem_amount <= 0) break;
    }

  }
  return {
    containers: cont_array, has_enough: rem_amount <= 0
  };
}