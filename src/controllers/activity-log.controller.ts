import { Security } from "@tsoa/runtime";
import { Body } from "@tsoa/runtime";
import { SuccessResponse } from "@tsoa/runtime";
import { Controller } from "@tsoa/runtime";
import { Post } from "@tsoa/runtime";
import { Tags } from "@tsoa/runtime";
import { Get } from "@tsoa/runtime";
import { Query } from "@tsoa/runtime";
import { Put } from "@tsoa/runtime";
import { Route } from "@tsoa/runtime";
import { Request } from "@tsoa/runtime";
import { Request as eRequest, Response } from "express";
import { reply, status } from "../config/config.status";
import { listProject } from "../logic/project.logic";
import { listActivityLogs } from "../logic/activity-log.logic";

interface ICreateProjectRequest {
  project_name: string;
}

@Route("activity")
@Tags("Activity Log")
@Security("jwt")
export class ActivityController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listActivityRequest(
    @Request() req: eRequest,
    @Query() query: string
  ) {
    const res = await listActivityLogs(query);
    this.setStatus(res.status);
    return res.data;
  }
}
