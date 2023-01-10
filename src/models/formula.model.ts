
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
    product_code: string;
    version: number;
    yield:number;
    date_created: Date;
    formula_items: IFormulaItem[];
    product_id: string;
  }

const formulaSchema = new mongoose.Schema({
    product_code: String,
    version: Number,
    date_created: Date,
    formula_items: [
      {
        material_code: String,
        amount: Number,
        notes: String,
        material_id: ObjectId,
        material_name: String,
      }
    ],
    product_id: ObjectId
});

export default mongoose.model<IFormula>("Formula", formulaSchema);