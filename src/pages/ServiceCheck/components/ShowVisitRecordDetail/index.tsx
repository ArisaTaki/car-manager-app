import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import {
  Descriptions, Modal, Spin,
} from 'antd';
import moment from 'moment';
import styles from './style.module.scss';
import { GetVisitRecordDetailProps, UserTokenKeyInfo } from '@/services/entities';
import { getUser } from '@/utils/storageUtils';

const cx = classNames.bind(styles);

export interface VisitRecordDetailProps {
  visible?: boolean;
  closeEvent?: (closeOnly?: boolean) => void;
  data?: GetVisitRecordDetailProps;
}

const ShowVisitRecordDetail: React.FC<VisitRecordDetailProps> = ({
  visible, closeEvent, data,
}) => {
  const [pending, setPending] = useState(false);
  const [recordDetail, setRecordDetail] = useState<GetVisitRecordDetailProps>();
  const [userInfo, setUserInfo] = useState<UserTokenKeyInfo>();
  const switchState = (value: number) => {
    switch (value) {
      case 0:
        return '待维修';
      case 1:
        return '维修站';
      case 2:
        return '已维修';
      default:
        return '';
    }
  };

  useEffect(() => {
    const user = getUser();
    setUserInfo(user);
    setRecordDetail(data);
  }, []);
  return (
    <Modal
      maskClosable={false}
      visible={visible}
      title="详细信息"
      footer={[]}
      onCancel={() => {
        if (closeEvent) {
          closeEvent(true);
        }
      }}
    >
      <Spin spinning={pending} tip="loading...">
        <Descriptions title="详细信息" layout="vertical" bordered>
          <Descriptions.Item label="创建人名称">{recordDetail?.createName}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{moment(recordDetail?.createTime).format('YYYY年MM月DD日')}</Descriptions.Item>
          <Descriptions.Item label="描述">{recordDetail?.description}</Descriptions.Item>
          <Descriptions.Item label="顾客">{recordDetail?.customerName}</Descriptions.Item>
        </Descriptions>
      </Spin>
    </Modal>
  );
};

export default ShowVisitRecordDetail;
