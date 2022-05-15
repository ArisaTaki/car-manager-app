import {
  get, del, post, put,
} from './request';
import { ApiData } from './entities';
import { ApiPaths } from '@/services/api-path';

const LargeFileRequestTimeOut = 5 * 60 * 1000;

export const ServicesApi = {
  login: (params: ApiData.Login.Params):
  Promise<ApiData.Login.ResponseData> => post(ApiPaths.login, params),

  AddUser: (params: ApiData.AddUser.Params):
  Promise<ApiData.AddUser.ResponseData> => post(ApiPaths.addUser, params),

  DelUser: (params: ApiData.DelUser.Params):
  Promise<ApiData.DelUser.ResponseData> => post(ApiPaths.delUser, params),

  GetUserDetail: (params: ApiData.GetUserDetail.Params):
  Promise<ApiData.GetUserDetail.ResponseData> => post(ApiPaths.getUserDetail, params),

  SearchUsers: (params: ApiData.SearchUsers.Params):
  Promise<ApiData.SearchUsers.ResponseData> => post(ApiPaths.SearchUsers, params),

  UpdateUser: (params: ApiData.UpdateUser.Params):
  Promise<ApiData.UpdateUser.ResponseData> => post(ApiPaths.UpdateUser, params),

  GetChartsData: ():
  Promise<ApiData.ChartsDataApiMockName.ResponseData> => get(ApiPaths.getEchartsData),

  AddDelegation: (params: ApiData.AddDelegation.Params):
  Promise<ApiData.AddDelegation.ResponseData> => post(ApiPaths.addDelegation, params),

  CheckDelegation: (params: ApiData.CheckDelegation.Params):
  Promise<ApiData.CheckDelegation.ResponseData> => post(ApiPaths.checkDelegation, params),

  DeleteDelegation: (params: ApiData.DeleteDelegation.Params):
  Promise<ApiData.DeleteDelegation.ResponseData> => post(ApiPaths.deleteDelegation, params),

  GetDelegationDetailInfo: (params: ApiData.GetDelegationDetailInfo.Params):
  Promise<ApiData.GetDelegationDetailInfo.ResponseData> => post(ApiPaths.getDelegationDetailInfo,
    params),

  SearchDelegations: (params: ApiData.GetDelegationList.Params):
  Promise<ApiData.GetDelegationList.ResponseData> => post(ApiPaths.getDelegationList, params),

  UpdateDelegation: (params: ApiData.UpdateDelegation.Params):
  Promise<ApiData.UpdateDelegation.ResponseData> => post(ApiPaths.updateDelegation, params),

  AddRepair: (params: ApiData.AddRepair.Params):
  Promise<ApiData.AddRepair.ResponseData> => post(ApiPaths.addRepair, params),

  GetRepairDetail: (params: ApiData.GetRepairDetail.Params):
  Promise<ApiData.GetRepairDetail.ResponseData> => post(ApiPaths.getRepairDetail, params),

  SearchRepairList: (params: ApiData.SearchRepairList.Params):
  Promise<ApiData.SearchRepairList.ResponseData> => post(ApiPaths.getRepairList, params),

  UpdateRepairState: (params: ApiData.UpdateRepairState.Params):
  Promise<ApiData.UpdateRepairState.ResponseData> => post(ApiPaths.updateRepairState, params),

  AddPart: (params: ApiData.AddPart.Params):
  Promise<ApiData.AddPart.ResponseData> => post(ApiPaths.addPart, params),

  DeletePart: (params: ApiData.DelPart.Params):
  Promise<ApiData.DelPart.ResponseData> => post(ApiPaths.deletePart, params),

  GetPartDetail: (params: ApiData.GetPartDetail.Params):
  Promise<ApiData.GetPartDetail.ResponseData> => post(ApiPaths.getPartDetail, params),

  SearchPartList: (params: ApiData.SearchPartList.Params):
  Promise<ApiData.SearchPartList.ResponseData> => post(ApiPaths.getPartList, params),

  UpdatePartInfo: (params: ApiData.UpdatePartInfo.Params):
  Promise<ApiData.UpdatePartInfo.ResponseData> => post(ApiPaths.updatePart, params),

};
