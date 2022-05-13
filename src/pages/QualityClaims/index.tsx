import React, { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './style.module.scss';
import { getUser } from '@/utils/storageUtils';
import { moveToSystemError403Page } from '@/helpers/history';

const cx = classNames.bind(styles);

const QualityClaims: React.FC = () => {
  useEffect(() => {
    if (getUser().type !== 0 && getUser().type !== 4) {
      moveToSystemError403Page();
    }
  });
  return (
    <div>
      <p>质量索赔</p>
    </div>
  );
};

export default QualityClaims;
