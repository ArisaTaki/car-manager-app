import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import { PageHeader } from 'antd';
import styles from './style.module.scss';
import history from '@/utils/getHistory';
import { getUser } from '@/utils/storageUtils';
import { moveToSystemError403Page } from '@/helpers/history';

const cx = classNames.bind(styles);

const CarFixForm: React.FC = () => {
  useEffect(() => {
    if (!(getUser().type !== 1 && getUser().type !== 4)) {
      moveToSystemError403Page();
    }
  });
  return (
    <div>
      <PageHeader
        onBack={() => {
          history.goBack();
        }}
        className={cx('page-header')}
        title="维修信息表登记"
      />
    </div>
  );
};

export default CarFixForm;
