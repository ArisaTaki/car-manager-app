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
};
