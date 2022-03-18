import Formula, { IFormula } from "../models/formula.model";

export interface IForecast {
   product_code: string; amount: number ;
}

export const calculateMaterials = async (products:IForecast[]): Promise<IForecast[]> => {
  let _calculatedForecast: IForecast[] = await recursiveFinder(products);

  return _calculatedForecast;
};

const recursiveFinder = async (products:IForecast[]) => {
  const materialTypes = ["FL","FK","FE","SM"];
  let rawIngredients:IForecast[] = [];
  let recursedIngredients:IForecast[] = [];
  products.forEach(async product => {
    const formula = await Formula.findOne({product_code : product.product_code});
    formula.formula_items.forEach(async ingredient => {
      if(materialTypes.some(substring => ingredient.material_code.includes(substring))) {
        recursedIngredients = await recursiveFinder([{product_code: ingredient.material_code, amount: product.amount*ingredient.amount}])
      } else {
        rawIngredients.push({product_code: ingredient.material_code, amount: product.amount*ingredient.amount})
      }
    });
  });
  if(recursedIngredients.length > 0) {
    rawIngredients = rawIngredients.concat(recursedIngredients);
  }
  return rawIngredients;
}


