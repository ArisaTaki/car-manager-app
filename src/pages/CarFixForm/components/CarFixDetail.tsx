import React, { useEffect, useState } from 'react';
import { Spin, Card, Tag } from 'antd';
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
    let stateText: string;
    switch (state) {
      case 0: stateText = '待维修'; break;
      case 1: stateText = '维修中'; break;
      case 2: stateText = '已维修'; break;
      default: stateText = '异常'; break;
    }
    return (
      <span>{ stateText }</span>
    );
  };
  return (
    <Spin spinning={detailLoading}>
      {info ? (
        <Card style={{ width: '100%' }}>
          <p>
            <Tag style={{ width: 100 }}>创建人名称</Tag>
            <span>{ info.createName }</span>
          </p>
          <p>
            <Tag style={{ width: 100 }}>维修时间</Tag>
            <span>{ info.repairDate }</span>
          </p>
          <p>
            <Tag style={{ width: 100 }}>维修站</Tag>
            <span>{ info.repairStation }</span>
          </p>
          <p>
            <Tag style={{ width: 100 }}>状态</Tag>
            <span>
              { StateFormatter(info?.state) }
            </span>
          </p>
        </Card>
      ) : null }
    </Spin>
  );
};

export default CarFixDetail;
