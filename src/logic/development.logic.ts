import Formula, { IFormula, IFormulaItem } from "../models/formula.model";
import Product from "../models/product.model";
import { reply, status } from "../config/config.status";
import { IDevelopmentSubmitInfo, ILogicResponse } from "./interfaces.logic";


export const submitFormula = async (submitInfo: IDevelopmentSubmitInfo):Promise<ILogicResponse> => {

    let _status:number;
    let _message:string;

    //TODO: implement check for FDA status in ingredients vs in product
    let product = await Product.findById(submitInfo.product_id);

    //!If product is already approved
    if(product.status == 4) {
        _status = status.FORBIDDEN;
        _message = "Product is already approved!";
        return {status:_status,data:{message:_message,res:null}};
    }

    product.versions+= 1;

    //*If flavorist is setting product as ready for approval
    if(submitInfo.approved) {
        product.status = 3;
        _message = "Formula Submitted & Ready For Approval!";
    } else {
        _message = "Formula Submitted!";
    }
    
    const newDevelopment = new Formula(<IFormula>{
        product_code: product.code,
        version: product.versions,
        date_created: new Date(),
        formula_items: submitInfo.formula_items
    });

    newDevelopment.save();
    product.save();

    _status = status.OK;

    return {status:_status, data:{message:_message,res:newDevelopment}};
}