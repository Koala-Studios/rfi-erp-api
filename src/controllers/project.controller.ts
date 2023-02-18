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
import { ObjectId } from "mongodb";
import { Deprecated } from "tsoa";
import { createNotification, textNotification } from "../logic/user.logic";
import { IUser } from "../models/user.model";

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

    const res = await listProject({
      page: _page,
      count: _count,
      filter: "",
    });
    this.setStatus(res.status);
    return res.data;
  }

  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getProjectRequest(
    @Request() req: eRequest,
    @Query() id: string
  ) {
    const _project = await Project.findById(id);

    const currUser = <IUser>req.user;

    textNotification(
      "Opened a project wow",
      false,
      "System",
      currUser.id.toString()
    );

    this.setStatus(status.OK);
    return _project;
  }

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createProjectRequest(
    @Request() req: eRequest,
    @Body() body: IProject
  ) {
    const mongoose = require("mongoose");
    body._id = new mongoose.Types.ObjectId();
    const newProject = new Project(body);

    newProject.save();
    this.setStatus(status.CREATED);
    return newProject._id;
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updateProjectRequest(
    @Request() req: eRequest,
    @Body() p: IProject
  ) {
    await Project.findOneAndUpdate({ _id: p._id }, p);

    this.setStatus(status.OK);
    return true;
  }
}
