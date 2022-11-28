import Project, { IProject } from "../models/project.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";

export const listProject = async (
  listParams: IListParams
): Promise<ILogicResponse> => {
  const listOptions = {
    page: listParams.page,
    limit: listParams.count,
    leanWithId: true,
  };

  const listResult = Project.paginate({}, listOptions, (err, result) => {});

  return {
    status: status.OK,
    data: { message: "Formula Found", res: listResult },
  };
};
