import { ECBasicOption } from 'echarts/types/dist/shared';

export interface BaseResponse<T = any> {
  // 返回message
  message: string
  // 状态code：200 success。201 error，之后再细分
  code: string
  successful: boolean
  data: T
}

export interface UserTokenKeyInfo {
  email: string;
  phone: string;
  token?: string;
  type: number;
  userId: number;
  userName: string;
  userTitle: string;
}

export interface UserInfoDetails {
  createName: string;
  createTime: string;
  email: string;
  phone: string;
  type: number;
  userName: string;
  userTitle: string;
  userId?: number;
}

export interface UserInfoDetailsWithId extends UserInfoDetails {
  userId: number;
}

export interface UserInfo {
  // 头像
  image: string
  // 昵称
  username: string
}

export interface ResponseDataCharts {
  titleMock: {
    textMock: string;
  },
  tooltipMock: unknown,
  xAxisMock: {
    dataMock: string[],
  },
  yAxisMock: {
    dataMock: string[]
  },
  seriesMock: {
    nameMock: string,
    typeMock: string,
    dataMock: number[],
  }[]
}

export interface AddUserInfo {
  createBy?: number,
  createName?: string,
  email?: string,
  password: string,
  phone?: string,
  type: number,
  userName: string,
  userTitle: string
}

export namespace ApiData {
  // 用户登录信息
  namespace Login {
    interface Params {
      // 账户
      userName: string
      // 密码
      password: string
      // 账户类别
      type: number
    }
    type ResponseData = BaseResponse<UserTokenKeyInfo>;
  }

  // 添加用户
  namespace AddUser {
    type Params = AddUserInfo;
    type ResponseData = BaseResponse<number>;
  }

  // 删除用户
  namespace DelUser {
    interface Params {
      userId: number
    }

    type ResponseData = BaseResponse;
  }

  // 获取用户详情
  namespace GetUserDetail {
    interface Params {
      userId: number
    }

    type ResponseData = BaseResponse<UserInfoDetails>;
  }

  // 分页查询用户列表
  namespace SearchUsers {
    interface Params {
      keyword?: string
      pageIndex?: number,
      pageSize?: number,
      type?: number
    }

    export interface ResponseDataDetail {
      list: UserInfoDetailsWithId[],
      pages: number,
      total: number,
    }

    type ResponseData = BaseResponse<ResponseDataDetail>;
  }

  // 更新用户信息
  namespace UpdateUser {
    interface Params {
      email?: string;
      phone?: string;
      userId: number;
      userTitle: string;
    }

    type ResponseData = BaseResponse;
  }

  // charts的数据
  namespace ChartsDataApiMockName {
    type ResponseData = BaseResponse<ResponseDataCharts>;
  }
}
