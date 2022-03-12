import mongoose from 'mongoose'

interface Inventory_Container {
    batch_code:string;
    on_hand:number;
    in_transit:number;
    on_order:number;
    allocated:number;
    price:number;
}


export interface IInventory extends mongoose.Document {
    code:string;
    name:string;
    stock?:[Inventory_Container];
    reorder_amount?:number;
    suppliers?:[string];
    last_supplier?:string;
    fda_status?:number;
    cpl_hazard?:string;
    fema_number?:number;
    ttb_status?:string;
    eu_status?:number;
    organic?:boolean;
    kosher?:boolean;
}

const inventorySchema = new mongoose.Schema({
    code:String,
    name:String,
    stock:[
        {
            batch_code:String,
            on_hand:Number,
            in_transit:Number,
            on_order:Number,
            allocated:Number,
            price:Number,
        }
    ],
    reorder_amount:Number,
    suppliers:[String],
    last_supplier:String,
    fda_status:Number,
    cpl_hazard:String,
    fema_number:Number,
    ttb_status:String,
    eu_status:Number,
    organic:Boolean,
    kosher:Boolean,
});

export default mongoose.model<IInventory>("Inventory", inventorySchema);