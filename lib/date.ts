import dayjs from 'dayjs';

export function getDatesByInterval(startDate: Date, endDate: Date) {
  const res: string[] = [];
  for (let curDayjsObj = dayjs(startDate); curDayjsObj.toDate() <= endDate; curDayjsObj = curDayjsObj.add(1, 'day')) {
    const curDateStr = curDayjsObj.format('YYYY-MM-DD');
    res.push(curDateStr);
  }
  return res;
}
