export const formatRole = (number: number) => {
  switch (number) {
    case 0:
      return '管理员';
      break;
    case 1:
      return '客服';
      break;
    case 2:
      return '顾问';
      break;
    default:
      return '未选择';
  }
};
