import mongoose from "mongoose";

interface IForecastProduct {
    product_id: string;
    amount: number;
    price: number;
    status: number;
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

export default mongoose.model<IForecast>("Forecast", forecastSchema, 'forecast');
