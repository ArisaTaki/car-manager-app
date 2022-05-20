import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import {
  Descriptions, Modal, Spin,
} from 'antd';
import styles from './style.module.scss';
import { GetReportDetailProps, UserTokenKeyInfo } from '@/services/entities';
import { getUser } from '@/utils/storageUtils';

const cx = classNames.bind(styles);

export interface ReportDetailProps {
  visible?: boolean;
  closeEvent?: (closeOnly?: boolean) => void;
  data?: GetReportDetailProps;
  isAdd?: boolean;
}

const ShowReportDetail: React.FC<ReportDetailProps> = ({
  visible, closeEvent, data,
}) => {
  const [pending, setPending] = useState(false);
  const [recordDetail, setRecordDetail] = useState<GetReportDetailProps>();
  const [userInfo, setUserInfo] = useState<UserTokenKeyInfo>();

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
          <Descriptions.Item label="维修站">{recordDetail?.repairStation}</Descriptions.Item>
          <Descriptions.Item label="维修日期">{recordDetail?.repairDate}</Descriptions.Item>
          <Descriptions.Item label="汽车型号">{recordDetail?.carModel}</Descriptions.Item>
          <Descriptions.Item label="车主电话">{recordDetail?.phone}</Descriptions.Item>
          { /*  TODO 字段已经出来了，有用信息都展示一下吧 */}
        </Descriptions>
      </Spin>
    </Modal>
  );
};

export default ShowReportDetail;
