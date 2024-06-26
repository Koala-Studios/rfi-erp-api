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
import User, { IUser } from "../models/user.model";
import { reply, status } from "../config/config.status";
import {
  listUser,
  loadUserInfo,
  roleLookup,
  userLookup,
} from "../logic/user.logic";
import Notification, { INotification } from "../models/notification.model";
import { ObjectId } from "mongoose";
import UserRole, { IUserRole } from "../models/user-role.model";

interface IGetUserResponse {
  _id: any;
  email: string;
  username: string;
  // photo: string;
  // identities: string[];
  roles: { name: string; permissions: string[] }[];
  notifications: INotification[];
}

//TODO:Implement
export const resetUserPassword = () => {};
export const getUserProjects = () => {};

@Route("user")
@Tags("User")
@Security("jwt")
export class UserController extends Controller {
  // @Get("getNotifications")
  // @SuccessResponse(status.OK, reply.success)
  // public async getNotifications(@Request() req: eRequest) {
  //   const user = <IUser>req.user;

  //   const notifications = Notification.findOne()

  //   this.setStatus(status.OK);
  //   return user.notifications;
  // }

  @Get("getUser")
  @SuccessResponse(status.OK, reply.success)
  public async getUser(@Request() req: eRequest) {
    const _user = <IUser>req.user;

    console.log("get user");

    const getUserResponse = await loadUserInfo(_user);

    this.setStatus(status.OK);
    return getUserResponse;
  }

  @Get("loadUser")
  @SuccessResponse(status.OK, reply.success)
  public async loadUser(@Request() req: eRequest) {
    const _user = <IUser>req.user;

    console.log("loaduser");

    const getUserResponse = await loadUserInfo(_user);

    this.setStatus(status.OK);
    return getUserResponse;
  }

  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listUserRequest(
    @Request() req: eRequest,
    @Query() query: string
  ) {
    const res = await listUser(query);
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

  @Get("role-lookup")
  @SuccessResponse(status.OK, reply.success)
  public async roleLookupRequest(
    @Request() req: eRequest,
    @Query() search_value: string
  ) {
    const res = await roleLookup(search_value);
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
    // console.log("create", newUser);
    this.setStatus(status.CREATED);
    return newUser._id;
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updateUserRequest(@Request() req: eRequest, @Body() u: IUser) {
    console.log("update", u.roles);
    await User.findOneAndUpdate({ _id: u._id }, u);

    this.setStatus(status.OK);
    return true;
  }
}
