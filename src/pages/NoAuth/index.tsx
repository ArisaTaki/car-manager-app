import React from 'react';
import classNames from 'classnames/bind';
import history from '@/utils/getHistory';
import styles from './styles.module.scss';
import routerPath from '@/router/router-path';

const cx = classNames.bind(styles);

const NoAuth: React.FC = () => (
  <div>
    403 forbidden
  </div>
);

export default NoAuth;
