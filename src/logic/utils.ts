// export const queryToObject = (query: string) => {
//   const params = new URLSearchParams(query);
//   const res = paramsToObject(params);
//   console.log(res);
//   return res;
// };
import ProductType, {IProductType} from "../models/product-type.model";
import Product, {IProduct} from "../models/product.model";

export const generateProductCode = async (product_type:IProductType) => {
    const result:any = await Product.aggregate([{$match : {"product_code": { $regex : new RegExp('^' + product_type.code)  }}},
                    {$group:
                    {
                    _id:"$product_type",
                    'number': {$max: {$toInt: { $substrCP: ["$product_code", 2 , {"$subtract": [ {$strLenCP: '$product_code'}, product_type.code.length ] } ]}}}
                    }
                    }
                ])
    const raw_number = result.length > 0 ? result[0].number : 0;
    let product_code = product_type.code + "00000";
    product_code = product_code.substring(0, product_code.length - raw_number.toString().length ) + (raw_number + 1)
    
    return product_code;
}