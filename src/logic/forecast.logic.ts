import { amtStatus, IForecastResults } from "../models/forecast.model";
import Formula, { IFormula } from "../models/formula.model";
import Inventory, { IInventory } from "../models/inventory.model";
import ProductType, { IProductType } from "../models/product-type.model";

export interface IForecast {
  product_code: string;
  amount: number;
}

const assignStatus = (
  required_amt: number,
  available_amt: number,
  ordered_amt: number
): number => {
  if (available_amt < required_amt) {
    if (required_amt <= available_amt + ordered_amt) {
      return amtStatus.IN_ORDER;
    }
    return amtStatus.NOT_ENOUGH;
  }
  return amtStatus.IS_ENOUGH;
};

export const calculateMaterials = async (
  products: [{ product_code: string; amount: number }],
  force_recursion: boolean = false
): Promise<IForecastResults[]> => {
  let rawIngredients: IForecast[] = [];
  let rawIngredientsFinal: IForecastResults[] = [];
  for (let i = 0; i < products.length; i++) {
    rawIngredients = [
      ...rawIngredients,
      ...(await recursiveFinder(products[i], force_recursion)),
    ];
  }
  rawIngredients = Array.from(
    rawIngredients.reduce(
      (m, { product_code, amount }) =>
        m.set(product_code, (m.get(product_code) || 0) + amount),
      new Map()
    ),
    ([product_code, amount]) => ({ product_code, amount })
  );

  for (const ingredient of rawIngredients) {
    const inv_item = await Inventory.findOne({
      product_code: ingredient.product_code,
    });
    if (inv_item != null) {
      rawIngredientsFinal = [
        ...rawIngredientsFinal,
        {
          product_id: inv_item._id,
          product_code: ingredient.product_code,
          product_name: inv_item.name,
          required_amount: ingredient.amount,
          available_amount: inv_item.stock.on_hand - inv_item.stock.allocated,
          ordered_amount: inv_item.stock.ordered,
          on_hand_amount: inv_item.stock.on_hand,
          in_transit_amount: inv_item.stock.in_transit,
          reorder_amount: inv_item.stock.reorder_amount,
          amt_status: assignStatus(
            ingredient.amount,
            inv_item.stock.on_hand - inv_item.stock.allocated,
            inv_item.stock.ordered
          ),
          avoid_recur: inv_item.avoid_recur,
        },
      ];
    } else {
      //TODO: HERE WE HAVE TO SEND TO FRONT END REPORT THAT INGR WAS NOT FOUND
      console.log("INGREDIENT NOT FOUND: " + ingredient.product_code);
    }
  }

  rawIngredientsFinal.sort((a, b) => a.amt_status - b.amt_status);

  return rawIngredientsFinal;
};
//TODO: MAKE A SECOND FINDER FOR FORECAST THAT IGNORES RECURSIVE AVOIDANCE
const recursiveFinder = async (
  product: IForecast,
  force_recursion: boolean
) => {
  let rawIngredients: IForecast[] = [];
  const formula = await Formula.findOne({
    product_code: product.product_code,
  }).sort("-version");
  // console.log(formula, product.product_code)
  if (formula) {
    const f = formula.formula_items;
    product.amount = product.amount; //TODO: Might pose problems if we don't want to adjust within recursive ingredients. (Don't think so, it will adjust accordingly.)

    const materialTypes = await ProductType.find();
    for (const element of f) {
      //TODO: INCOMPLETE
      const mat_type = materialTypes.find((mat_type) =>
        element.material_code.startsWith(mat_type.code)
      );

      if (mat_type && !mat_type.is_raw) {
        //if not a raw material.
        if (!mat_type.avoid_recur || force_recursion) {
          rawIngredients = [
            ...rawIngredients,
            ...(await recursiveFinder(
              {
                product_code: element.material_code,
                amount: (product.amount * element.amount) / 100.0,
              },
              force_recursion
            )),
          ];
        } else {
          const inv_material = await Inventory.findOne({
            id: element.material_id,
            product_code: element.material_code,
          });
          //console.log(f[i].material_id, f[i].material_code, 'bruh')
          if (
            (inv_material &&
              inv_material.stock.on_hand - inv_material.stock.allocated >=
                (product.amount * element.amount) / 100.0) ||
            mat_type.avoid_recur //!maybe split into two!
          ) {
            //if enough in inventory, send straight to production
            //console.log(inv_material.stock.on_hand - inv_material.stock.allocated, (product.amount * f[i].amount) / 100.000000, 'FK calc: ', inv_material.product_code, ' ', mat_type)
            rawIngredients.push({
              product_code: element.material_code,
              amount: (product.amount * element.amount) / 100.0,
            });
          } else {
            //otherwise break it up into the ingredients
            rawIngredients = [
              ...rawIngredients,
              ...(await recursiveFinder(
                {
                  product_code: element.material_code,
                  amount: (product.amount * element.amount) / 100.0,
                },
                force_recursion
              )),
            ];
          }
        }
      } else {
        // if(!mat_type) console.log(f[i], 'product')
        rawIngredients.push({
          product_code: element.material_code,
          amount: (product.amount * element.amount) / 100.0,
        });
      }
    }
  } else {
    //TODO: HERE WE HAVE TO SEND TO FRONT END REPORT THAT FORMULA OF INGR WAS NOT FOUND!
    console.log("FORMULA NOT FOUND: " + product.product_code);
  }

  return rawIngredients;
};

const materialStockFinder = async (product: IForecast) => {
  return null;
};
