
import mongoose from "mongoose";
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId;
export interface IFormulaItem {
  material_code: string;
  amount: number;
  notes: string;
  material_id: string;
  material_name: string;
}

export interface IFormula extends mongoose.Document{
    product_id: string;  
    product_code: string;
    version: number;
    yield:number;
    base_hundred:boolean;
    date_created: Date;
    formula_items: IFormulaItem[];
  }

const formulaSchema = new mongoose.Schema({
    product_id: ObjectId,
    product_code: String,
    version: Number,
    date_created: Date,
    yield:Number,
    base_hundred:Boolean,
    formula_items: [
      {
        material_code: String,
        amount: Number,
        notes: String,
        material_id: ObjectId,
        material_name: String,
      }
    ],
});

export default mongoose.model<IFormula>("Formula", formulaSchema);