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
import logger from "../logger/logger";
import Project, { IProject } from "../models/project.model";
import { reply, status } from "../config/config.status";
import { listProject } from "../logic/project.logic";

interface ICreateProjectRequest {
  project_name: string;
}

@Route("projects")
@Tags("Projects")
@Security("jwt")
export class ProjectController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listProjectRequest(
    @Request() req: eRequest,
    @Query() page: string,
    @Query() count: string
  ) {
    const _page = parseInt(<string>page);
    const _count = parseInt(<string>count);

    const res = await listProject({ page: _page, count: _count, filter: "" });
    this.setStatus(res.status);
    console.log(res.data);
    return res.data;
  }

  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getProjectRequest(
    @Request() req: eRequest,
    @Query() id: string
  ) {
    let ObjectId = require("mongodb").ObjectId;
    const project_id = new ObjectId(id);
    const _project = await Project.findById(project_id);
    this.setStatus(status.OK);
    return _project;
  }

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createProjectRequest(
    @Request() req: eRequest,
    @Body() body: ICreateProjectRequest
  ) {
    console.log(body);

    const newProject = new Project(<IProject>{
      name: body.project_name,
    });

    newProject.save();
    console.log(newProject);
    this.setStatus(status.CREATED);
    return newProject;
  }
}
