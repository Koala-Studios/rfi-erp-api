import Log, { IActivityLog } from "../models/activity-log.model";
import { reply, status } from "../config/config.status";
import { IListParams, ILogicResponse } from "./interfaces.logic";
import { IProcessedQuery, processQuery } from "./utils";
import { IUser } from "../models/user.model";

export const listActivityLogs = async (
  query: string
): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

  const list = await Log.paginate(_filter, {
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

export const getActivityLog = async (
  log_id: string
): Promise<ILogicResponse> => {
  const location = await Log.findById(log_id);
  return {
    status: status.OK,
    data: { message: "", res: location },
  };
};

export const aMODULE = {
  PROJECTS: "projects",
  BATCHING: "batching",
};

export const aLog = (
  user: IUser | "System",
  action: "delete" | "edit" | "create",
  _module: string,
  itemTitle?: string,
  newItem?: JSON
) => {
  let _user: { id: string; username: string };

  if (user === "System") {
    _user = { id: "", username: "System" };
  } else {
    _user = { username: user.username, id: user._id };
  }

  let newActivity = new Log(<IActivityLog>{
    user: { _id: _user.id, username: _user.username },
    action: action,
    module: _module,
    itemTitle: itemTitle,
    newItem: newItem,
    timestamp: new Date().toString(),
  });

  newActivity.timestamp = new Date().toString();

  newActivity.save();
};
