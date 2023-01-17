import { Tags } from "@tsoa/runtime";
import { Post } from "@tsoa/runtime";
import { Put } from "@tsoa/runtime";
import { Body } from "@tsoa/runtime";
import {
  Controller,
  Get,
  Request,
  Route,
  Security,
  SuccessResponse,
} from "@tsoa/runtime";
import { Request as eRequest } from "express";
import { Query } from "tsoa";
import User, { INotification, IUser } from "../models/user.model";
import { reply, status } from "../config/config.status";
import { listUser, userLookup } from "../logic/user.logic";

interface IGetUserResponse {
  email: string;
  username: string;
  photo: string;
  identities: string[];
  friends: string[];
  notifications: INotification[];
}

//TODO:Implement
export const resetUserPassword = () => {};
export const getUserProjects = () => {};

@Route("user")
@Tags("User")
@Security("jwt")
export class UserController extends Controller {
  @Get("getNotifications")
  @SuccessResponse(status.OK, reply.success)
  public async getNotifications(@Request() req: eRequest) {
    const user = <IUser>req.user;
    this.setStatus(status.OK);
    return user.notifications;
  }
  @Get("getUser")
  @SuccessResponse(status.OK, reply.success)
  public async getUser(@Request() req: eRequest) {
    const user = <IGetUserResponse>req.user;

    if (!user) {
      this.setStatus(status.BAD_REQUEST);
      return;
    }

    this.setStatus(status.OK);
    return user;
  }

  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listUserRequest(
    @Request() req: eRequest,
    @Query() page: string,
    @Query() count: string
  ) {
    const _page = parseInt(<string>page);
    const _count = parseInt(<string>count);

    const res = await listUser({
      page: _page,
      count: _count,
      filter: "",
    });
    this.setStatus(res.status);
    return res.data;
  }

  @Get("lookup")
  @SuccessResponse(status.OK, reply.success)
  public async userLookupRequest(
    @Request() req: eRequest,
    @Query() search_value: string
  ) {
    const res = await userLookup(search_value);
    this.setStatus(res.status);

    return res.data;
  }

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createUserRequest(
    @Request() req: eRequest,
    @Body() body: IUser
  ) {
    const mongoose = require("mongoose");
    body._id = new mongoose.Types.ObjectId();
    const newUser = new User(body);

    newUser.save();
    console.log("create", newUser);
    this.setStatus(status.CREATED);
    return newUser._id;
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updateUserRequest(
    @Request() req: eRequest,
    @Body() u: IUser
  ) {
    console.log("update", u);
    await User.findOneAndUpdate({ _id: u._id }, u);

    this.setStatus(status.OK);
    return true;
  }


}
