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
		.sort({date_created:-1})
		.skip((_page-1) * _count)
		.limit(_count);
  
	  this.setStatus(status.OK);
	  return _users;
	}  
}

export const createNotification = async (
	io,
	userId: string,
	action: number,
	object: string
): Promise<{ action: number; object: string }> => {
	let notification: INotification = {
		_id: null,
		action: action,
		object: object,
	};
	const user = await User.findById(userId);
	user.notifications.push(notification);
	user.save();

	notification = user.notifications[user.notifications.length - 1];

	//TODO: notify the user

	return notification;
};

export const deleteUserNotification = async (
	userId: string,
	notificationId: string
) => {
	let user = await User.findById(userId);
	if (user) {
		user.notifications = user.notifications.filter(
			(item) => item._id != notificationId
		);
		user.save();
	}
};