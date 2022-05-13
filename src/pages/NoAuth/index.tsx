import React from 'react';
import classNames from 'classnames/bind';
import { Result, Button } from 'antd';
import styles from './styles.module.scss';
import getHistory from '@/utils/getHistory';
import routerPath from '@/router/router-path';

const cx = classNames.bind(styles);

const NoAuth: React.FC = () => {
  const history = getHistory;
  return (
    <Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={<Button type="primary" onClick={() => { history.replace(routerPath.Home); }}>Back Home</Button>}
    />
  );
};

export default NoAuth;
