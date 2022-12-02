
import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

interface ICountItem {
  product_id: string;
  amount: number;
  amount_proposed: number;
  status: number;
}

export interface IStockCount extends mongoose.Document {
    date_proposed: Date;
    count_items: [ICountItem];
    status: number;
}

const stockCountSchema = new mongoose.Schema({
    date_proposed: Date,
    count_items: {
        product_id: String,
        amount: Number,
        amount_proposed: Number,
        status: Number
    },
    status: Number,
});

stockCountSchema.plugin(paginate);

export default mongoose.model<IStockCount, mongoose.PaginateModel<IStockCount>>("Stock Count", stockCountSchema);