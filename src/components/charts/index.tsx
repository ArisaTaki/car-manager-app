import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import * as echarts from 'echarts';
import { ECBasicOption } from 'echarts/types/dist/shared';
import style from './style.module.scss';

const cx = classNames.bind(style);

export interface ChartsLineProps {
  options: ECBasicOption,
  className?: string,
  styles?: React.CSSProperties,
  headerTitle?: string
}

const Charts: React.FC<ChartsLineProps> = ({
  options, headerTitle, styles, className,
}) => {
  const renderEcharts = () => {
    const renderDom = document.getElementById('div');
    const testCharts = echarts.init(renderDom!);
    const dom = testCharts.setOption(options);
    return (
      { dom }
    );
  };

  useEffect(() => {
    renderEcharts();
  }, []);

  return (
    <div id="div" className={cx('init-style', className)} style={styles}>
      {headerTitle}
    </div>
  );
};

export default Charts;
