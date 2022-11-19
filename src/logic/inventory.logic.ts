

import Inventory, {IInventory} from "../models/inventory.model";

export const listInventory = async():Promise<IInventory[]> => {
    //filters: all
    const _inventory = await Inventory.find({}).limit(100);
    // console.log(_inventory);
    return _inventory;
}