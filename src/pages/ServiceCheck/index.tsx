import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import { useHistory } from 'react-router-dom';
import styles from './style.module.scss';
import { getUser } from '@/utils/storageUtils';
import { moveToSystemError403Page } from '@/helpers/history';
import routerPath from '@/router/router-path';

const cx = classNames.bind(styles);

const ServiceCheck: React.FC = () => {
  const history = useHistory();
  useEffect(() => {
    if (getUser().type !== 0 && getUser().type !== 4) {
      moveToSystemError403Page();
    }
  });
  return (
    <div>
      <p>服务稽查</p>
    </div>
  );
};
export default ServiceCheck;
