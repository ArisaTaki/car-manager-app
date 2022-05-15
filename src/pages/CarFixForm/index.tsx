import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import {
  PageHeader, Table, Button, Modal, Form, Spin,
} from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import styles from './style.module.scss';
import history from '@/utils/getHistory';
import { getUser } from '@/utils/storageUtils';
import { moveToSystemError403Page } from '@/helpers/history';
import { RepairDetailInfo } from '@/services/entities';
import { ServicesApi } from '@/services/services-api';
import CarFixDetail from './components/CarFixDetail';

const cx = classNames.bind(styles);

interface PaginationProps {
  pageSize: number,
  current: number,
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
  const [buttonLoading, setButtonLoading] = useState<boolean>(true);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [repairDetailInfo, setRepairDetailInfo] = useState<RepairDetailInfo>();

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
          default: stateText = '异常'; break;
        }
        return (
          <span>{ stateText }</span>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (text, item) => (
        <>
          {/* eslint-disable-next-line max-len */}
          { item.state !== 1 ? (<Spin spinning={buttonLoading}><Button style={{ width: 100 }}>去维修</Button></Spin>) : null }
          {/* eslint-disable-next-line max-len */}
          { item.state === 1 ? (<Spin spinning={buttonLoading}><Button style={{ width: 100 }}>维修完成</Button></Spin>) : null }
          <Button type="primary" onClick={() => { getRepairDetail(item); }}>详情</Button>
        </>
      ),
    },
  ];
  // 详情
  const getRepairDetail = (item: RepairDetailInfo): void => {
    setDetailModalVisible(true);
    setRepairDetailInfo({ ...item });
  };
  // 弹窗确定
  const detailOk = (): void => { setDetailModalVisible(false); };
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

  // 跟新分页配置
  const changePage = (pagination: TablePaginationConfig): void => {
    if (pagination.pageSize === paginationData.pageSize) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getTableList({ ...pagination, current: pagination.current });
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
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
    // debugger; //eslint-disable-line
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
          rowKey="commissionId"
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
        { repairDetailInfo ? (<CarFixDetail repairDetailInfo={repairDetailInfo} />) : null }
      </Modal>
    </div>
  );
};

export default CarFixForm;
