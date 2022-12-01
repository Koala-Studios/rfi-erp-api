import Project, { IProject } from "../models/project.model";
import { IListParams, IListResponse, ILogicResponse } from "./interfaces.logic";
import { reply, status } from "../config/config.status";

export const listProject = async (
  listParams: IListParams
): Promise<ILogicResponse> => {
  const listOptions = {
    page: listParams.page,
    limit: listParams.count,
    leanWithId: true,
  };

  const list = await Project.paginate(
    {},
    { page: listParams.page, limit: listParams.count, leanWithId: true }
  );

  return {
    status: status.OK,
    data: { message: "", res: list },
  };
};

export const updateProject = async (placeholder):Promise<ILogicResponse> => {
  //If user changes project fields or they add flavors to the sample request
  return {status: null, data:{message: null,res: null}};
}


export const updateFlavor= async (placeholder):Promise<ILogicResponse> => {
  //If a flavor from the request is updated (user is assigned to it, or a new formula is assigned to it, etc)
  return {status: null, data:{message: null,res: null}};
}


//This is for the R&D manager
export const approveFlavor = async (placeholder):Promise<ILogicResponse> => {
  //set status to approved
  //if existing flavor, send to QC
  //if new flavor set flavor status to 4 (using formula logic)
  //send to QC

  return {status: null, data:{message: null,res: null}};
}

export const disapproveFlavor = async (placeholder):Promise<ILogicResponse> => {
  //if new formula, set status of formula's product to 2 (in progress) and set project flavor's status to "needs changes" or something
  //if existing formula (which may have other customers), only do second step (set project flavor's status to "need changes") - (user's responsibility AKA they'll prob change formulas to something else) 
  return {status: null, data:{message: null,res: null}};
}


//This is for the sales person in behalf of the customer
export const acceptFlavor = async (placeholder):Promise<ILogicResponse> => {
  //set flavor status to accepted
  //update product's customers to include project customer 
  return {status: null, data:{message: null,res: null}};
}

export const declineFlavor = async (placeholder):Promise<ILogicResponse> => {
  //set flavor status to declined
  //update product's customers to include project customer


  //!This can be done in different functions (since they'll be their own step)
  //after this step, R&D manager or flavorist will need to choose what to do next, here are the options:
  //clone formula and save clone (if they like the formula but customer doesn't, most likely for future use essentially lol), then revert formula status to in progress
  //revert formula status to in progress (if they don't like the formula and customer wants minor changes)
  //remove formula from flavor & assign a new one (most likely if customer doesn't like the sent flavor whatsoever lol)

  return {status: null, data:{message: null,res: null}};
}
