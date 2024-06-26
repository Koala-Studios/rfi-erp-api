import InventoryMovement, {
  IInventoryMovement,
  movementTypes,
} from "../models/inventory-movements.model";
import Inventory, { IInventory } from "../models/inventory.model";
import InventoryStock, {
  IInventoryStock,
} from "../models/inventory-stock.model";
import { ILogicResponse } from "./interfaces.logic";
import { IProcessedQuery, processQuery } from "./utils";
import { reply, status } from "../config/config.status";

export interface IMovement {
  product_id: string;
  product_code: string;
  name: string;
  module_source: string;
  movement_source_type?: string;
  movement_target_type: string;
  amount: number;
  source_lot_number?: string;
  lot_number?: string;
  source_container_id?: string;
  container_id?: string;
  source_location?: { _id: string; code: string };
  target_location: { _id: string; code: string };
  movement_date: Date;
}

export const listInventoryMovement = async (
  query: string,
  product_id?: string
): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);
  const list = await InventoryMovement.paginate(
    product_id != undefined ? { product_id: product_id } : _filter,
    {
      page: _page,
      limit: _count,
      leanWithId: true,
      sort: { movement_date: "desc" },
    }
  );

  return { status: status.OK, data: { message: null, res: list } };
};

export const moveInventory = async (movement: IMovement) => {
  if (movement.amount == 0) {
    InventoryMovement.create(movement);
    return;
  }

  if (
    movement.container_id &&
    movement.movement_target_type === movementTypes.ON_HAND
  ) {
    //TODO: Later will have to revise this, should work for now.
    await InventoryStock.findOneAndUpdate(
      { _id: movement.container_id },
      { $inc: { remaining_amount: +movement.amount } }
      // { new: true }
    );
  }

  const movement_source_variable = movement.movement_source_type
    ? "stock." + movement.movement_source_type
    : null;
  const movement_target_variable = "stock." + movement.movement_target_type;
  if (movement.movement_source_type) {
    await Inventory.findOneAndUpdate(
      { _id: movement.product_id },
      { $inc: { [movement_source_variable]: -movement.amount } }
    ).then(() => {
      if (movement.container_id) {
        InventoryStock.findByIdAndUpdate(movement.source_container_id, {
          $inc: {
            remaining_amount: -movement.amount, //not checking type cause will only physically move from source container
          },
        });
      }
    });
  }
  return await Inventory.findOneAndUpdate(
    { _id: movement.product_id }, //prob gonna return something different like a confirmation
    { $inc: { [movement_target_variable]: movement.amount } }
  ).then(() => {
    if (movement.container_id) {
      //container quantity, either will be remaining amount or allocated amount.
      InventoryStock.findByIdAndUpdate(movement.container_id, {
        $inc: {
          [movement.movement_target_type === "on_hand"
            ? "remaining_amount"
            : "allocated_amount"]: movement.amount,
        },
      });
    }
    InventoryMovement.create(movement);
  });
};
