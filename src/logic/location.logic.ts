import Location, { ILocation } from "../models/location.model";
import { reply, status } from "../config/config.status";
import { IListParams, ILogicResponse } from "./interfaces.logic";
import { IProcessedQuery, processQuery } from "./utils";

export const listLocation = async (query: string): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

  const list = await Location.paginate(_filter, {
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

export const getLocation = async (
  location_id: string
): Promise<ILogicResponse> => {
  const location = await Location.findById(location_id);
  return {
    status: status.OK,
    data: { message: "", res: location },
  };
};

export const locationLookup = async (s_value) => {
  const searchValue = s_value.toString();
  const list = await Location.find({
    name: new RegExp(searchValue, "i"),
  }).limit(15);
  return { status: status.OK, data: { message: "", res: list } };
};
