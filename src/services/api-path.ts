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
};
