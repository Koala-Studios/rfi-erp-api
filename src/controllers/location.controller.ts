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
import Location, { ILocation } from "../models/location.model";
import { reply, status } from "../config/config.status";
import {
  getLocation,
  listLocation,
  locationLookup,
} from "../logic/location.logic";

@Route("location")
@Tags("Location")
@Security("jwt")
export class LocationController extends Controller {
  @Get("list")
  @SuccessResponse(status.OK, reply.success)
  public async listLocationRequest(
    @Request() req: eRequest,
    @Query() query: string
  ) {
    const res = await listLocation(query);
    this.setStatus(res.status);
    return res.data;
  }

  @Get("get")
  @SuccessResponse(status.OK, reply.success)
  public async getLocationRequest(
    @Request() req: eRequest,
    @Query() location_id: string
  ) {
    const res = await getLocation(location_id);
    this.setStatus(res.status);

    return res.data;
  }

  @Get("lookup")
  @SuccessResponse(status.OK, reply.success)
  public async locationLookupRequest(
    @Request() req: eRequest,
    @Query() search_value: string
  ) {
    const res = await locationLookup(search_value);
    this.setStatus(res.status);

    return res.data;
  }

  @Post("create")
  @SuccessResponse(status.CREATED, reply.success)
  public async createLocationRequest(
    @Request() req: eRequest,
    @Body() body: ILocation
  ) {
    const mongoose = require("mongoose");
    body._id = new mongoose.Types.ObjectId();
    const newLocation = new Location(body);

    newLocation.save();
    console.log("create", newLocation);
    this.setStatus(status.CREATED);
    return newLocation._id;
  }

  @Post("update")
  @SuccessResponse(status.OK, reply.success)
  public async updateLocationRequest(
    @Request() req: eRequest,
    @Body() u: ILocation
  ) {
    await Location.findOneAndUpdate({ _id: u._id }, u); //TODO: remove findoneandupdate and similar functions as they bypass the mongoose type checks

    this.setStatus(status.OK);
    return true;
  }
}
