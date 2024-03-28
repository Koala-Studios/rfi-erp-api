import Application, { IApplication } from "../models/application.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import { IProcessedQuery, processQuery } from "./utils";

export const listApplication = async (
  query: string
): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

  const list = await Application.paginate(_filter, {
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

export const ApplicationLookup = async (s_value) => {
  const searchValue = s_value.toString();
  let query = { name: new RegExp(searchValue, "i") };
  const list = await Application.find(query).limit(15);

  return { status: status.OK, data: { message: "", res: list } };
};
