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
  movement_target_type: string;
  amount: number;
  container_id?: string;
  lot_number?: string;
  movement_date: Date;
}

export interface IMovementSource {
  movement_source_type: string;
  amount: number;
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
      sort: { date_created: "desc" },
    }
  );

  return { status: status.OK, data: { message: null, res: list } };
};

export const moveInventory = async (
  movement: IMovement,
  movement_source?: IMovementSource
) => {
  console.log(movement, movement_source, "TEST MOVEMENTS");

  if (
    movement.container_id &&
    movement.movement_target_type === movementTypes.ON_HAND
  ) {
    //TODO: Later will have to revise this, should work for now.
    await InventoryStock.findOneAndUpdate(
      { _id: movement.container_id },
      { $inc: { used_amount: -movement.amount } },
      { new: true }
    ); //!!Value is flipped since we're updating the USED amt
  }

  const movement_source_variable = movement_source
    ? "stock." + movement_source.movement_source_type
    : null;
  const movement_target_variable = "stock." + movement.movement_target_type;
  if (movement_source) {
    await Inventory.findOneAndUpdate(
      { _id: movement.product_id },
      { $inc: { [movement_source_variable]: -movement_source.amount } }
    ).then(() => {
      const source_movement = {
        product_id: movement.product_id,
        product_code: movement.product_code,
        name: movement.name,
        module_source: movement.module_source,
        movement_target_type: movement_source.movement_source_type,
        amount: movement_source.amount,
        movement_date: movement.movement_date,
      };

      InventoryMovement.create(source_movement);
    });
  }
  return await Inventory.findOneAndUpdate(
    { _id: movement.product_id }, //prob gonna return something different like a confirmation
    { $inc: { [movement_target_variable]: movement.amount } }
  ).then(() => {
    InventoryMovement.create(movement);
  });
};