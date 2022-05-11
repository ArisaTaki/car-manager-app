// login Status here
import store from 'store';
import { UserTokenKeyInfo } from '@/services/entities';

const USER_INFO = 'user_info';

export const saveUser = (data: UserTokenKeyInfo) => {
  store.set(USER_INFO, data);
};

export const getUser = (): UserTokenKeyInfo => store.get(USER_INFO);

export const deleteUser = () => {
  store.remove(USER_INFO);
};
