import mongoose from 'mongoose'

interface IInventoryContainer {
    supplier_id:string;
    batch_code:string;
    on_hand:number;
    on_order:number;
    allocated:number;
    price:number;
}


export interface IInventory extends mongoose.Document {
    code:string;
    name:string;
    average_cost:number;
    stock?:[IInventoryContainer];
    reorder_amount?:number;
    suppliers?:[string];
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
    average_cost:Number,
    stock:[
        {
            supplier_id:String,
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
    fda_status:Number,
    cpl_hazard:String,
    fema_number:Number,
    ttb_status:String,
    eu_status:Number,
    organic:Boolean,
    kosher:Boolean,
});

export default mongoose.model<IInventory>("Inventory", inventorySchema);