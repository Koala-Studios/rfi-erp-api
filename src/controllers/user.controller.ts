import { Tags } from "@tsoa/runtime";
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
import { userLookup } from "../logic/user.logic";

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
export const getUserRooms = () => {};
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
  public async listUsers(
    @Request() req: eRequest,
    @Query() page: string,
    @Query() count: string
  ) {
    const _page = parseInt(<string>page);
    const _count = parseInt(<string>count);

    const _users = await User.find()
      .sort({ date_created: -1 })
      .skip((_page - 1) * _count)
      .limit(_count);

    this.setStatus(status.OK);
    return _users;
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
}
