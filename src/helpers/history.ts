// history方法二次封装
import { push } from 'echarts/types/src/component/dataZoom/history';
import routerPath from '@/router/router-path';
import history from '@/utils/getHistory';
import { savePath } from '@/utils/storageUtils';

const DELAY_TIME_DEFAULT = 100;

export const pushWithDelay = (
  to: string,
  state?: any,
  delay = DELAY_TIME_DEFAULT,
): void => {
  setTimeout(() => {
    history.push(to, state);
  }, delay);
};

export const replaceWithDelay = (
  to: string,
  state?: any,
  delay = DELAY_TIME_DEFAULT,
): void => {
  setTimeout(() => {
    history.replace(to, state);
  }, delay);
};

export const goWithDelay = (to: number, delay = DELAY_TIME_DEFAULT): void => {
  setTimeout(() => {
    history.go(to);
  }, delay);
};

export const moveToSystemError404Page = (replace?: boolean, delay?: number) => {
  if (history) {
    const navi = replace ? replaceWithDelay : pushWithDelay;
    navi(routerPath.NotFind, null, delay);
  }
};

export const moveToSystemError403Page = (replace?:boolean, delay?: number) => {
  if (history) {
    const navi = replace ? replaceWithDelay : pushWithDelay;
    navi(routerPath.NoAuth, null, delay);
  }
};

export const redirectToLoginPageWithOutDelay = (nextPath?: string, isReplace?:boolean) => {
  if (history) {
    const navi = isReplace ? history.replace : history.push;
    navi(routerPath.Login);
    savePath(nextPath);
  }
};
