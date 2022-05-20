import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import {
  Button, DatePicker, Input, Modal, PageHeader, Select, Spin, Table,
} from 'antd';
import { DeleteFilled, LoadingOutlined } from '@ant-design/icons';
import Search from 'antd/es/input/Search';
import { ColumnsType } from 'antd/lib/table';
import { TableAction, TablePaginationConfig } from 'antd/lib/table/interface';
import moment from 'moment';
import { ServicesApi } from '@/services/services-api';
import styles from './style.module.scss';
import { GetReportDetailProps } from '@/services/entities';
import { getUser } from '@/utils/storageUtils';
import { moveToSystemError403Page } from '@/helpers/history';
import ShowReportDetail from './components/ShowReportDetail';
import TagStatus from './components/TagStatus';

const cx = classNames.bind(styles);

const {
  SearchReportList, UpdateReportState,
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
  const [changeStateModal, setChangeStateModal] = useState(false);
  const [keyword, setKeyWord] = useState('');
  const [paginationData, setPaginationData] = useState<PaginationProps>();
  const [chooseIndex, setChooseIndexData] = useState<GetReportDetailProps>();
  const [getDataLoading, setGetDataLoading] = useState(false);
  const [showTextarea, setShowTextArea] = useState(false);
  const [chooseDate, setChooseDate] = useState<string | undefined>();
  const [checkStatus, setCheckStatus] = useState(1);
  const [notPassReason, setNotPassReason] = useState('');

  const getReportMethod = () => {
    setLoading(true);
    SearchReportList({
      pageIndex: 1, pageSize: 10, date: '', keyword: '',
    }).then((res) => {
      setLoading(false);
      setRepoetList(res.data.list);
      setPaginationData({
        pageSize: 10,
        current: 1,
        total: res.data.total,
      });
    });
  };
  const onChangeState = () => {
    UpdateReportState({
      id: chooseIndex?.id ?? -1, state: checkStatus!, reason: notPassReason,
    }).then((res) => {
      setChangeStateModal(false);
      setCheckStatus(1);
      setNotPassReason('');
      getReportMethod();
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
          date: chooseDate,
          keyword,
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
    setChooseDate(undefined);
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
      title: '故障地址',
      dataIndex: 'bugAddress',
      key: 'bugAddress',
    },
    {
      title: '故障日期',
      key: 'bugDate',
      dataIndex: 'bugDate',
      render: (text) => (
        <span>{moment(text).format('YYYY年MM月DD日')}</span>
      ),
    },
    {
      title: '购买日期',
      key: 'buyDate',
      dataIndex: 'buyDate',
      render: (text) => (
        <span>{moment(text).format('YYYY年MM月DD日')}</span>
      ),
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
        <div className={cx('operate-buttons')}>
          <Button
            disabled={getDataLoading}
            type="primary"
            style={{ marginRight: '10px' }}
            onClick={() => {
              setChooseIndexData(item);
              setShowDetailModal(true);
            }}
          >
            查看详情
          </Button>
          <Button
            disabled={getDataLoading}
            type="primary"
            onClick={() => {
              setChooseIndexData(item);
              setChangeStateModal(true);
            }}
          >
            变更状态
          </Button>
        </div>
      ),
    },
  ];
  const stateSelectObj: { value: string, key: number }[] = [
    {
      value: '审核通过',
      key: 1,
    },
    {
      value: '审核未通过',
      key: 2,
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
      <Modal
        title="更改审核状态"
        maskClosable={false}
        onCancel={() => { setChangeStateModal(false); }}
        visible={changeStateModal}
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
            {stateSelectObj.map((item) => (
              <Select.Option key={item.key}>{item.value}</Select.Option>
            ))}
          </Select>
          {showTextarea ? (
            <>
              <div style={{ margin: '0 8px', fontWeight: 'bold', marginTop: 10 }}>不通过原因</div>
              <Input.TextArea
                onChange={(e) => { setNotPassReason(e.target.value); }}
                style={{ margin: '0 8px' }}
                value={notPassReason}
              />
            </>
          ) : null}
        </div>
      </Modal>
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
                style={{ marginRight: 10 }}
                placeholder="输入关键词"
                onSearch={onSearch}
                onChange={(e) => {
                  setKeyWord(e.target.value);
                }}
                enterButton
                value={keyword}
              />
              <DatePicker
                value={chooseDate ? moment(chooseDate) : undefined}
                style={{ width: 150 }}
                placeholder="选择日期"
                onChange={(e) => {
                  SearchReportList(
                    {
                      date: moment(e).format('YYYY-MM-DD'),
                      keyword,
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
                  setChooseDate(moment(e).format('YYYY-MM-DD'));
                }}
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
