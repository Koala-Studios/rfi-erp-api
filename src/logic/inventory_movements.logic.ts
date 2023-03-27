import InventoryMovement, {IInventoryMovement} from "../models/inventory-movements.model";
import Inventory, { IInventory } from "../models/inventory.model";

export interface IMovement {
    product_id: string;
    product_code: string;
    name: string;
    module_source:string;
    movement_target_type:string;
    amount:number;
}

export interface IMovementSource {
    movement_source_type:string;
    amount:number;
}

export const moveInventory = async (
    movement:IMovement, movement_source?:IMovementSource) => {

        console.log(movement, movement_source, "TEST MOVEMENTS")

        const movement_source_variable = movement_source ? 'stock.' +  movement_source.movement_source_type  : null
        const movement_target_variable = 'stock.' + movement.movement_target_type
        if(movement_source) {
        await Inventory.findOneAndUpdate({_id: movement.product_id},
            {$inc: {[movement_source_variable] : -movement_source.amount}},).
            then( () => {
                const source_movement = {
                    product_id:movement.product_id, 
                    product_code:movement.product_code,
                    name:movement.name,
                    module_source:movement.module_source,
                    movement_target_type: movement_source.movement_source_type,
                    amount: movement_source.amount
                }

                InventoryMovement.create(source_movement);
                }
            )
        }
        return await Inventory.findOneAndUpdate({_id: movement.product_id},  //prob gonna return something different like a confirmation
            {$inc: {[movement_target_variable]: movement.amount }}).then(() => {
            InventoryMovement.create(movement);
        }
    )
}

