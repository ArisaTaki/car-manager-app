import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { ECBasicOption } from 'echarts/types/dist/shared';
import moment, { Moment } from 'moment';
import { DatePicker } from 'antd';
import styles from './styles.module.scss';
import Charts from '@/components/charts';
import { ServicesApi } from '@/services/services-api';
import { ResponseDataCharts, StatInfo } from '@/services/entities';

const cx = classNames.bind(styles);

const { GetStat } = ServicesApi;

const { RangePicker } = DatePicker;

const formatData = (type:string, data: ResponseDataCharts): ECBasicOption => ({
  title: {
    show: true,
    text: type === 'bar' ? '近十日维修工单数' : '近十日维修收入额',
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
      type,
      smooth: true,
    },
  ],
});

// 限制当天之前的日期不可选

const endDate = moment().locale('zh-cn').format('YYYY-MM-DD');
const last10Days = moment().subtract('days', 10).format('YYYY-MM-DD');

const disabledDate = (current: moment.Moment) => current && current > moment().subtract(0, 'days');// 当天之后的不可选，不包括当天

// return current && current < moment().endOf(‘day');当天之前的不可选，包括当天

const formatEchartsFixNumberDataType = (data: StatInfo[]): ResponseDataCharts => ({
  result: data.map((item, index) => Number(item.repairCount)),
  date: data.map((item, index) => moment(item.date).format('MM月DD日')),
});

const formatEchartsMoneyDataType = (data: StatInfo[]): ResponseDataCharts => ({
  result: data.map((item, index) => Number(item.totalPrice)),
  date: data.map((item, index) => moment(item.date).format('MM月DD日')),
});

const Home: React.FC = () => {
  const [chartData, setChartData] = useState<ECBasicOption>();
  const [chartMoneyData, setChartMoneyData] = useState<ECBasicOption>();

  useEffect(() => {
    GetStat({ beginDate: last10Days, endDate }).then((res) => {
      setChartData(formatData('bar', formatEchartsFixNumberDataType(res.data)));
      setChartMoneyData(formatData('line', formatEchartsMoneyDataType(res.data)));
    });
  }, []);
  return (
    <>
      <div className={cx('header-title')}>欢迎使用维修管理平台</div>
      <span>选择时间范围（默认十天）</span>
      <RangePicker
        disabledDate={disabledDate}
        style={{ marginBottom: 20 }}
        onChange={(e, dateString) => {
          const [begin, end] = dateString;
          GetStat({ beginDate: begin, endDate: end }).then((res) => {
            setChartData(formatData('bar', formatEchartsFixNumberDataType(res.data)));
            setChartMoneyData(formatData('line', formatEchartsMoneyDataType(res.data)));
          });
        }}
      />
      <div className={cx('home-charts-list')}>
        {chartData ? <Charts headerTitle="charts图" chartID="chartData" options={chartData} styles={{ width: '48%', height: '70vh' }} />
          : null}
        {chartMoneyData ? <Charts headerTitle="charts图" chartID="chartMoneyData" options={chartMoneyData} styles={{ width: '48%', height: '70vh' }} />
          : null}
      </div>

    </>
  );
};

export default Home;
