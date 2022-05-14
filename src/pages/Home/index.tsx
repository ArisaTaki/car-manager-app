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
    xAxis: {
      type: 'category',
      data: ['05-07', '05-08', '05-09', '05-10', '05-11', '05-12', '05-13', '05-14'],
    },
    yAxis: {
      type: 'value',
    },
    tooltip: {
      trigger: 'axis',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320, 1502],
        type: 'line',
        smooth: true,
      },
    ],
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
      {options ? <Charts headerTitle="charts图" options={options!} styles={{ width: '100%', height: '70vh' }} />
        : null}
    </>
  );
};

export default Home;
