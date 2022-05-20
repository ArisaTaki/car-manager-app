import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import {
  PageHeader, Table, Button, Modal, Spin, Space, Dropdown, Menu, message,
} from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { DownOutlined } from '@ant-design/icons';
import styles from './style.module.scss';
import history from '@/utils/getHistory';
import { getUser } from '@/utils/storageUtils';
import { moveToSystemError403Page } from '@/helpers/history';
import { RepairDetailInfo } from '@/services/entities';
import { ServicesApi } from '@/services/services-api';
import CarFixDetail from './components/CarFixDetail';

const cx = classNames.bind(styles);
const { UpdateRepairState, AddVisitRecord, AddReport } = ServicesApi;
interface PaginationProps {
  pageSize?: number,
  current?: number,
  total?: number,
}

const CarFixForm: React.FC = () => {
  const [paginationData, setPaginationData] = useState<PaginationProps>({
    pageSize: 10,
    current: 1,
    total: 0,
  });
  const [repairList, setRepairList] = useState<RepairDetailInfo[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [repairDetailInfo, setRepairDetailInfo] = useState<RepairDetailInfo>();
  const [delConfirmFlag, setDelConfirmFlag] = useState<boolean>(false);
  const [listItemId, setListItemId] = useState<number>();
  const [listItemState, setListItemState] = useState<string>();
  const [recordCreating, setRecordCreating] = useState(false);

  const addReportInfo = (item: RepairDetailInfo) => {
    AddReport(
      { createBy: getUser().userId, createName: getUser().userName, id: item.id },
    ).then((res) => {
      message.success(res.message);
    });
  };

  const addRecord = (item: RepairDetailInfo) => {
    setRecordCreating(true);
    AddVisitRecord({
      commissionId: item.commissionId!,
      createBy: getUser().userId,
      createName: getUser().userName,
      repairDate: item.repairDate,
      repairStation: item.repairStation,
    }).then((res) => {
      setRecordCreating(false);
      message.success(res.message);
    }).catch((err) => {
      setRecordCreating(false);
    });
  };

  const columns: ColumnsType<RepairDetailInfo> = [
    {
      title: '创建人名称',
      key: 'createName',
      dataIndex: 'createName',
    },
    {
      title: '维修时间',
      key: 'repairDate',
      dataIndex: 'repairDate',
    },
    {
      title: '维修站',
      key: 'repairStation',
      dataIndex: 'repairStation',
    },
    {
      title: '状态',
      key: 'state',
      dataIndex: 'state',
      render: (text) => {
        let stateText: string;
        switch (text) {
          case 0: stateText = '待维修'; break;
          case 1: stateText = '维修中'; break;
          case 2: stateText = '已维修'; break;
          default: return '';
        }
        return (
          <span>{stateText!}</span>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (text, item) => (
        <>
          <Space>
            {getUser().type === 3 || getUser().type === 0 ? (
              <>
                <Dropdown overlay={switchRepairStation(item.state)} trigger={['click']}>
                  <Button
                    type="primary"
                    onClick={() => {
                      setListItemId(item.id);
                    }}
                  >
                    <Space>
                      维修状态变更
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
                {item.state === 2 ? (
                  <Button type="primary" onClick={() => addReportInfo(item)}>
                    生成服务报告
                  </Button>
                ) : null}
              </>
            ) : null}
            {getUser().type === 4 || getUser().type === 0
              ? <Button type="primary" disabled={recordCreating} onClick={() => addRecord(item)}>生成稽查回访单</Button> : null}
            <Button onClick={() => { getRepairDetail(item); }}>详情</Button>
          </Space>
        </>
      ),
    },
  ];
  const switchRepairStation = (value: number) => {
    switch (value) {
      case 0: return toRepair;
      case 1: return alreadyRepair;
      case 2: return repairing;
      default: return <></>;
    }
  };
  const toRepair = (
    <Menu>
      <Menu.Item key={1} onClick={(item) => showChangeStateConfirm(item.key)}>维修中</Menu.Item>
      <Menu.Item key={2} onClick={(item) => showChangeStateConfirm(item.key)}>已维修</Menu.Item>
    </Menu>
  );
  const alreadyRepair = (
    <Menu>
      <Menu.Item key={2} onClick={(item) => showChangeStateConfirm(item.key)}>已维修</Menu.Item>
    </Menu>
  );
  const repairing = (
    <Menu>
      <Menu.Item key={1} onClick={(item) => showChangeStateConfirm(item.key)}>维修中</Menu.Item>
    </Menu>
  );
  // 详情
  const getRepairDetail = (item: RepairDetailInfo): void => {
    setDetailModalVisible(true);
    setRepairDetailInfo({ ...item });
  };
  // 弹窗确定
  const detailOk = (): void => { setDetailModalVisible(false); };

  const eventOk = (): void => {
    setDelConfirmFlag(false);
    doChangeState();
  };

  // 表单分页设置
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: () => `共${paginationData?.total}条`,
    pageSize: paginationData?.pageSize,
    current: paginationData?.current,
    total: paginationData?.total,
  };

  // 获取/更新表单
  const getTableList = (pagination: PaginationProps, state?: number): void => {
    setTableLoading(true);
    ServicesApi.SearchRepairList({
      pageIndex: pagination.current,
      pageSize: pagination.pageSize,
      state,
    })
      .then((res) => {
        setRepairList(res.data.list);
        setPaginationData({
          ...pagination,
          total: res.data.total,
        });
        setTableLoading(false);
      });
  };

  const showChangeStateConfirm = (key: string) => {
    setListItemState(key);
    setDelConfirmFlag(true);
  };

  const doChangeState = () => {
    if (listItemState === '1') {
      UpdateRepairState({
        id: listItemId!,
        state: 1,
      }).then((res) => {
        getTableList(paginationData);
        message.success(res.message);
      });
    } else {
      UpdateRepairState({
        id: listItemId!,
        state: 2,
      }).then((res) => {
        getTableList(paginationData);
        message.success(res.message);
      });
    }
  };

  // 跟新分页配置
  const changePage = (pagination: TablePaginationConfig): void => {
    if (pagination.pageSize === paginationData.pageSize) {
      getTableList({ ...pagination, current: pagination.current });
    } else {
      getTableList({ ...pagination, current: 1, pageSize: pagination.pageSize });
    }
  };
  // 权限管理
  useEffect(() => {
    if (!(getUser().type !== 1 && getUser().type !== 4)) {
      moveToSystemError403Page();
    }
  });
  // 列表初始化
  useEffect(() => {
    getTableList(paginationData);
  }, []);
  return (
    <div>
      <PageHeader
        onBack={() => {
          history.goBack();
        }}
        className={cx('page-header')}
        title="维修信息表登记"
      />
      <Spin spinning={tableLoading}>
        <Table
          columns={columns}
          dataSource={repairList}
          rowKey="id"
          pagination={{
            ...paginationProps,
          }}
          onChange={(pagination) => {
            changePage(pagination);
          }}
        />
      </Spin>
      <Modal
        title="Basic Modal"
        visible={detailModalVisible}
        onOk={detailOk}
        closable={false}
        destroyOnClose
        footer={[
          <Button key="ok" type="primary" onClick={() => { detailOk(); }}>确定</Button>,
        ]}
      >
        {repairDetailInfo ? (<CarFixDetail repairDetailInfo={repairDetailInfo} />) : null}
      </Modal>
      <Modal
        title="确认删除"
        visible={delConfirmFlag}
        onCancel={() => setDelConfirmFlag(false)}
        onOk={eventOk}
      >
        确定修改?
      </Modal>
    </div>
  );
};

export default CarFixForm;
