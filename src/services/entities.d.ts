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

export interface DelegationDetails extends DelegationInfoBase {
  // 委托id
  id: number;
  // 创建时间
  createTime: string;
  // 审核不通过（流转失败）的原因
  reason: string;
  // 委托单状态 0-待流转 1-审核通过已流转 2-审核不通过
  state: string
}

export interface DelegationListItem extends DelegationInfoBase {
  // 委托id
  id: number;
}

export interface DelegationInfoBase {
  // 故障地址
  bugAddress?: string;
  // 故障日期
  bugDate?: string;
  // 故障描述
  bugDescription: string;
  // 购买日期
  buyDate?: string;
  // 汽车型号
  carModel: string;
  // 创建人名称
  createName: string;
  // 用户邮箱
  email?: string;
  // 用户电话
  phone: string;
  // 用户名称
  userName: string;
  // 用户留言要求
  userRequire?: string
}

export interface RepairInfoBase {
  // 委托id
  commissionId: number,
  // 创建人
  createBy: number,
  // 创建人名称
  createName: string,
  // 维修时间
  repairDate: string,
  // 维修站
  repairStation: string,
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

    export interface ResponseDataDetail<T> {
      list: T[],
      pages: number,
      total: number,
    }

    type ResponseData = BaseResponse<ResponseDataDetail<UserInfoDetailsWithId>>;
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

  // 添加委托
  namespace AddDelegation {
    interface Params extends DelegationInfoBase {
      // 创建人id
      createBy: number;
    }
    type ResponseData = BaseResponse;
  }

  // 审核委托单
  namespace CheckDelegation {
    interface Params {
      id: number,
      state: number
    }
    type ResponseData = BaseResponse;
  }

  // 删除委托单
  namespace DeleteDelegation {
    interface Params {
      id: number;
    }

    type ResponseData = BaseResponse;
  }

  // 查询委托详情
  namespace GetDelegationDetailInfo {
    interface Params {
      id: number;
    }

    type ResponseData = BaseResponse<DelegationDetails>;
  }

  // 获取委托列表
  namespace GetDelegationList {
    interface Params {
      keyword?: string
      pageIndex?: number,
      pageSize?: number,
      state?: number
    }

    export interface ResponseDataDetail<T> {
      list: T[],
      pages: number,
      total: number,
    }

    type ResponseData = BaseResponse<ResponseDataDetail<DelegationListItem>>;
  }

  // 更新委托
  namespace UpdateDelegation {
    interface Params extends DelegationInfoBase {
      // 创建人id
      createBy: number;
      // 委托id
      id: number;
    }

    type ResponseData = BaseResponse;
  }

  // 创建维修
  namespace AddRepair {
    type Params = RepairInfoBase;
    type ResponseData = BaseResponse;
  }

  // 查询维修详情
  namespace GetRepairDetail {
    interface Params {
      // 维修id
      id: number
    }

    export interface RepairDetailInfo extends RepairInfoBase{
      // 创建时间
      createTime: string
      // 维修单id
      id: number
      // 维修状态 0-待维修 1-维修中 2-已维修
      state: number
    }

    type ResponseData = BaseResponse<RepairDetailInfo>;
  }

  // 分页查询维修列表
  namespace SearchRepairList {
    import RepairDetailInfo = ApiData.GetRepairDetail.RepairDetailInfo;

    interface Params {
      // 当前页，默认第一页,示例值(1)
      pageIndex?: number,
      // 每页显示条数，默认20,示例值(20)
      pageSize?: number,
      // 维修状态 0-待维修 1-维修中 2-已维修 null-全部
      state?: number
    }

    export interface ResponseDataDetail<T> {
      list: T[],
      pages: number,
      total: number,
    }

    type ResponseData = BaseResponse<ResponseDataDetail<RepairDetailInfo>>;
  }

  // 更新维修状态
  namespace UpdateRepairState {
    interface Params {
      id: number,
      state: number
    }
    type ResponseData = BaseResponse;
  }
}
