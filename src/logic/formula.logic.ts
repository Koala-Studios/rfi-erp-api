import { reply, status } from "../config/config.status";
import Formula, { IFormula } from "../models/formula.model";
import Product from "../models/product.model";
import Inventory from "../models/inventory.model";
import mongoose from "mongoose";
import { IFormulaSubmitInfo, ILogicResponse } from "./interfaces.logic";

let ObjectId = require("mongodb").ObjectId;
export const getFormula = async (
  product_id,
  version
): Promise<ILogicResponse> => {
  let _status: number;

  const p_id = new ObjectId(product_id);
  const ver = parseInt(version);

  const _formula = await Formula.aggregate(
    [
      {
        $match: { $and: [{ product_id: p_id }, { version: ver }] },
      },
      // { $limit : 1},
      {
        $lookup: {
          from: "inventory",
          let: {
            ingredients: "$formula_items",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$ingredients.material_id"],
                },
              },
            },
            {
              $project: {
                name: 1.0,
                cost: 1.0,
              },
            },
          ],
          as: "ing_info",
        },
      },
      {
        $addFields: {
          formula_items: {
            $map: {
              input: "$formula_items",
              in: {
                $let: {
                  vars: {
                    m: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$ing_info",
                            cond: {
                              $eq: ["$$mb._id", "$$this.material_id"],
                            },
                            as: "mb",
                          },
                        },
                        0.0,
                      ],
                    },
                  },
                  in: {
                    $mergeObjects: [
                      "$$this",
                      {
                        material_name: "$$m.name",
                        cost: "$$m.cost",
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      {
        $unset: ["ing_info"],
      },
    ],
    {
      allowDiskUse: false,
    }
  );
  if (!_formula[0]) {
    _status = status.OK;
    return {
      status: _status,
      data: { message: "No Formula Found", res: null },
    };
  }
  _status = status.OK;
  return {
    status: _status,
    data: { message: "Formula Found", res: _formula[0] },
  };
};

export const submitFormula = async (
  formula: IFormula,
  approved: boolean,
  description: string
): Promise<ILogicResponse> => {
  let _status: number;
  let _message: string;

  //TODO: implement check for FDA status in ingredients vs in product
  let product = await Product.findById(formula.product_id);

  //!If product is already approved
  if (product.status === 4) {
    _status = status.FORBIDDEN;
    _message = "Product is already approved!";
    return { status: _status, data: { message: _message, res: product } };
  }

  product.versions += 1;
  product.rec_dose_rate = formula.rec_dose_rate;
  product.description = description;
  //*If flavorist is setting product as ready for approval
  if (approved || product.status === 3) {
    product.status = 3;
    product.approved_version = product.versions;
    _message = "Formula Submitted & Ready For Manager Approval!";
  } else {
    _message = "Formula Submitted!";
  }

  const newDevelopment = new Formula(<IFormula>{
    product_id: product._id,
    product_code: product.product_code,
    version: product.versions,
    yield: formula.yield,
    base: formula.base,
    rec_dose_rate: formula.rec_dose_rate,
    date_created: new Date(),
    formula_items: formula.formula_items,
    description: description,
  });

  console.log(newDevelopment, product, "TEST SUBMIT");
  newDevelopment.save();
  product.save();

  _status = status.OK;

  return { status: _status, data: { message: _message, res: product } };
};

//R&D Manager Approval
export const approveFormula = async (
  formula: IFormulaSubmitInfo
): Promise<ILogicResponse> => {
  let _status = status.OK;
  let _message = "Formula Approved!";

  let _product = await Product.findOneAndUpdate(
    { _id: formula.product_id },
    { $set: { status: 4 } },
    { new: true }
  );
  return { status: _status, data: { message: _message, res: _product } };
};
