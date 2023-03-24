import InventoryMovement, {IInventoryMovement} from "../models/inventory-movements.model";
import Inventory, { IInventory } from "../models/inventory.model";



export const moveInventory = async (
    movement:IInventoryMovement) => {
        const movement_variable = 'stock.' + movement.movement_type
        Inventory.findOneAndUpdate({_id: movement.product_id}, { $inc: { [movement_variable] : movement.amount }}  ).then( () => {
            const new_movement = InventoryMovement.create(movement);
        }
    )
}

