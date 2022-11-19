import { IFormulaItem } from "../models/formula.model";

export interface ILogicResponse {

    status:number;
    data:{
        message:string; 
        res:any};
}

export interface IDevelopmentSubmitInfo {
    yield?:number;
    formula_items: IFormulaItem[];
    product_id: string;
    approved: boolean;
}

export interface ICreateBatchingInfo {
    quantity: number;
    batch_code: string;
    product_id: string;
}