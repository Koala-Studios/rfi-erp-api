
import mongoose from "mongoose";

export interface IFormulaItem {
  material_code: string;
  amount: number;
  notes: string;
}

export interface IFormula extends mongoose.Document{
    product_code: string;
    version: number;
    date_created: Date;
    formula_items: IFormulaItem[];
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
      }
    ]
});

export default mongoose.model<IFormula>("Formula", formulaSchema);