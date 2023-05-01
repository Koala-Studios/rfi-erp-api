import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Tags,
} from "@tsoa/runtime";
import jwt from "jsonwebtoken";
import config from "../config/config";
import Identity, { IIdentity } from "../models/identity.model";
import User, { IUser } from "../models/user.model";
import { reply, status } from "../config/config.status";
import { Request as eRequest, Response } from "express";
import { Request } from "@tsoa/runtime";
import { Security } from "@tsoa/runtime";
import { Get } from "@tsoa/runtime";
import Notification, { INotification } from "../models/notification.model";
import UserRole, { IUserRole } from "../models/user-role.model";
import { IGetUserResponse, loadUserInfo } from "../logic/user.logic";

function createToken(user: IUser) {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    config.jwtSecret,
    {
      expiresIn: 86400,
    }
  );
}

interface signupRequest {
  email: string;
  username: string;
  password: string;
}
interface signinRequest {
  username: string;
  password: string;
}

interface signinResponse {
  user: IGetUserResponse;
  token: string;
}

@Route("auth")
@Tags("Identity")
export class IdentityController extends Controller {
  @Post("newuser")
  @SuccessResponse(status.CREATED, reply.success)
  public async signUp(@Body() req: signupRequest): Promise<void> {
    if (
      !req.email ||
      !req.password ||
      !req.username ||
      req.password.length < 5
    ) {
      this.setStatus(status.BAD_REQUEST);
      return;
    }

    let user = await User.findOne({
      $or: [
        { email: req.email.toLowerCase() },
        { username: req.username.toLowerCase() },
      ],
    });

    if (user) {
      this.setStatus(status.CONFLICT);
      return;
    }

    const newUser = new User(<IUser>{
      username: req.username,
      email: req.email,
      photo: "",
      identities: [],
    });

    const newIdentity = new Identity(<IIdentity>{
      user: newUser.id,
      password: req.password,
    });

    newUser.identities.push(newIdentity.id);

    await newIdentity.save();
    await newUser.save();

    this.setStatus(status.CREATED);
    return;
  }

  @Post("login")
  @SuccessResponse(status.OK, reply.success)
  public async signIn(@Body() req: signinRequest): Promise<signinResponse> {
    if (!req.username || !req.password) {
      this.setStatus(status.BAD_REQUEST);
      return;
    }

    // console.log(req.username, req.password);

    const user = await User.findOne({
      $or: [
        { email: req.username.toLowerCase() },
        { username: req.username.toLowerCase() },
      ],
    });

    if (!user) {
      this.setStatus(status.UNAUTHORIZED);
      return;
    }

    const identity = await Identity.findOne({ user: user.id });
    const passwordMatch = await identity.comparePassword(req.password);

    if (passwordMatch) {
      this.setStatus(status.OK);

      const getUserResponse = await loadUserInfo(user);

      return {
        user: getUserResponse,
        token: createToken(user),
      };
    }

    //passwords dont match
    this.setStatus(status.UNAUTHORIZED);
    return;
  }
}
