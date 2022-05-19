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
          <Descriptions.Item label="示例id">{recordDetail?.id}</Descriptions.Item>
          <Descriptions.Item label="mock1">{recordDetail?.mockOne}</Descriptions.Item>
          <Descriptions.Item label="mock2">{recordDetail?.mockTwo}</Descriptions.Item>
          <Descriptions.Item label="mock3">{recordDetail?.mockThree}</Descriptions.Item>
        </Descriptions>
      </Spin>
    </Modal>
  );
};

export default ShowReportDetail;
