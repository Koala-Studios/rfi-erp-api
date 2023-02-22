import User, { IUser } from "../models/user.model";
import { reply, status } from "../config/config.status";
import { IListParams, ILogicResponse } from "./interfaces.logic";

export const listUser = async (
  listParams: IListParams
): Promise<ILogicResponse> => {
  const list = await User.paginate(
    {},
    { page: listParams.page, limit: listParams.count, leanWithId: true }
  );

  return {
    status: status.OK,
    data: { message: "", res: list },
  };
};

export const userLookup = async (s_value) => {
  const searchValue = s_value.toString();
  const list = await User.find({ name: new RegExp(searchValue, "i") }).limit(
    15
  );

  return { status: status.OK, data: { message: "", res: list } };
};
