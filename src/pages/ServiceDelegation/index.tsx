import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import {
  Button, Dropdown, Input, Menu, message, Modal, PageHeader, Select, Space, Spin, Table,
} from 'antd';
import {
  DeleteFilled,
  DownOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { TableAction, TablePaginationConfig } from 'antd/lib/table/interface';
import Search from 'antd/es/input/Search';
import history from '@/utils/getHistory';
import styles from './style.module.scss';
import { ServicesApi } from '@/services/services-api';
import { DelegationListItem, UpdateDelegationInfo } from '@/services/entities';
import { getUser } from '@/utils/storageUtils';
import { formatServiceState } from '@/utils/ServiceState';
import TagStatus from '@/pages/ServiceDelegation/components/TagStatus';
import UpdateOrAddDelegation from '@/pages/ServiceDelegation/components/UpdateOrAddDelegation';

const cx = classNames.bind(styles);

const {
  SearchDelegations, DeleteDelegation, GetDelegationDetailInfo, CheckDelegation,
} = ServicesApi;

interface PaginationProps {
  pageSize: number,
  current: number,
  total?: number,
}

const statusSelectObj: { value: string, key: number }[] = [
  {
    value: '审核通过',
    key: 1,
  },
  {
    value: '审核未通过',
    key: 2,
  },
];

const ServiceDelegation: React.FC = () => {
  const [pageLoading, setLoading] = useState(false);
  const [delegationList, setDelegationList] = useState<DelegationListItem[]>([]);
  const [delConfirmFlag, setDelConfirmFlag] = useState(false);
  const [chooseIndex, setChooseIndex] = useState<number>();
  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [keyword, setKeyWord] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [showAddOrEditModal, setShowAddOrEditModal] = useState(false);
  const [editData, setEditData] = useState<UpdateDelegationInfo>();
  const [state, setState] = useState<number>();
  const [openChangeStatusModal, setOpenChangeStatusModal] = useState(false);
  const [showTextarea, setShowTextArea] = useState(false);
  const [notPassReason, setNotPassReason] = useState('');
  const [checkStatus, setCheckStatus] = useState(1);

  const onSearch = (value: string) => {
    if (value) {
      setKeyWord(value);
      setLoading(true);
      SearchDelegations(
        {
          state,
          keyword: value,
          pageIndex: paginationData?.current,
          pageSize: paginationData?.pageSize,
        },
      ).then((res) => {
        setLoading(false);
        setDelegationList(res.data.list);
      });
    }
  };

  const getUserListMethod = () => {
    SearchDelegations({
      pageSize: 10, pageIndex: 1, keyword: '', state: undefined,
    })
      .then((res) => {
        setLoading(false);
        setDelegationList(res.data.list);
        setPaginationData({
          pageSize: 10,
          current: 1,
          total: res.data.total,
        });
      }).catch((err) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getUserListMethod();
  }, []);

  const columns: ColumnsType<DelegationListItem> = [
    {
      title: '故障地址',
      dataIndex: 'bugAddress',
      key: 'bugAddress',
    },
    {
      title: '故障日期',
      dataIndex: 'bugDate',
      key: 'bugDate',
    },
    {
      title: '购买日期',
      key: 'buyDate',
      dataIndex: 'buyDate',
    },
    {
      title: '状态',
      key: 'state',
      dataIndex: 'state',
      render: (text) => (
        <TagStatus number={text} />
      ),
    },
    {
      title: '汽车型号',
      key: 'carModel',
      dataIndex: 'carModel',
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (text, item) => (
        // eslint-disable-next-line no-nested-ternary
        ((getUser().type === 0 || getUser().type === 1) && item.state === 0) ? (
          <div className={cx('operate-buttons')}>
            <Button
              type="default"
              onClick={() => {
                GetDelegationDetailInfo({ id: item.id }).then((res) => {
                  const {
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    createTime, reason, state, ...rest
                  } = res.data;
                  console.log(rest);
                  setEditData({
                    ...rest,
                    id: item.id,
                    updateBy: getUser().userId,
                    updateName: getUser().userName,
                  });
                  setIsEdit(true);
                  setShowAddOrEditModal(true);
                });
              }}
            >
              编辑
            </Button>
            <Button
              className={cx('del-button')}
              danger
              onClick={() => {
                setChooseIndex(item.id);
                setDelConfirmFlag(true);
              }}
            >
              删除
            </Button>
            {getUser().type === 0 ? (
              <Button
                type="primary"
                value="变更状态"
                style={{ marginLeft: 10 }}
                onClick={() => {
                  setChooseIndex(item.id);
                  setOpenChangeStatusModal(true);
                }}
              >
                变更状态
              </Button>
            ) : null}
          </div>
        ) : (getUser().type === 2 || getUser().type === 0) ? (
          <div>
            <Button
              type="primary"
              onClick={() => {
                setChooseIndex(item.id);
                setOpenChangeStatusModal(true);
              }}
            >
              变更状态
            </Button>
          </div>
        ) : <span>{(item.state === 0 || getUser().type !== 1) ? '您当前的账号权限不足' : '当前状态无法进行操作'}</span>
      ),
    },
  ];

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: () => `共${paginationData?.total}条`,
    pageSize: paginationData?.pageSize,
    current: paginationData?.current,
    total: paginationData?.total,
  };

  const closeModal = (closeOnly?: boolean) => {
    setShowAddOrEditModal(false);
    if (!closeOnly) {
      getUserListMethod();
    }
  };

  const loadingIcon = () => <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const delEventOk = () => {
    setDelConfirmFlag(false);
    setLoading(true);
    DeleteDelegation({ id: chooseIndex! }).then((res) => {
      console.log(res);
      message.success(res.message);
      getUserListMethod();
    }).catch((err) => {
      setLoading(false);
      setDelConfirmFlag(false);
    });
  };

  const paginationChangeEvent = (page: number, pageSize: number, sort?: string) => {
    setLoading(true);
    setDelegationList([]);
    SearchDelegations({
      pageSize, pageIndex: page, keyword, state,
    })
      .then((res) => {
        setLoading(false);
        setPaginationData({ ...paginationData, current: page, pageSize });
        setDelegationList(res.data.list);
      }).catch((err) => {
        // TODO
      });
  };

  const switchActionChange = (action: TableAction,
    pagination:TablePaginationConfig) => {
    if (action === 'paginate') {
      paginationChangeEvent(pagination.current ?? 1,
        pagination.pageSize ?? 10);
    }
  };

  const resetAllData = () => {
    setLoading(true);
    setKeyWord('');
    setState(undefined);
    setPaginationData({ ...paginationData, current: 1, pageSize: 10 });
    getUserListMethod();
  };

  const findRoleUserList = (index: number) => {
    setLoading(true);
    setState(index);
    SearchDelegations({
      pageSize: 10, pageIndex: 1, keyword, state: index,
    })
      .then((res) => {
        setLoading(false);
        setDelegationList(res.data.list);
        setPaginationData({
          pageSize: 10,
          current: 1,
          total: res.data.total,
        });
      }).catch((err) => {
        setLoading(false);
      });
  };

  const onChangeState = () => {
    CheckDelegation({ id: chooseIndex!, state: checkStatus!, notPassReason }).then((res) => {
      setOpenChangeStatusModal(false);
      setCheckStatus(1);
      setNotPassReason('');
    });
  };

  return (
    <>
      {showAddOrEditModal ? (
        <UpdateOrAddDelegation
          initData={editData}
          createBy={getUser().userId}
          createName={getUser().userName}
          visible={showAddOrEditModal}
          isEdit={isEdit}
          closeEvent={closeModal}
        />
      ) : null}
      <Modal
        title="更改审核状态"
        maskClosable={false}
        onCancel={() => { setOpenChangeStatusModal(false); }}
        visible={openChangeStatusModal}
        onOk={onChangeState}
      >
        <div>
          <Select
            defaultValue={String(checkStatus)}
            style={{ width: 120, margin: '0 8px' }}
            onChange={(e) => {
              setCheckStatus(Number(e));
              setShowTextArea(e === '2');
            }}
          >
            {statusSelectObj.map((item) => (
              <Select.Option key={item.key}>{item.value}</Select.Option>
            ))}
          </Select>
          {showTextarea ? (
            <>
              <div style={{ margin: '0 8px', fontWeight: 'bold', marginTop: 10 }}>不通过原因</div>
              <Input.TextArea style={{ margin: '0 8px' }} value={notPassReason} />
            </>
          ) : null}
        </div>
      </Modal>
      <Spin spinning={pageLoading} indicator={loadingIcon()}>
        <div className={cx('header')}>
          <PageHeader
            onBack={() => { history.goBack(); }}
            className={cx('page-header')}
            title="服务委托列表"
          />
          <Modal
            title="确认删除"
            visible={delConfirmFlag}
            onCancel={() => setDelConfirmFlag(false)}
            onOk={delEventOk}
          >
            确定删除?
          </Modal>
          <div className={cx('buttons')}>
            <div className={cx('btns')}>
              <Search
                placeholder="输入关键词"
                onSearch={onSearch}
                onChange={(e) => {
                  setKeyWord(e.target.value);
                }}
                enterButton
                value={keyword}
              />
              <div style={{ display: 'flex' }}>
                <Dropdown overlay={(
                  <Menu>
                    <Menu.Item
                      key={0}
                      onClick={() => { findRoleUserList(0); }}
                    >
                      {formatServiceState(0)}
                    </Menu.Item>
                    <Menu.Item
                      key={1}
                      onClick={() => { findRoleUserList(1); }}
                    >
                      {formatServiceState(1)}
                    </Menu.Item>
                    <Menu.Item
                      key={2}
                      onClick={() => { findRoleUserList(2); }}
                    >
                      {formatServiceState(2)}
                    </Menu.Item>
                  </Menu>
                                )}
                >
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      选择状态
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
                <div style={{ width: 100 }}>
                  {formatServiceState(state ?? -1)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <Button
                disabled={!(getUser().type === 0 || getUser().type === 1)}
                style={{ marginRight: 10 }}
                type="primary"
                onClick={() => {
                  console.log('新增用户');
                  setShowAddOrEditModal(true);
                  setIsEdit(false);
                }}
              >
                新增
              </Button>
              <Button
                type="default"
                icon={<DeleteFilled />}
                onClick={resetAllData}
                disabled={keyword === '' && !state && paginationData?.current === 1 && paginationData.pageSize === 10}
              >
                重置
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={delegationList}
            rowKey="id"
            onChange={(pagination, filters, sorter, extra) => {
              switchActionChange(extra.action, pagination);
            }}
            pagination={{
              ...paginationProps,
            }}
          />
        </div>
      </Spin>
    </>
  );
};

export default ServiceDelegation;
