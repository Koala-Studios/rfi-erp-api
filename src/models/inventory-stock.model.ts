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
  sample: boolean;
  is_solid: boolean;
  received_amount: number;
  gross_amount: number;
  remaining_amount: number;
  adjusted_amount: number;
  allocated_amount: number;
  quarantined_containers: number;
  location: IStockLocation;
  items: [IInventoryStock];
}

export interface IInventoryStock extends mongoose.Document {
  purchase_id?: string;
  product_id: string | IInventory;
  product_code: string;
  name: string;
  unit_cost: number;
  container_size: number;
  sample: boolean;
  is_solid: boolean;
  is_open: boolean;
  received_amount: number;
  gross_amount: number;
  remaining_amount: number;
  allocated_amount: number;
  quarantined: boolean;
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
  is_solid: Boolean,
  is_open: Boolean,
  container_size: Number,
  sample: Boolean,
  location: { _id: ObjectId, name: String },
  received_amount: Number,
  gross_amount: Number,
  remaining_amount: Number,
  allocated_amount: Number,
  quarantined: Boolean,
  lot_number: String,
  received_date: Date,
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
