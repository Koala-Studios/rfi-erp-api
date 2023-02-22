import { IForecastResults } from "../models/forecast.model";
import Formula, { IFormula } from "../models/formula.model";
import Inventory, { IInventory } from "../models/inventory.model";

export interface IForecast {
  product_code: string;
  amount: number;
}



export const calculateMaterials = async(
  products: IForecast[]
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
    rawIngredientsFinal = [...rawIngredientsFinal, 
      { product_id: inv_item._id, 
        product_code: ingredient.product_code,
        product_name: inv_item.name,
        required_amount: ingredient.amount,
        available_amount: inv_item.stock.on_hand - inv_item.stock.allocated,
        on_order_amount: inv_item.stock.on_order,
        on_hand_amount: inv_item.stock.on_hand,
        in_transit_amount: inv_item.stock.in_transit,
        reorder_amount: inv_item.stock.reorder_amount
        }]
  }

  return rawIngredientsFinal
};

const recursiveFinder = async (product: IForecast) => {
  const materialTypes = ["FL", "FK", "FE", "SM"]; //TODO: make this modular
  const avoidRecursionMatTypes = ["FK"];
  let rawIngredients: IForecast[] = [];
  
  const formula = await Formula.findOne({ product_code: product.product_code, $max: "version"});
  console.log(formula)
  const f = formula.formula_items;

  for (let i = 0; i < f.length; i++) { //TODO: INCOMPLETE
    if (materialTypes.some((substring) => f[i].material_code.startsWith(substring))) { //if not a raw material.
      if((avoidRecursionMatTypes.some((substring) => f[i].material_code.startsWith(substring)))) {
        const inv_material = await Inventory.findOne({id: f[i].material_id});

      }
      rawIngredients = [
        ...rawIngredients,
        ...await recursiveFinder({
            product_code: f[i].material_code,
            amount: (product.amount * f[i].amount) / 100,
          }
        ),
      ];
    } else {
      rawIngredients.push({
        product_code: f[i].material_code,
        amount: (product.amount * f[i].amount) / 100,
      });
    }
  }

  return rawIngredients;
};


const materialStockFinder = async (product: IForecast) => {
  return null;
}