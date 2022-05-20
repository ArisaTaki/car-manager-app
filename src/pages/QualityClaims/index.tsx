import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { DeleteFilled, LoadingOutlined } from '@ant-design/icons';
import {
  Button, PageHeader, Spin, Table,
} from 'antd';
import { ColumnsType, TablePaginationConfig } from 'antd/lib/table';
import { TableAction } from 'antd/lib/table/interface';
import { SuoPeiProps } from '@/services/entities';
import { ServicesApi } from '@/services/services-api';
import { moveToSystemError403Page } from '@/helpers/history';
import styles from './style.module.scss';
import { getUser } from '@/utils/storageUtils';

const cx = classNames.bind(styles);
const {
  SearchSuoPeiList,
} = ServicesApi;
interface PaginationProps {
  pageSize: number,
  current: number,
  total?: number,
}

const QualityClaims: React.FC = () => {
  const [pageLoading, setLoading] = useState(false);
  const [suoPeiList, setSuoPeiList] = useState<SuoPeiProps[]>([]);
  const [paginationData, setPaginationData] = useState<PaginationProps>();

  const getSuoPeiMethod = () => {
    setLoading(true);
    SearchSuoPeiList().then((res) => {
      setLoading(false);
      setSuoPeiList(res.data.list);
      setPaginationData({
        pageSize: 10,
        current: 1,
        total: res.data.total,
      });
    });
  };
  const paginationChangeEvent = (page: number, pageSize: number, state?: number) => {
    setLoading(true);
    setSuoPeiList([]);
    SearchSuoPeiList().then((res) => {
      setLoading(false);
      setPaginationData({ ...paginationData, current: page, pageSize });
      setSuoPeiList(res.data.list);
    }).catch((err) => {
      // TODO
    });
  };

  const switchActionChange = (action: TableAction,
    pagination: TablePaginationConfig) => {
    if (action === 'paginate') {
      paginationChangeEvent(pagination.current ?? 1,
        pagination.pageSize ?? 10);
    }
  };
  const resetAllData = () => {
    setLoading(true);
    setPaginationData({ ...paginationData, current: 1, pageSize: 10 });
    getSuoPeiMethod();
  };
  const columns: ColumnsType<SuoPeiProps> = [
    {
      title: '零件名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '索赔金额',
      key: 'money',
      dataIndex: 'money',
    },
    {
      title: '索赔比例',
      key: 'percentage',
      dataIndex: 'percentage',
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
  useEffect(() => {
    getSuoPeiMethod();
    if (getUser().type !== 0 && getUser().type !== 4) {
      moveToSystemError403Page();
    }
  }, []);
  return (
    <>
      <Spin spinning={pageLoading} indicator={loadingIcon()}>
        <div className={cx('header')}>
          <PageHeader
            onBack={() => { }}
            className={cx('page-header')}
            title="质量索赔列表"
          />
          <div className={cx('buttons')}>
            <div style={{ display: 'flex' }}>
              <Button
                type="default"
                icon={<DeleteFilled />}
                onClick={resetAllData}
                disabled={paginationData?.current === 1 && paginationData.pageSize === 10}
              >
                重置
              </Button>
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={suoPeiList}
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

export default QualityClaims;
