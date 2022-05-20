import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import {
  Descriptions, Modal, Spin,
} from 'antd';
import moment from 'moment';
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

  const switchState = (number: number) => {
    switch (number) {
      case 0:
        return '待审核';
      case 1:
        return '审核通过';
      case 2:
        return '审核不通过';
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
          <Descriptions.Item label="故障地址">{recordDetail?.bugAddress}</Descriptions.Item>
          <Descriptions.Item label="故障日期">{moment(recordDetail?.bugDate).format('YYYY年MM月DD日')}</Descriptions.Item>
          <Descriptions.Item label="购买日期">{moment(recordDetail?.buyDate).format('YYYY年MM月DD日')}</Descriptions.Item>
          <Descriptions.Item label="汽车型号">{recordDetail?.carModel}</Descriptions.Item>
          <Descriptions.Item label="维修站">{recordDetail?.repairStation}</Descriptions.Item>
          <Descriptions.Item label="维修日期">{moment(recordDetail?.repairDate).format('YYYY年MM月DD日')}</Descriptions.Item>
          <Descriptions.Item label="用户电话">{recordDetail?.phone}</Descriptions.Item>
          <Descriptions.Item label="车主邮箱">{recordDetail?.email}</Descriptions.Item>
          <Descriptions.Item label="状态">{switchState(recordDetail?.state ?? -1)}</Descriptions.Item>
          {recordDetail?.state === 2
            ? <Descriptions.Item label="未通过原因">{recordDetail?.reason}</Descriptions.Item>
            : <></>}
        </Descriptions>
      </Spin>
    </Modal>
  );
};

export default ShowReportDetail;
