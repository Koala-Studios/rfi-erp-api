import { reply, status } from "../config/config.status";
import Formula, { IFormula } from "../models/formula.model";
import Product from "../models/product.model";
import Inventory from "../models/inventory.model";
import mongoose from "mongoose";
import { ILogicResponse } from "./interfaces.logic";

let ObjectId = require("mongodb").ObjectId;
export const getFormula = async (
  product_id,
  version: string | null = null
): Promise<ILogicResponse> => {
  let _status: number;
  let ver: number;
  const p_id = new ObjectId(product_id);
  if (version) {
    ver = parseInt(version);
  } else {
    ver = (await Product.findById(product_id)).versions;
  }

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

  if (product.status === 1) {
    product.status = 2;
  }

  product.versions += 1;
  formula.version = product.versions;
  product.rec_dose_rate = formula.rec_dose_rate;
  product.description = description;
  //*If flavorist is setting product as ready for approval
  if (approved || product.status === 3) {
    if (!product.for_sale) {
      product.status = 4;
      _message = "Formula Submitted & Approved!";
      //TODO: MAKE QC SPEC SHEET ORDER HERE!
    } else {
      product.status = 3;
      _message = "Formula Submitted & Ready For Manager Approval!";
    }
    product.approved_version = product.versions;
  } else {
    _message = "Formula Submitted!";
  }
  formula._id = new mongoose.Types.ObjectId();
  const newDevelopment = new Formula({ ...formula, date_created: new Date() });

  newDevelopment.save();
  product.save();

  _status = status.OK;

  const _formula = await getFormula(product._id, product.versions.toString()); //This is cause getFormula uses an aggregate query, so we can't just send raw formula
  return {
    status: _status,
    data: { message: _message, res: [product, _formula.data.res] },
  };
};

//R&D Manager Approval
export const approveFormula = async (
  product_id: string
): Promise<ILogicResponse> => {
  let _status = status.OK;
  let _message = "Formula Approved!";

  let _product = await Product.findById(product_id);

  const _formula = await Formula.findOneAndUpdate(
    { product_id: product_id, version: _product.versions },
    { $set: { approved: true } },
    { new: true }
  );
  let _cost = 0;
  for (const item of _formula.formula_items) {
    const product = await Inventory.findById(item.material_id);
    if (product) {
      _cost += product.cost;
    }
  }

  _product.status = 4;
  _product.cost = _cost;
  _product.approved_version = _product.versions;
  _product.save();

  //TODO: MAKE QC SPEC SHEET ORDER HERE!
  return { status: _status, data: { message: _message, res: _product } };
};

//R&D Manager Approval
export const disapproveFormula = async (
  product_id: string
): Promise<ILogicResponse> => {
  let _status = status.OK;
  let _message = "Formula Disapproved!";

  let _product = await Product.findOneAndUpdate(
    { _id: product_id },
    { $set: { status: 2 } },
    { new: true }
  );
  return { status: _status, data: { message: _message, res: _product } };
};
