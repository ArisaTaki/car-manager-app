const baseUrl = process.env.NODE_ENV === 'production' ? '' : '/mock';

export const ApiPaths = {
  login: '/api/user/login',
  addUser: '/api/account/add',
  delUser: '/api/account/delete',
  getUserDetail: '/api/account/detail',
  SearchUsers: '/api/account/list',
  UpdateUser: '/api/account/update',
  getEchartsData: '/api/charts',
  getChartsMoneyData: '/api/chartMoney',
  addDelegation: '/api/commission/add',
  checkDelegation: '/api/commission/audit',
  deleteDelegation: '/api/commission/delete',
  getDelegationDetailInfo: '/api/commission/detail',
  getDelegationList: '/api/commission/list',
  updateDelegation: '/api/commission/update',
  addRepair: '/api/repair/add',
  getRepairDetail: '/api/repair/detail',
  getRepairList: '/api/repair/list',
  updateRepairState: '/api/repair/update-state',

};
