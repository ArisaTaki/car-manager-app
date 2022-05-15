import React from 'react';
import classNames from 'classnames/bind';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ServiceReportTableColumns } from '@/services/entities';
import styles from './style.module.scss';

const cx = classNames.bind(styles);

const ServiceReport: React.FC = () => {
  const columns: ColumnsType<ServiceReportTableColumns> = [
    {
      title: '名称1',
      dataIndex: 'name1',
      key: 'name1',
    },
    {
      title: '名称2',
      dataIndex: 'name2',
      key: 'name2',
    },
    {
      title: '名称3',
      dataIndex: 'name3',
      key: 'name3',
    },
  ];
  return (
    <div>
      <p>服务报告</p>
      <Table columns={columns} />
    </div>
  );
};

export default ServiceReport;
