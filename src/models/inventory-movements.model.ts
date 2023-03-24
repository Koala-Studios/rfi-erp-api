import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;

export const movementTypes = {
	ON_HOLD: 'on_hold',
	ON_HAND: 'on_hand',
	ON_ORDER: 'on_order',
	IN_TRANSIT: 'in_transit',
	QUARANTINE: 'quarantine',
	ALLOCATE: 'allocated',
};

export interface IInventoryMovement extends mongoose.Document {
  product_id: string;
  product_code: string;
  name: string;
  module_source:string;
  movement_type:string;
  amount:number;
}

const inventoryMovementSchema = new mongoose.Schema({
    product_id: ObjectId,
    product_code: String,
    name: String,
    module_source: String,
    movement_type: String,
    amount:Number
});

inventoryMovementSchema.plugin(paginate);

export default mongoose.model<IInventoryMovement, mongoose.PaginateModel<IInventoryMovement>>(
  "InventoryMovement",
  inventoryMovementSchema,
  "inventory_movements"
);