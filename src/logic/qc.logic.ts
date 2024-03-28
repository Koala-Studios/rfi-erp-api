import QualityControl, { IQualityControl, qcStatus } from "../models/qc.model";
import { reply, status } from "../config/config.status";
import { IListParams, ILogicResponse } from "./interfaces.logic";
import { IProcessedQuery, processQuery } from "./utils";
import InventoryStock, {
  IInventoryStock,
} from "../models/inventory-stock.model";
import Location, { ILocation } from "../models/location.model";
export const listQualityControl = async (
  query: string
): Promise<ILogicResponse> => {
  const { _filter, _page, _count }: IProcessedQuery = processQuery(query);

  const list = await QualityControl.paginate(_filter, {
    page: _page,
    limit: _count,
    leanWithId: true,
    // sort: { date_created: 'desc' }
  });
  return {
    status: status.OK,
    data: { message: "", res: list },
  };
};

export const getQualityControl = async (
  qc_id: string
): Promise<ILogicResponse> => {
  const qc = await QualityControl.findById(qc_id);
  return {
    status: status.OK,
    data: { message: "", res: qc },
  };
};

export const createQualityControl = async (qc: IQualityControl) => {
  const _qc = new QualityControl(qc);
  _qc.save();
  return {
    status: status.OK,
    data: { message: "", res: qc },
  };
};

export const handleQualityControlResult = async (
  qc: IQualityControl,
  passed: boolean
) => {
  const _qc = await QualityControl.findById(qc._id);
  const container = await InventoryStock.findById(_qc.container_id);
  const location = await Location.findOne({ code: passed ? "WB" : "QT" });
  container.qc_tests = [
    { test_date: new Date(), passed: passed },
    ...container.qc_tests,
  ];
  container.location = {
    _id: location._id,
    code: location.code,
    name: location.name,
  };
  container.save();
  qc.status = passed ? qcStatus.APPROVED : qcStatus.FAILED;
  qc.save();
  return {
    status: status.OK,
    data: {
      message:
        "Sent " + qc.lot_number + passed
          ? " to Waiting Bay!"
          : " to Quarantine!",
      res: qc,
    },
  };
};
