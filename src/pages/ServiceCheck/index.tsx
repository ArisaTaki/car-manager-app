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
  const [keyword, setKeyWord] = useState('');
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
  const reverseState = (text: string) => {
    switch (text) {
      case '待维修':
        return 0;
      case '维修站':
        return 1;
      case '已维修':
        return 2;
      default:
        return null;
    }
  };
  const onSearch = (value: string) => {
    if (value) {
      setKeyWord(value);
      setLoading(true);
      SearchVisitRecordList(
        {
          state: reverseState(value),
          pageIndex: paginationData?.current,
          pageSize: paginationData?.pageSize,
        },
      ).then((res) => {
        setVisitRecordList(res.data.list);
        setLoading(false);
        setPaginationData({
          pageSize: 10,
          current: 1,
          total: res.data.total,
        });
      });
    }
  };
  const paginationChangeEvent = (page: number, pageSize: number, state?: number) => {
    setLoading(true);
    setVisitRecordList([]);
    SearchVisitRecordList({
      pageSize, pageIndex: page, state,
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
    setKeyWord('');
    setPaginationData({ ...paginationData, current: 1, pageSize: 10 });
    getVisitRecordMethod();
  };

  const closeModal = (closeOnly?: boolean) => {
    setShowDetailModal(false);
    if (!closeOnly) {
      resetAllData();
    }
  };
  const switchState = (value: number) => {
    switch (value) {
      case 0:
        return '待维修';
      case 1:
        return '维修站';
      case 2:
        return '已维修';
      default:
        return '';
    }
  };
  const columns: ColumnsType<GetVisitRecordDetailProps> = [
    {
      title: '创建者',
      dataIndex: 'createName',
      key: 'createName',
    },
    {
      title: '维修站',
      key: 'repairStation',
      dataIndex: 'repairStation',
    },
    {
      title: '维修状态',
      key: 'state',
      dataIndex: 'state',
      render: (text) => (
        <>{switchState(text)}</>
      ),
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
          <div className={cx('buttons')}>
            <div className={cx('btns')}>
              <Search
                placeholder="输入维修状态"
                onSearch={onSearch}
                onChange={(e) => {
                  setKeyWord(e.target.value);
                }}
                enterButton
                value={keyword}
              />
            </div>
            <div style={{ display: 'flex' }}>
              <Button
                type="default"
                icon={<DeleteFilled />}
                onClick={resetAllData}
                disabled={keyword === '' && paginationData?.current === 1 && paginationData.pageSize === 10}
              >
                重置
              </Button>
            </div>
          </div>
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
