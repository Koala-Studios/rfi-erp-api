import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
import aggregatePaginate = require("mongoose-aggregate-paginate-v2");
import { IInventory } from "./inventory.model";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export interface IStockExtension {
  extension_date: Date;
  passed: boolean;
}

export interface IQCTest {
  test_date: Date;
  passed: boolean;
}

export interface IStockLocation {
  _id: string;
  name: string;
}

interface IInventoryStockGrouped {
  _id: { product_id: string; product_code: string };
  product_code: string;
  name: string;
  average_cost: number;
  received_amount: number;
  remaining_amount: number;
  adjusted_amount: number;
  allocated_amount: number;
  quarantined_containers: number;
  location: IStockLocation;
  items: [IInventoryStock];
}
// items: [{
//    _id: string,
//    name:  string,
//    unit_cost: number,
//    received_amount: number,
//    used_amount: number,
//    allocated_amount: number,
//    quarantined_containers: number,
//    received_date:Date,
//    expiry_date: Date,
//    supplier_code: string,
//    supplier_id: string,
//    supplier_sku: string,
//    notes: string,
//    extensions:
//    qc_tests:
//  }]

export interface IInventoryStock extends mongoose.Document {
  purchase_id?: string;
  product_id: string | IInventory;
  product_code: string;
  name: string;
  unit_cost: number;
  container_size: number;
  received_amount: number;
  remaining_amount: number;
  allocated_amount: number;
  quarantined_containers: number;
  lot_number: string;
  supplier_code: string;
  supplier_id: string;
  supplier_sku: string;
  received_date: Date;
  expiry_date: Date;
  notes: string;
  extensions: [IStockExtension];
  qc_tests: [IQCTest];
}

const inventoryStockSchema = new mongoose.Schema({
  purchase_id: ObjectId,
  product_id: { type: Schema.Types.ObjectId, ref: "Inventory" },
  product_code: String,
  name: String,
  unit_cost: Number,
  container_size: Number,
  received_amount: Number,
  remaining_amount: Number,
  allocated_amount: Number,
  quarantined_containers: Number,
  lot_number: String,
  expiry_date: Date,
  notes: String,
  extensions: [
    {
      extension_date: Date,
      passed: Boolean,
    },
  ],
  qc_tests: [
    {
      test_date: Date,
      passed: Boolean,
    },
  ],
});

inventoryStockSchema.plugin(paginate);
inventoryStockSchema.plugin(aggregatePaginate);

export default mongoose.model<
  IInventoryStock,
  mongoose.AggregatePaginateModel<IInventoryStock>
>("InventoryStock", inventoryStockSchema, "inventory_stock");
