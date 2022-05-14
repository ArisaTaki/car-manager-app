import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { ECBasicOption } from 'echarts/types/dist/shared';
import styles from './styles.module.scss';
import Charts from '@/components/charts';
import { ServicesApi } from '@/services/services-api';
import { ResponseDataCharts } from '@/services/entities';

const cx = classNames.bind(styles);

const { GetChartsData, GetChartsMoneyData } = ServicesApi;

const formatData = (data: ResponseDataCharts): ECBasicOption => ({
  title: {
    show: true,
    text: '维修工单数',
  },
  xAxis: {
    type: 'category',
    data: data.date,
    axisTick: {
      alignWithLabel: true,
    },
    axisLabel: {
      show: true,
    },
  },
  yAxis: {
    type: 'value',
    name: '维修工单/单',
    axisLine: {
      show: true,
    },
    axisLabel: {
      show: true,
    },
  },
  tooltip: {
    trigger: 'axis',
  },
  series: [
    {
      data: data.result,
      type: 'line',
      smooth: true,
    },
  ],
});

const Home: React.FC = () => {
  const [chartData, setChartData] = useState<ECBasicOption>();
  const [chartMoneyData, setChartMoneyData] = useState<ECBasicOption>();

  useEffect(() => {
    GetChartsData().then((res) => {
      setChartData(formatData(res.data));
    });
    GetChartsMoneyData().then(({ data }) => {
      setChartMoneyData(formatData(data));
    });
  }, []);
  return (
    <div className={cx('home-charts-list')}>
      {chartData ? <Charts headerTitle="charts图" chartID="chartData" options={chartData!} styles={{ width: '48%', height: '70vh' }} />
        : null}
      {chartMoneyData ? <Charts headerTitle="charts图" chartID="chartMoneyData" options={chartMoneyData!} styles={{ width: '48%', height: '70vh' }} />
        : null}
    </div>
  );
};

export default Home;
