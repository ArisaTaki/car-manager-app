import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import {
  Button, Dropdown, Menu, message, Modal, PageHeader, Space, Spin, Table,
} from 'antd';
import { DeleteFilled, DownOutlined, LoadingOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { TableAction, TablePaginationConfig } from 'antd/lib/table/interface';
import Search from 'antd/es/input/Search';
import history from '@/utils/getHistory';
import styles from './style.module.scss';
import { ServicesApi } from '@/services/services-api';
import { UserInfoDetails, UserInfoDetailsWithId } from '@/services/entities';
import { getUser } from '@/utils/storageUtils';
import UpdateOrAddUser from '@/pages/User/components/UpdateOrAddUser';
import { formatRole } from '@/utils/Role';

const cx = classNames.bind(styles);

const {
  SearchUsers, DelUser, GetUserDetail,
} = ServicesApi;

interface PaginationProps {
  pageSize: number,
  current: number,
  total?: number,
}

const User: React.FC = () => {
  const [pageLoading, setLoading] = useState(false);
  const [userList, setUserList] = useState<UserInfoDetailsWithId[]>([]);
  const [delConfirmFlag, setDelConfirmFlag] = useState(false);
  const [chooseIndex, setChooseIndex] = useState<number>();
  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [keyword, setKeyWord] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [showAddOrEditModal, setShowAddOrEditModal] = useState(false);
  const [editData, setEditData] = useState<UserInfoDetails>();
  const [type, setType] = useState<number>();

  const onSearch = (value: string) => {
    if (value) {
      setKeyWord(value);
      setLoading(true);
      SearchUsers(
        {
          type,
          keyword: value,
          pageIndex: paginationData?.current,
          pageSize: paginationData?.pageSize,
        },
      ).then((res) => {
        setLoading(false);
        setUserList(res.data.list);
      });
    }
  };

  const getUserListMethod = () => {
    SearchUsers({
      pageSize: 10, pageIndex: 1, keyword: '', type: undefined,
    })
      .then((res) => {
        setLoading(false);
        setUserList(res.data.list);
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

  const columns: ColumnsType<UserInfoDetailsWithId> = [
    {
      title: '创建者',
      dataIndex: 'createName',
      key: 'createName',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机',
      key: 'phone',
      dataIndex: 'phone',
    },
    {
      title: '类型',
      key: 'type',
      dataIndex: 'type',
      render: (text) => (
        <div>{formatRole(text)}</div>
      ),
    },
    {
      title: '昵称',
      key: 'userTitle',
      dataIndex: 'userTitle',
      render: (text, item) => (
        <div>{`${text}${item.userId === getUser().userId ? '（自己）' : ''}`}</div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (text, item) => (
        <div className={cx('operate-buttons', { owner: getUser().userId === item.userId })}>
          <Button
            type="default"
            onClick={() => {
              GetUserDetail({ userId: item.userId }).then((res) => {
                const { data } = res;
                setEditData({ ...data, userId: item.userId });
                setIsEdit(true);
                setShowAddOrEditModal(true);
              });
              console.log('编辑页');
            }}
          >
            编辑
          </Button>
          {getUser().userId === item.userId ? null : (
            <Button
              className={cx('del-button')}
              danger
              onClick={() => {
                setChooseIndex(item.userId);
                setDelConfirmFlag(true);
              }}
            >
              删除
            </Button>
          )}
        </div>
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
    DelUser({ userId: chooseIndex! }).then((res) => {
      message.success(res.message);
      getUserListMethod();
    }).catch((err) => {
      setLoading(false);
      setDelConfirmFlag(false);
    });
  };

  const paginationChangeEvent = (page: number, pageSize: number, sort?: string) => {
    setLoading(true);
    setUserList([]);
    SearchUsers({
      pageSize, pageIndex: page, keyword, type,
    })
      .then((res) => {
        setLoading(false);
        setPaginationData({ ...paginationData, current: page, pageSize });
        setUserList(res.data.list);
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
    setType(undefined);
    setPaginationData({ ...paginationData, current: 1, pageSize: 10 });
    getUserListMethod();
  };

  const findRoleUserList = (index: number) => {
    setLoading(true);
    setType(index);
    SearchUsers({
      pageSize: 10, pageIndex: 1, keyword, type: index,
    })
      .then((res) => {
        setLoading(false);
        setUserList(res.data.list);
        setPaginationData({
          pageSize: 10,
          current: 1,
          total: res.data.total,
        });
      }).catch((err) => {
        setLoading(false);
      });
  };

  return (
    <>
      {showAddOrEditModal ? (
        <UpdateOrAddUser
          initData={editData}
          createBy={getUser().userId}
          createName={getUser().userName}
          visible={showAddOrEditModal}
          isEdit={isEdit}
          closeEvent={closeModal}
        />
      ) : null}
      <Spin spinning={pageLoading} indicator={loadingIcon()}>
        <div className={cx('header')}>
          <PageHeader
            onBack={() => { history.goBack(); }}
            className={cx('page-header')}
            title="用户管理列表"
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
                      {formatRole(0)}
                    </Menu.Item>
                    <Menu.Item
                      key={1}
                      onClick={() => { findRoleUserList(1); }}
                    >
                      {formatRole(1)}
                    </Menu.Item>
                    <Menu.Item
                      key={2}
                      onClick={() => { findRoleUserList(2); }}
                    >
                      {formatRole(2)}
                    </Menu.Item>
                  </Menu>
                  )}
                >
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      选择角色
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
                <div style={{ width: 100 }}>
                  {formatRole(type ?? -1)}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <Button
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
                disabled={keyword === '' && !type && paginationData?.current === 1 && paginationData.pageSize === 10}
              >
                重置
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={userList}
            rowKey="userId"
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

export default User;
