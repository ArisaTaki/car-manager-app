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
import { GetReportDetailProps } from '@/services/entities';
import { getUser } from '@/utils/storageUtils';
import { moveToSystemError403Page } from '@/helpers/history';
import ShowReportDetail from './components/ShowReportDetail';

const cx = classNames.bind(styles);

const {
  SearchReportList,
} = ServicesApi;
interface PaginationProps {
  pageSize: number,
  current: number,
  total?: number,
}

const ServiceReport: React.FC = () => {
  const [pageLoading, setLoading] = useState(false);
  const [reportList, setRepoetList] = useState<GetReportDetailProps[]>([]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [keyword, setKeyWord] = useState('');
  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [chooseIndex, setChooseIndexData] = useState<GetReportDetailProps>();
  const [getDataLoading, setGetDataLoading] = useState(false);

  const getReportMethod = () => {
    setLoading(true);
    SearchReportList({ pageIndex: 1, pageSize: 10 }).then((res) => {
      setLoading(false);
      setRepoetList(res.data.list);
      setPaginationData({
        pageSize: 10,
        current: 1,
        total: res.data.total,
      });
    });
  };

  useEffect(() => {
    getReportMethod();
    if (getUser().type !== 0 && getUser().type !== 4) {
      moveToSystemError403Page();
    }
  }, []);
  const onSearch = (value: string) => {
    if (value) {
      setKeyWord(value);
      setLoading(true);
      SearchReportList(
        {
          date: '',
          keyword: '',
          pageIndex: paginationData?.current,
          pageSize: paginationData?.pageSize,
        },
      ).then((res) => {
        setRepoetList(res.data.list);
        setLoading(false);
        setPaginationData({
          pageSize: 10,
          current: 1,
          total: res.data.total,
        });
      });
    }
  };
  const paginationChangeEvent = (page: number, pageSize: number, date?: string) => {
    setLoading(true);
    setRepoetList([]);
    SearchReportList({
      pageSize, pageIndex: page, date, keyword,
    })
      .then((res) => {
        setLoading(false);
        setPaginationData({ ...paginationData, current: page, pageSize });
        setRepoetList(res.data.list);
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
    getReportMethod();
  };

  const closeModal = (closeOnly?: boolean) => {
    setShowDetailModal(false);
    if (!closeOnly) {
      resetAllData();
    }
  };
  const columns: ColumnsType<GetReportDetailProps> = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'mock1',
      key: 'mockOne',
      dataIndex: 'mockOne',
    },
    {
      title: 'mock2',
      key: 'mockTwo',
      dataIndex: 'mockTwo',
    },
    {
      title: 'mock3',
      key: 'mockThree',
      dataIndex: 'mockThree',
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
              setChooseIndexData(item);
              setShowDetailModal(true);
            }}
          >
            查看报告详情
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
        <ShowReportDetail
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
            title="服务报告列表"
          />
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
            dataSource={reportList}
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

export default ServiceReport;
