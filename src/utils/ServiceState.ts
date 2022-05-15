export const formatServiceState = (number: number): string => {
  switch (number) {
    case 0:
      return '待流转';
    case 1:
      return '审核通过';
    case 2:
      return '审核未通过';
    default:
      return '';
  }
};
