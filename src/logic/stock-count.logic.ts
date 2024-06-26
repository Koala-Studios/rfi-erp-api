import { IListParams, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import Inventory from "../models/inventory.model";
import InventoryStock from "../models/inventory-stock.model";
import StockCount, {
  IStockCount,
  IStockCountLocation,
  stockCountStatus,
} from "../models/stock-count.model";
import Formula, { IFormula } from "../models/formula.model";
import { FilterQuery } from "mongoose";
import { IProcessedQuery, processQuery } from "./utils";
import { movementTypes } from "../models/inventory-movements.model";
import { moveInventory } from "./inventory-movements.logic";
import { ILocation } from "../models/location.model";

//TODO:LISTING PARAMETER GENERALIZING
export const listStockCount = async (
  query: string
): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

  const list = await StockCount.paginate(_filter, {
    page: _page,
    limit: _count,
    leanWithId: true,
    // sort: { date_created: 'desc' }
  });

  return { status: status.OK, data: { message: null, res: list } };
};

export const createStockCount = async (
  createInfo: IStockCount
): Promise<ILogicResponse> => {
  const _stockCount = await StockCount.create(createInfo);

  return {
    status: status.CREATED,
    data: { message: "Stock Count Created", res: _stockCount },
  };
};

export const submitStockCount = async (
  _id: string
): Promise<ILogicResponse> => {
  const _stockCount = await StockCount.findOneAndUpdate(
    { _id: _id },
    { $set: { status: stockCountStatus.SUBMITTED } },
    { new: true }
  );
  //TODO: SEND NOTIFICATION TO ADMIN IN CHARGE
  return {
    status: status.OK,
    data: { message: "Stock Count Submitted for Approval", res: _stockCount },
  };
};

export const disapproveStockCount = async (
  _id: string
): Promise<ILogicResponse> => {
  const _stockCount = await StockCount.findOneAndUpdate(
    { _id: _id },
    { $set: { status: stockCountStatus.DRAFT } },
    { new: true }
  );
  //TODO: SEND NOTIFICATION TO STOCK COUNT CREATOR (also check for credentials to disapprove)
  return {
    status: status.OK,
    data: { message: "Stock Count Submitted for Approval", res: _stockCount },
  };
};

export const approveStockCount = async (
  _id: string
): Promise<ILogicResponse> => {
  const _stockCount = await StockCount.findOneAndUpdate(
    { _id: _id },
    { $set: { status: stockCountStatus.APPROVED, approved_date: new Date() } },
    { new: true }
  );
  //TODO: SEND NOTIFICATION TO STOCK COUNT CREATOR (also check for credentials to disapprove)
  for (const count_item of _stockCount.count_items) {
    moveInventory({
      product_id: count_item.product_id,
      product_code: count_item.product_code,
      name: count_item.name,
      module_source: StockCount.modelName,
      movement_target_type: movementTypes.ON_HAND,
      amount: -(count_item.current_amount - count_item.proposed_amount), //TODO: UPDATE TO NEW SYSTEM
      container_id: count_item.container_id,
      lot_number: count_item.lot_number,
      movement_date: new Date(),
      target_location: null,
    });
  }

  return {
    status: status.OK,
    data: { message: "Stock Count Approved", res: _stockCount },
  };
};

export const abandonStockCount = async (
  _id: string
): Promise<ILogicResponse> => {
  const _stockCount = await StockCount.findOneAndUpdate(
    { _id: _id },
    { $set: { status: stockCountStatus.ABANDONED } },
    { new: true }
  );
  //TODO: SEND NOTIFICATION TO STOCK COUNT ADMIN (also check for credentials to abandon)
  return {
    status: status.OK,
    data: { message: "Stock Count Abandoned", res: _stockCount },
  };
};

export const fillCountAllContainers = async (): Promise<ILogicResponse> => {
  const _containers = await InventoryStock.find();

  return {
    status: status.OK,
    data: { message: "All Containers Imported", res: _containers },
  };
};

export const fillLocationContainers = async (
  location_id: string
): Promise<ILogicResponse> => {
  const _containers = await InventoryStock.find({
    "location._id": "652e8d106c82e2ccd186ee69",
  });
  console.log(_containers);
  return {
    status: status.OK,
    data: { message: "Location Containers Imported", res: _containers },
  };
};
