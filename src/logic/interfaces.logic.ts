import { IFormulaItem } from "../models/formula.model";

export interface ILogicResponse {
  status: number;
  data: {
    message: string;
    res: any;
  };
}

export interface IListParams {
  page: number;
  count: number;
  filter: string;
}

export interface IListResponse {
  list: any[];
  totalCount: number;
}
