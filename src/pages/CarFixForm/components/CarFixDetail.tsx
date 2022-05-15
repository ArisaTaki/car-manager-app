import React, { useEffect, useState } from 'react';
import {
  Spin, Card, Tag, Descriptions,
} from 'antd';
import { RepairDetailInfo } from '@/services/entities';
import { ServicesApi } from '@/services/services-api';

const { GetRepairDetail } = ServicesApi;
interface RepairInfoProps {
  repairDetailInfo: RepairDetailInfo
}

const CarFixDetail: React.FC<RepairInfoProps> = ({ repairDetailInfo }) => {
  const [info, setInfo] = useState<RepairDetailInfo>();
  const [detailLoading, setDetailLoading] = useState<boolean>(true);
  useEffect(() => {
    setDetailLoading(true);
    GetRepairDetail({ id: repairDetailInfo.id })
      .then(({ data }): void => {
        setDetailLoading(false);
        setInfo(data);
      });
  }, []);

  const StateFormatter = (state: number) => {
    switch (state) {
      case 0:
        return <>待维修</>;
      case 1:
        return <>维修中</>;
      case 2:
        return <>已维修</>;
      default:
        return <></>;
    }
  };
  return (
    <Spin spinning={detailLoading}>
      {info ? (
        <Descriptions title="详细信息" layout="vertical" bordered>
          <Descriptions.Item label="创建人名称">{info.createName}</Descriptions.Item>
          <Descriptions.Item label="维修时间">{info.createTime}</Descriptions.Item>
          <Descriptions.Item label="维修站">{info.repairStation}</Descriptions.Item>
          <Descriptions.Item label="状态">{StateFormatter(info.state)}</Descriptions.Item>
        </Descriptions>
      ) : null}
    </Spin>
  );
};

export default CarFixDetail;
