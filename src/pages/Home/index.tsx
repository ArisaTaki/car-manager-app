import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { ECBasicOption } from 'echarts/types/dist/shared';
import styles from './styles.module.scss';
import Charts from '@/components/charts';
import { ServicesApi } from '@/services/services-api';
import { ResponseDataCharts } from '@/services/entities';

const cx = classNames.bind(styles);

const { GetChartsData } = ServicesApi;

const formatData = (data: ResponseDataCharts): ECBasicOption => {
  const {
    titleMock, seriesMock, tooltipMock, xAxisMock, yAxisMock,
  } = data;
  return {
    title: {
      text: titleMock.textMock,
    },
    tooltip: tooltipMock,
    xAxis: {
      data: xAxisMock.dataMock,
    },
    yAxis: {
      data: yAxisMock.dataMock,
    },
    series: seriesMock.map((item) => ({
      name: item.nameMock,
      data: item.dataMock,
      type: item.typeMock,
    })),
  };
};

const Home: React.FC = () => {
  const [options, setOptions] = useState<ECBasicOption>();

  useEffect(() => {
    GetChartsData().then((res) => {
      setOptions(formatData(res.data));
    });
  }, []);
  return (
    <>
      {options ? <Charts headerTitle="charts图" options={options!} />
        : null}
    </>
  );
};

export default Home;
