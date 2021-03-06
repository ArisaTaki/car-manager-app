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
  const [getDataLoading, setGetDataLoading] = useState(false);
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
    setLoading(true);
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
    setLoading(true);
    getUserListMethod();
  }, []);

  const columns: ColumnsType<UserInfoDetailsWithId> = [
    {
      title: '?????????',
      dataIndex: 'createName',
      key: 'createName',
    },
    {
      title: '??????',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '??????',
      key: 'phone',
      dataIndex: 'phone',
    },
    {
      title: '??????',
      key: 'type',
      dataIndex: 'type',
      render: (text) => (
        <div>{formatRole(text)}</div>
      ),
    },
    {
      title: '??????',
      key: 'userTitle',
      dataIndex: 'userTitle',
      render: (text, item) => (
        <div>{`${text}${item.userId === getUser().userId ? '????????????' : ''}`}</div>
      ),
    },
    {
      title: '??????',
      key: 'action',
      dataIndex: 'action',
      render: (text, item) => (
        <div className={cx('operate-buttons', { owner: getUser().userId === item.userId })}>
          <Button
            disabled={getDataLoading}
            type="default"
            onClick={() => {
              setGetDataLoading(true);
              GetUserDetail({ userId: item.userId }).then((res) => {
                setGetDataLoading(false);
                const { data } = res;
                setEditData({ ...data, userId: item.userId });
                setIsEdit(true);
                setShowAddOrEditModal(true);
              });
            }}
          >
            ??????
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
              ??????
            </Button>
          )}
        </div>
      ),
    },
  ];

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: () => `???${paginationData?.total}???`,
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
            title="??????????????????"
          />
          <Modal
            title="????????????"
            visible={delConfirmFlag}
            onCancel={() => setDelConfirmFlag(false)}
            onOk={delEventOk}
          >
            ?????????????
          </Modal>
          <div className={cx('buttons')}>
            <div className={cx('btns')}>
              <Search
                placeholder="???????????????"
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
                    <Menu.Item
                      key={3}
                      onClick={() => { findRoleUserList(3); }}
                    >
                      {formatRole(3)}
                    </Menu.Item>
                    <Menu.Item
                      key={4}
                      onClick={() => { findRoleUserList(4); }}
                    >
                      {formatRole(4)}
                    </Menu.Item>
                  </Menu>
                  )}
                >
                  {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                  <a onClick={(e) => e.preventDefault()}>
                    <Space>
                      ????????????
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
                  console.log('????????????');
                  setShowAddOrEditModal(true);
                  setIsEdit(false);
                }}
              >
                ??????
              </Button>
              <Button
                type="default"
                icon={<DeleteFilled />}
                onClick={resetAllData}
                disabled={!type
                && type !== 0 && paginationData?.current === 1 && paginationData.pageSize === 10}
              >
                ??????
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
