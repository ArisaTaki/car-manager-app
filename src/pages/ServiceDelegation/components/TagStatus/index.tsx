import React from 'react';
import classNames from 'classnames/bind';
import { Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import styles from './styles.module.scss';

const cx = classNames.bind(styles);

export interface TagStatusProps {
  number: number
}

export const formatServiceState = (number: number):
{ title: string, icon: React.ReactNode, style: string } => {
  switch (number) {
    case 0:
      return {
        title: '待流转',
        icon: <SyncOutlined spin />,
        style: 'processing',
      };
    case 1:
      return {
        title: '审核通过',
        icon: <CheckCircleOutlined />,
        style: 'success',
      };
    case 2:
      return {
        title: '审核未通过',
        icon: <CloseCircleOutlined />,
        style: 'error',
      };
    default:
      return {
        title: '',
        icon: CloseCircleOutlined,
        style: 'error',
      };
  }
};

const TagStatus: React.FC<TagStatusProps> = ({ number }) => {
  const { style, title, icon } = formatServiceState(number);

  return (
    <div>
      <Tag icon={icon} color={style}>
        {title}
      </Tag>
    </div>
  );
};

export default TagStatus;
