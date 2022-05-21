import React from 'react';
import classNames from 'classnames/bind';

import { Result, Button } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import styles from './styles.module.scss';
import history from '@/utils/getHistory';
import routerPath from '@/router/router-path';

const cx = classNames.bind(styles);

const Question: React.FC = () => (
  <Result
    icon={<SmileOutlined />}
    title="此系统是易车享汽车售后服务管理系统，有问题请咨询对应管理员的联系方式，祝您使用愉快"
    extra={<Button type="primary" onClick={() => history.replace(routerPath.Home)}>back home</Button>}
  />
);

export default Question;
