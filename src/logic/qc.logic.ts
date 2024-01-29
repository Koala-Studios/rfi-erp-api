import QualityControl, { IQualityControl } from "../models/qc.model";
import { reply, status } from "../config/config.status";
import { IListParams, ILogicResponse } from "./interfaces.logic";
import { IProcessedQuery, processQuery } from "./utils";

export const listQualityControl = async (
  query: string
): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

  const list = await QualityControl.paginate(_filter, {
    page: _page,
    limit: _count,
    leanWithId: true,
    // sort: { date_created: 'desc' }
  });
  return {
    status: status.OK,
    data: { message: "", res: list },
  };
};

export const getQualityControl = async (
  qc_id: string
): Promise<ILogicResponse> => {
  const qc = await QualityControl.findById(qc_id);
  return {
    status: status.OK,
    data: { message: "", res: qc },
  };
};

export const createQualityControl = async (qc: IQualityControl) => {
  const _qc = new QualityControl(qc);
  _qc.save();
  return {
    status: status.OK,
    data: { message: "", res: qc },
  };
};
