import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { ECBasicOption } from 'echarts/types/dist/shared';
import styles from './styles.module.scss';
import Charts from '@/components/charts';

const cx = classNames.bind(styles);

const option: ECBasicOption = {
  title: {
    text: 'ECharts 入门示例',
  },
  tooltip: {},
  xAxis: {
    data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
  },
  yAxis: {},
  series: [
    {
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20],
    },
  ],
};

const Home: React.FC = () => {
  const [options, setOptions] = useState<ECBasicOption>(option);
  return (
    <Charts headerTitle="charts图" options={options} />
  );
};

export default Home;
