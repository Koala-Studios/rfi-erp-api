import User, { IUser } from "../models/user.model";
import { reply, status } from "../config/config.status";
import { IListParams, ILogicResponse } from "./interfaces.logic";
import { IProcessedQuery, processQuery } from "./utils";
import UserRole, { IUserRole } from "../models/user-role.model";
import Notification, { INotification } from "../models/notification.model";

export interface IGetUserResponse {
  user: IGetUser;
  user_roles: IUserRole[];
}
export interface IGetUser {
  _id: any;
  email: string;
  username: string;
  // photo: string;
  // identities: string[];
  roles: { _id: string; name: string }[];
  notifications: INotification[];
}

export const listUser = async (query: string): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

  const list = await User.paginate(_filter, {
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

export const userLookup = async (s_value) => {
  const searchValue = s_value.toString();
  const list = await User.find({ name: new RegExp(searchValue, "i") }).limit(
    15
  );

  return { status: status.OK, data: { message: "", res: list } };
};

export const roleLookup = async (s_value) => {
  const searchValue = s_value.toString();
  const list = await UserRole.find({
    name: new RegExp(searchValue, "i"),
  }).limit(15);

  return { status: status.OK, data: { message: "", res: list } };
};

//ONLY FOR SESSION USER
export const loadUserInfo = async (_user: IUser): Promise<IGetUserResponse> => {
  // const roleIds = [
  //   _user.roles.forEach((x) => {
  //     return x._id;
  //   }),
  // ];
  const roles = await UserRole.find()
    .where({ "role._id": { $in: _user.roles } })
    .exec();
  // console.log(roles, " THIS IS NOT WORKING CLEARLY");
  let user: IGetUser = {
    _id: _user._id,
    email: _user.email,
    username: _user.username,
    roles: _user.roles,
    notifications: [],
  };

  const nc = await Notification.findOne({ receiverId: user._id });

  if (nc) {
    user.notifications = nc.notifications;
    // console.log(nc.notifications, user);
  }

  console.log(roles);
  return { user: user, user_roles: roles };
};
