import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

interface IForecastProduct {
    product_id: string;
    amount: number;
    price: number;
    status: number;
  }

  export interface IForecastResults {
    product_id:string;
    product_code: string;
    product_name:string;
    required_amount: number;
    available_amount: number;
    on_order_amount: number;
    on_hand_amount: number;
    in_transit_amount: number;
    reorder_amount:number;
  }


export interface IForecast extends mongoose.Document {
    forecast_code: string;
    forecast_date: Date;
    forecast_products: [IForecastProduct];
}

const forecastSchema = new mongoose.Schema({
    forecast_date: Date,
    forecast_code: String,
    forecast_products: 
    {
        product_id: String,
        amount: Number,
        cost: Number,
    },
});

forecastSchema.plugin(paginate);

export default mongoose.model<IForecast, mongoose.PaginateModel<IForecast>>("Forecast", forecastSchema, 'forecast');
