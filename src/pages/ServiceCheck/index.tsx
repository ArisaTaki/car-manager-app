import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import {
  Button, PageHeader, Spin, Table,
} from 'antd';
import { DeleteFilled, LoadingOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/lib/table';
import { TableAction, TablePaginationConfig } from 'antd/lib/table/interface';
import { ServicesApi } from '@/services/services-api';
import styles from './style.module.scss';
import { GetVisitRecordDetailProps } from '@/services/entities';
import { getUser } from '@/utils/storageUtils';
import { moveToSystemError403Page } from '@/helpers/history';
import ShowVisitRecordDetail from './components/ShowVisitRecordDetail';

const cx = classNames.bind(styles);

const {
  SearchVisitRecordList, GetVisitRecordDetail,
} = ServicesApi;
interface PaginationProps {
  pageSize: number,
  current: number,
  total?: number,
}

const ServiceCheck: React.FC = () => {
  const [pageLoading, setLoading] = useState(false);
  const [visitRecordList, setVisitRecordList] = useState<GetVisitRecordDetailProps[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [chooseIndex, setChooseIndexData] = useState<GetVisitRecordDetailProps>();
  const [getDataLoading, setGetDataLoading] = useState(false);

  const getVisitRecordMethod = () => {
    setLoading(true);
    SearchVisitRecordList({ pageIndex: 1, pageSize: 10 }).then((res) => {
      setLoading(false);
      setVisitRecordList(res.data.list);
      setPaginationData({
        pageSize: 10,
        current: 1,
        total: res.data.total,
      });
    });
  };

  useEffect(() => {
    getVisitRecordMethod();
    if (getUser().type !== 0 && getUser().type !== 4) {
      moveToSystemError403Page();
    }
  }, []);
  const paginationChangeEvent = (page: number, pageSize: number) => {
    setLoading(true);
    setVisitRecordList([]);
    SearchVisitRecordList({
      pageSize, pageIndex: page,
    })
      .then((res) => {
        setLoading(false);
        setPaginationData({ ...paginationData, current: page, pageSize });
        setVisitRecordList(res.data.list);
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
    setPaginationData({ ...paginationData, current: 1, pageSize: 10 });
    getVisitRecordMethod();
  };

  const closeModal = (closeOnly?: boolean) => {
    setShowDetailModal(false);
    if (!closeOnly) {
      resetAllData();
    }
  };
  const columns: ColumnsType<GetVisitRecordDetailProps> = [
    {
      title: '顾客',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: '描述',
      key: 'description',
      dataIndex: 'description',
    },
    {
      title: '创建人名称',
      key: 'createName',
      dataIndex: 'createName',
    },
    {
      title: '创建人时间',
      key: 'createTime',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      render: (text, item) => (
        <div className={cx('operate-buttons')}>
          <Button
            disabled={getDataLoading}
            type="primary"
            onClick={() => {
              setGetDataLoading(true);
              GetVisitRecordDetail({ id: item.id }).then((res) => {
                setGetDataLoading(false);
                const { data } = res;
                setChooseIndexData(data);
                setShowDetailModal(true);
              });
            }}
          >
            查看详情
          </Button>
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
  const loadingIcon = () => <LoadingOutlined style={{ fontSize: 24 }} spin />;
  return (
    <>
      {showDetailModal ? (
        <ShowVisitRecordDetail
          visible={showDetailModal}
          closeEvent={closeModal}
          data={chooseIndex}
        />
      ) : null}
      <Spin spinning={pageLoading} indicator={loadingIcon()}>
        <div className={cx('header')}>
          <PageHeader
            onBack={() => { }}
            className={cx('page-header')}
            title="服务稽查列表"
          />
          <Table
            columns={columns}
            dataSource={visitRecordList}
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

export default ServiceCheck;
