import { RecordCountThisMonthResp } from '@/lib/backend/paramAndResp';
import { useThemeContext } from '@/components/ThemeContext';
import Card from 'antd/lib/card';
import EnLayout from '@/components/EnLayout';
import ReactEcharts from 'echarts-for-react';
import Request from '@/lib/frontend/request';
import styles from './dashboard.module.scss';
import useSWR from 'swr';

function useRecordCountThisMonth() {
  const { data, isLoading } = useSWR(
    '/api/dashboard/recordCountThisMonth',
    (url) => Request.get<RecordCountThisMonthResp>({ url })
  );
  const wordTotal = data?.word.total || 0;
  const wordDateArr = data?.word.result.map((item) => item.date) || [];
  const wordCountArr = data?.word.result.map((item) => item.count) || [];
  const cnWordTotal = data?.cnWord.total || 0;
  const cnWordDateArr = data?.cnWord.result.map((item) => item.date) || [];
  const cnWordCountArr = data?.cnWord.result.map((item) => item.count) || [];
  const sentenceTotal = data?.sentence.total || 0;
  const sentenceDateArr = data?.sentence.result.map((item) => item.date) || [];
  const sentenceCountArr = data?.sentence.result.map((item) => item.count) || [];
  return {
    cnWordCountArr,
    cnWordDateArr,
    cnWordTotal,
    isLoading,
    sentenceCountArr,
    sentenceDateArr,
    sentenceTotal,
    wordCountArr,
    wordDateArr,
    wordTotal
  };
}

// 必须拆分，否则拿不到 themeContext
function Dashboard() {
  const themeContext = useThemeContext();
  const mdEditorThemeName = themeContext?.mdEditorThemeName;

  const {
    cnWordCountArr,
    cnWordDateArr,
    cnWordTotal,
    wordCountArr,
    wordDateArr,
    wordTotal,
    sentenceCountArr,
    sentenceDateArr,
    sentenceTotal
  } = useRecordCountThisMonth();

  const getStatisticsOption = (model: string, dateArr: unknown[], countArr: number[]) => ({
    series: [
      {
        data: countArr,
        label: {
          position: 'top',
          show: true
        },
        type: 'line'
      }
    ],
    title: {
      left: 'center',
      text: `Statistics of the number of ${model}s learned this month`
    },
    xAxis: {
      data: dateArr,
      type: 'category'
    },
    yAxis: {
      type: 'value'
    }
  });

  const wordCountOption = getStatisticsOption('word', wordDateArr, wordCountArr);
  const cnWordCountOption = getStatisticsOption('English topic', cnWordDateArr, cnWordCountArr);
  const sentenceCountOption = getStatisticsOption('sentence', sentenceDateArr, sentenceCountArr);

  return (
    <div className={styles.dashboard}>
      <div className={styles.summary}>
        <Card size="small" title="words learned this month">{wordTotal}</Card>
        <Card size="small" title="English topics learned this month">{cnWordTotal}</Card>
        <Card size="small" title="sentences learned this month">{sentenceTotal}</Card>
      </div>
      <div>
        <ReactEcharts option={wordCountOption} theme={mdEditorThemeName} />
        <ReactEcharts option={cnWordCountOption} theme={mdEditorThemeName} />
        <ReactEcharts option={sentenceCountOption} theme={mdEditorThemeName} />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <EnLayout>
      <Dashboard />
    </EnLayout>
  );
}
