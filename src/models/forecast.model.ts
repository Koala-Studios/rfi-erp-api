import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

interface IForecastProduct {
  product_id: string;
  amount: number;
  price: number;
  status: number;
}

export const amtStatus = {
  NOT_ENOUGH: 1,
  IN_ORDER: 2,
  UNDER_RECOMMENDED: 3,
  IS_ENOUGH: 6,
  //more in future? maybe "in transit"
};

export interface IForecastResults {
  product_id: string;
  product_code: string;
  product_name: string;
  required_amount: number;
  available_amount: number;
  ordered_amount: number;
  on_hand_amount: number;
  in_transit_amount: number;
  reorder_amount: number;
  amt_status: number;
  avoid_recur?: boolean;
}

export interface IForecast extends mongoose.Document {
  forecast_code: string;
  forecast_date: Date;
  forecast_products: [IForecastProduct];
}

const forecastSchema = new mongoose.Schema({
  forecast_date: Date,
  forecast_code: String,
  forecast_products: {
    product_id: String,
    amount: Number,
    cost: Number,
  },
});

forecastSchema.plugin(paginate);

export default mongoose.model<IForecast, mongoose.PaginateModel<IForecast>>(
  "Forecast",
  forecastSchema,
  "forecast"
);
