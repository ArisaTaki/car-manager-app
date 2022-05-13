import React from 'react';
import classNames from 'classnames/bind';
import { PageHeader } from 'antd';
import styles from './style.module.scss';
import history from '@/utils/getHistory';

const cx = classNames.bind(styles);

const CarFixForm: React.FC = () => (
  <div>
    <PageHeader
      onBack={() => { history.goBack(); }}
      className={cx('page-header')}
      title="维修信息表登记"
    />
  </div>
);

export default CarFixForm;
