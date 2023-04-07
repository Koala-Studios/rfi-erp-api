import { amtStatus, IForecastResults } from "../models/forecast.model";
import Formula, { IFormula } from "../models/formula.model";
import Inventory, { IInventory } from "../models/inventory.model";

export interface IForecast {
  product_code: string;
  amount: number;
}

const assignStatus = (required_amt:number, available_amt:number, ordered_amt:number):number => {
  if( available_amt < required_amt) {
    if(required_amt <= available_amt + ordered_amt) {
      return amtStatus.IN_ORDER;
    }
    return amtStatus.NOT_ENOUGH;
  }
  return amtStatus.IS_ENOUGH;
}


export const calculateMaterials = async(
  products: [{product_code:string, amount:number }]
):Promise<IForecastResults[]> => {
  
  let rawIngredients: IForecast[] = [];  
  let rawIngredientsFinal: IForecastResults[] = [];
  for (let i = 0; i < products.length; i++) {
    rawIngredients = [...rawIngredients,...await recursiveFinder(products[i])];
  }
  rawIngredients = Array.from(rawIngredients.reduce(
    (m, {product_code, amount}) => m.set(product_code,(m.get(product_code) || 0) + amount), new Map
  ), ([product_code, amount]) => ({product_code, amount}));

  for(const ingredient of rawIngredients) {
    const inv_item = await Inventory.findOne({product_code: ingredient.product_code});
    if(inv_item != null) {
      rawIngredientsFinal = [...rawIngredientsFinal, 
        { product_id: inv_item._id, 
          product_code: ingredient.product_code,
          product_name: inv_item.name,
          required_amount: ingredient.amount,
          available_amount: inv_item.stock.on_hand - inv_item.stock.allocated,
          on_order_amount: inv_item.stock.on_order,
          on_hand_amount: inv_item.stock.on_hand,
          in_transit_amount: inv_item.stock.in_transit,
          reorder_amount: inv_item.stock.reorder_amount,
          amt_status:assignStatus(ingredient.amount,inv_item.stock.on_hand - inv_item.stock.allocated, inv_item.stock.on_order)
          }]
    } else {
      //TODO: HERE WE HAVE TO SEND TO FRONT END REPORT THAT INGR WAS NOT FOUND
      console.log('INGREDIENT NOT FOUND: ' + ingredient.product_code);
    }

  }

  rawIngredientsFinal.sort((a, b) => a.amt_status - b.amt_status);

  return rawIngredientsFinal
};

const recursiveFinder = async (product: IForecast) => {
  const materialTypes = ["FL", "FK", "FE", "SM"]; //TODO: make this modular
  const avoidRecursionMatTypes = ["FK"];
  let rawIngredients: IForecast[] = [];
  
  const formula = await Formula.findOne({ product_code: product.product_code }).sort('-version');
  // console.log(formula, product.product_code)
  if(formula) {
    const f = formula.formula_items;
    for (let i = 0; i < f.length; i++) { //TODO: INCOMPLETE
      if (materialTypes.some((substring) => f[i].material_code.startsWith(substring))) { //if not a raw material.
        if((avoidRecursionMatTypes.some((substring) => f[i].material_code.startsWith(substring)))) {
          const inv_material = await Inventory.findOne({id: f[i].material_id});
          //morse things here for anti recursion mats?
        }
        rawIngredients = [
          ...rawIngredients,
          ...await recursiveFinder({
              product_code: f[i].material_code,
              amount: (product.amount * f[i].amount) / 100.000000,
            }
          ),
        ];
      } else {

        if(f[i].material_code === 'RM00875') {
          console.log("RHUBA", f[i].material_code, product)
        }

        rawIngredients.push({
          product_code: f[i].material_code,
          amount: (product.amount * f[i].amount) / 100.000000,
        });
      }
    }
  
  } else {
    //TODO: HERE WE HAVE TO SEND TO FRONT END REPORT THAT FORMULA OF INGR WAS NOT FOUND!
    console.log('FORMULA NOT FOUND: ' + product.product_code)
  }

  return rawIngredients;
};


const materialStockFinder = async (product: IForecast) => {
  return null;
}