// login Status here
import store from 'store';
import { UserTokenKeyInfo } from '@/services/entities';

const USER_INFO = 'user_info';
const PATH_INFO = 'path-info';

export const saveUser = (data: UserTokenKeyInfo) => {
  store.set(USER_INFO, data);
};

export const getUser = (): UserTokenKeyInfo => store.get(USER_INFO);

export const deleteUser = () => {
  store.remove(USER_INFO);
};

export const savePath = (data?: string) => {
  store.set(PATH_INFO, data);
};

export const getPath = (): string => store.get(PATH_INFO);

export const deletePath = () => {
  store.remove(PATH_INFO);
};
