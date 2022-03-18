import Formula, { IFormula } from "../models/formula.model";

interface ICalculatedForecast {
  materials: { material_id: string; amount: number }[];
}

export const calculateMaterials = async ([
  { product_id, amount },
]): Promise<ICalculatedForecast> => {
  let _calculatedForecast: ICalculatedForecast = {
    materials: [
      {
        material_id: "RM0001",
        amount: 100,
      },
      {
        material_id: "RM0002",
        amount: 200,
      },
      {
        material_id: "RM0003",
        amount: 300,
      },
    ],
  };

  return _calculatedForecast;
};
export const calculateMaterialsR = async ([
  { product_id, amount },
]): Promise<ICalculatedForecast> => {
  let _calculatedForecast: ICalculatedForecast = {
    materials: [
      {
        material_id: "RM0001",
        amount: 200,
      },
      {
        material_id: "RM0001",
        amount: 200,
      },
      {
        material_id: "RM0001",
        amount: 200,
      },
    ],
  };

  return _calculatedForecast;
};
