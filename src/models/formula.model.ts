import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
export interface IFormulaItem {
  material_id: string;
  material_code: string;
  material_name: string;
  amount: number;
  notes: string;
}

export interface IFormula extends mongoose.Document {
  product_id: string;
  product_code: string;
  version: number;
  yield: number;
  rec_dose_rate: number;
  base: number;
  date_created: Date;
  formula_items: IFormulaItem[];
  description: string;
}

const formulaSchema = new mongoose.Schema({
  product_id: ObjectId,
  product_code: String,
  version: Number,
  date_created: Date,
  yield: Number,
  rec_dose_rate: Number,
  base: Number,
  formula_items: [
    {
      material_code: String,
      amount: Number,
      notes: String,
      material_id: ObjectId,
      material_name: String,
    },
  ],
  description: String,
});

export default mongoose.model<IFormula>("Formula", formulaSchema);
