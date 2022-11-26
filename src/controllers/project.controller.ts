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

interface ICreateProjectRequest {
  project_name: string;
}

@Route("projects")
@Tags("Projects")
@Security("jwt")
export class ProjectController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listProject(
    @Request() req: eRequest,
    @Query() page: string,
    @Query() count: string
  ) {
    const _page = parseInt(<string>page);
    const _count = parseInt(<string>count);
    const _projects = await Project.find()
      .sort({ date_created: -1 })
      .skip((_page - 1) * _count)
      .limit(25);
    this.setStatus(status.OK);
    return _projects;
  }

  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getProject(@Request() req: eRequest, @Query() id: string) {
    // console.log(_product,id)
    const _projects = await Project.findById(id);
    this.setStatus(status.OK);
    return {
      status: status.OK,
      data: { message: "Project Details", res: _projects },
    };
  }

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createProject(
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
