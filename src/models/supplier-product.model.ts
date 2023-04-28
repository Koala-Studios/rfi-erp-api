import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

interface IDiscountRate{
    min_amount: number;
    disc_percent: number;
}

interface ISupplierItem {
    _id: string;
    name: string;
    code: string;
}

export interface ISupplierProduct extends mongoose.Document {
  product_id: string;
  supplier:ISupplierItem;
  supplier_sku: string;
  product_code: string;
  name: string;
  cost: number;
  discount_rates: IDiscountRate[];
  description: string;
  aliases: string;
  cas_number?: string;
}

const supplierProductSchema = new mongoose.Schema({
  product_id: String,
  supplier: {
    _id:ObjectId,
    name: String,
    code: String
  },
  product_code: String,
  name: String,
  cost: Number,
  discount_rates: [{min_amount:Number, disc_percent: Number}],
  description: String,
  aliases: String,
  cas_number: String,
});

// inventorySchema.plugin(paginate);

export default mongoose.model<ISupplierProduct, ISupplierProduct>(
  "SupplierProduct",
  supplierProductSchema,
  "supplier_products"
);
