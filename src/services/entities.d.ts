import { Moment } from 'moment';

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
  date: string[],
  result: number[]
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

export interface ServiceReportTableColumns {
  [name: string]: string
}

export interface DelegationDetails extends DelegationInfoBase {
  // 委托id
  id?: number;
  // 创建时间
  createTime?: string;
  // 审核不通过（流转失败）的原因
  reason?: string;
  // 委托单状态 0-待流转 1-审核通过已流转 2-审核不通过
  state?: string
}

export interface DelegationListItem extends DelegationInfoBase {
  // 委托id
  id: number;
}

export interface DelegationInfoBaseByMoment {
  // 故障地址
  bugAddress?: string;
  // 故障日期
  bugDate?: Moment;
  // 故障描述
  bugDescription: string;
  // 购买日期
  buyDate?: Moment;
  // 汽车型号
  carModel: string;
  // 创建人名称
  createName?: string;
  // 用户邮箱
  email?: string;
  // 用户电话
  phone: string;
  // 审核状态
  state?: number;
  // 用户名称
  userName: string;
  // 用户留言要求
  userRequire?: string
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
  createName?: string;
  // 用户邮箱
  email?: string;
  // 用户电话
  phone: string;
  // 审核状态
  state?: number;
  // 用户名称
  userName: string;
  // 用户留言要求
  userRequire?: string
}

// 维修模块
// region
export interface RepairInfoBase {
  // 委托id
  commissionId?: number,
  // 创建人
  createBy?: number,
  // 创建人名称
  createName?: string,
  // 维修时间
  repairDate: string,
  // 维修站
  repairStation: string,
}
export interface UpdateDelegationInfo extends DelegationInfoBase {
  // 更新人id
  updateBy: number;
  // 更新人name
  updateName: string;
  // 委托id
  id: number;
}

export interface UpdateDelegationInfoByMoment extends DelegationInfoBaseByMoment {
  // 更新人id
  updateBy: number;
  // 更新人name
  updateName: string;
  // 委托id
  id: number;
}

export interface AddDelegationInfo extends DelegationInfoBase {
  createBy: number
}

export interface PartInfoBase {
  id: number;
  // 创建人id（当前登录）
  createBy?: number,
  // 创建人姓名（当前登录）
  createName?: string,
  // 创建零件时间
  createTime:string,
  // 零件名称
  name?: string,
  // 价位
  price?: number,
}
export interface RepairDetailInfo extends RepairInfoBase{
  // 创建时间
  createTime: string
  // 维修单id
  id: number
  // 维修状态 0-待维修 1-维修中 2-已维修
  state: number
}

export interface StatInfo {
  // 日期
  date: string;
  // 维修单数
  repairCount: string;
  // 总的维修价格
  totalPrice: string;
}

export interface GetReportDetailProps {
  // 故障地址
  bugAddress: string,
  // 故障日期
  bugDate: string,
  // 购买日期
  buyDate: string,
  // 汽车型号
  carModel: string,
  // 用户邮箱
  email: string,
  // 用户电话
  phone: string,
  // 审核不通过的原因
  reason: string,
  // 维修日期
  repairDate: string,
  // 维修站
  repairStation: string,
  // 状态 0-待审核 1-审核通过 2-审核不通过
  state: number,
  // 总维修费用
  totalPrice: number,
  // 用户名称
  userName: string,
}

export interface GetVisitRecordDetailProps {
  // 委托id
  commissionId: number,
  // 创建人id
  createBy: number,
  // 创建人名称
  createName: string,
  // 创建时间
  createTime: string,
  // 维修单id
  id: number,
  // 维修日期
  repairDate: string,
  // 维修站
  repairStation: string,
  // 维修状态 0-待维修 1-维修中 2-已维修
  state?: number,
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

  // 添加委托
  namespace AddDelegation {
    type Params = AddDelegationInfo;
    type ResponseData = BaseResponse;
  }

  // 更新委托
  namespace UpdateDelegation {
    type Params = UpdateDelegationInfo;

    type ResponseData = BaseResponse;
  }

  // 审核委托单
  namespace CheckDelegation {
    interface Params {
      id: number,
      state: number,
      notPassReason: string,
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

    // eslint-disable-next-line @typescript-eslint/no-shadow
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

  // 添加零件
  namespace AddPart {
    type Params = PartInfoBase;
    type ResponseData = BaseResponse;
  }

  // 删除零件
  namespace DelPart {
    interface Params {
      id: number
    }
    type ResponseData = BaseResponse;
  }

  // 查询零件详情
  namespace GetPartDetail {
    interface Params {
      id: number
    }
    export interface GetPartDetailProps extends PartInfoBase {
      // 创建时间
      createTime: string
      // 零件id
      id: number
    }
    type ResponseData = BaseResponse<GetPartDetailProps>;
  }

  // 分页查询零件列表
  namespace SearchPartList {

    import GetPartDetailProps = ApiData.GetPartDetail.GetPartDetailProps;

    interface Params {
      // 当前页，默认第一页,示例值(1)
      pageIndex?: number,
      // 每页显示条数，默认20,示例值(20)
      pageSize?: number,
      // 关键词
      keyword?: string
    }

    export interface ResponseDataDetail<T> {
      list: T[],
      pages: number,
      total: number,
    }

    type ResponseData = BaseResponse<ResponseDataDetail<GetPartDetailProps>>;
  }

  // 更新零件
  namespace UpdatePartInfo {
    interface Params {
      id: number,
      name: string,
      price: number,
      updateBy: number,
      updateName: string
    }

    type ResponseData = BaseResponse;
  }

  // 获取统计数据
  namespace GetStatInfo {
    interface Params {
      // 开始日期
      beginDate: string;
      // 结束日期
      endDate: string;
    }

    type ResponseData = BaseResponse<StatInfo[]>;
  }

  // 生成维修报告单
  namespace AddReport {
    interface Params {
      // 维修单号
      id: number
      createBy: number
      createName: string
    }

    type ResponseData = BaseResponse;
  }

  // 查询维修报告单列表
  namespace SearchReportList {
    interface Params {
      // 当前页，默认第一页,示例值(1)
      pageIndex?: number,
      // 每页显示条数，默认20,示例值(20)
      pageSize?: number,
      // 关键词
      keyword?: string,
      // 维修日期
      date?: string,
    }
    export interface ResponseDataDetail<T> {
      list: T[],
      pages: number,
      total: number,
    }
    type ResponseData = BaseResponse<ResponseDataDetail<GetReportDetailProps>>;
  }

  // 新增稽查回访
  namespace AddVisitRecord {
    interface Params {
      // 委托id
      commissionId: number,
      // 创建人id
      createBy: number,
      // 创建人名称
      createName: string,
      // 维修日期
      repairDate: string,
      // 维修站
      repairStation: string,
    }

    type ResponseData = BaseResponse;
  }

  // 查看稽查回访详情
  namespace GetVisitRecordDetail {
    interface Params {
      // 维修单id
      id: number
    }

    type ResponseData = BaseResponse<GetVisitRecordDetailProps>;
  }

  // 查看稽查回访列表
  namespace SearchVisitRecordList {
    interface Params {
      pageIndex?: number,
      pageSize?: number,
      state?: number | null
    }

    export interface ResponseDataDetail<T> {
      list: T[],
      pages: number,
      total: number,
    }
    type ResponseData = BaseResponse<ResponseDataDetail<GetVisitRecordDetailProps>>;
  }
}
