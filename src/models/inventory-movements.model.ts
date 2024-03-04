import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

export const movementTypes = {
  ON_HOLD: "on_hold",
  ON_HAND: "on_hand",
  ORDERED: "ordered",
  IN_TRANSIT: "in_transit",
  QUARANTINED: "quarantined",
  ALLOCATED: "allocated",
  MOVED: "moved",
};

export interface IInventoryMovement extends mongoose.Document {
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

const inventoryMovementSchema = new mongoose.Schema({
  product_id: ObjectId,
  product_code: String,
  name: String,
  module_source: String,
  movement_source_type: String,
  movement_target_type: String,
  amount: Number,
  source_lot_number: String,
  lot_number: String,
  source_container_id: String,
  container_id: String,
  source_location: { _id: String, code: String },
  target_location: { _id: String, code: String },
  movement_date: Date,
});

inventoryMovementSchema.plugin(paginate);

export default mongoose.model<
  IInventoryMovement,
  mongoose.PaginateModel<IInventoryMovement>
>("InventoryMovement", inventoryMovementSchema, "inventory_movements");
