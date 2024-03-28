import ContainerSize, { IContainerSize } from "../models/container-size.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";
import { IProcessedQuery, processQuery } from "./utils";

export const listContainerSize = async (
  query: string
): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

  const list = await ContainerSize.paginate(_filter, {
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

export const ContainerSizeLookup = async (s_value) => {
  const searchValue = s_value.toString();
  let query = { name: new RegExp(searchValue, "i") };
  const list = await ContainerSize.find(query).limit(15);

  return { status: status.OK, data: { message: "", res: list } };
};
