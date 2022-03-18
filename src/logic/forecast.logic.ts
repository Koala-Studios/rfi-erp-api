import Formula, { IFormula } from "../models/formula.model";

export interface IForecast {
  product_code: string;
  amount: number;
}

export const calculateMaterials = async(
  products: IForecast[]
):Promise<IForecast[]> => {
  
  let rawIngredients: IForecast[] = [];  
  let rawIngredientsFinal: IForecast[] = [];
  for (let i = 0; i < products.length; i++) {
    rawIngredients = [...rawIngredients,...await recursiveFinder(products[i])];
  }
  rawIngredients = Array.from(rawIngredients.reduce(
    (m, {product_code, amount}) => m.set(product_code, (m.get(product_code) || 0) + amount), new Map
  ), ([product_code, amount]) => ({product_code, amount}));
  return rawIngredients
};

const recursiveFinder = async (product: IForecast) => {
  const materialTypes = ["FL", "FK", "FE", "SM"];

  let rawIngredients: IForecast[] = [];
  
  const formula = await Formula.findOne({ product_code: product.product_code, $max: "version"});

  const f = formula.formula_items;

  for (let i = 0; i < f.length; i++) {
    if (materialTypes.some((substring) => f[i].material_code.startsWith(substring))) {
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
