import { DashboardResp } from '@/lib/backend/paramAndResp';
import { useThemeContext } from '@/components/ThemeContext';
import Card from 'antd/lib/card';
import Col from 'antd/lib/col';
import EnLayout from '@/components/EnLayout';
import Form from 'antd/lib/form';
import ReactEcharts from 'echarts-for-react';
import Request from '@/lib/frontend/request';
import Row from 'antd/lib/row';
import styles from './dashboard.module.scss';
import useSWR from 'swr';

export const displayFormLayout = {
  labelCol: { span: 16 }
};

function TotalCard({
  title,
  learn,
  learnOrReview
}: { title: string, learn: number, learnOrReview: number }) {
  return (
    <Card size="small" title={title} hoverable>
      <Form {...displayFormLayout}>
        <Form.Item style={{ marginBottom: 0 }} label="learned this month">{learn}</Form.Item>
        <Form.Item style={{ marginBottom: 0 }} label="learned or reviewed this month">{learnOrReview}</Form.Item>
      </Form>
    </Card>
  );
}

function useDashboard() {
  const { data, isLoading } = useSWR(
    '/api/dashboard/dashboard',
    (url) => Request.get<DashboardResp>({ url })
  );

  const recordCount = data?.recordCount;
  const wordLearn = recordCount?.word.learn || 0;
  const wordLearnOrReview = recordCount?.word.learnOrReview || 0;
  const wordDateArr = recordCount?.word.data.map((item) => item.date) || [];
  const wordLearnArr = recordCount?.word.data.map((item) => item.learn) || [];
  const wordLearnOrReviewArr = recordCount?.word.data.map((item) => item.learnOrReview) || [];
  const cnWordLearn = recordCount?.cnWord.learn || 0;
  const cnWordLearnOrReview = recordCount?.cnWord.learnOrReview || 0;
  const cnWordDateArr = recordCount?.cnWord.data.map((item) => item.date) || [];
  const cnWordLearnArr = recordCount?.cnWord.data.map((item) => item.learn) || [];
  const cnWordLearnOrReviewArr = recordCount?.cnWord.data.map((item) => item.learnOrReview) || [];
  const sentenceLearn = recordCount?.sentence.learn || 0;
  const sentenceLearnOrReview = recordCount?.sentence.learnOrReview || 0;
  const sentenceDateArr = recordCount?.sentence.data.map((item) => item.date) || [];
  const sentenceLearnArr = recordCount?.sentence.data.map((item) => item.learn) || [];
  const sentenceLearnOrReviewArr = recordCount?.sentence.data.map((item) => item.learnOrReview) || [];

  const synonymCount = data?.synonymCount || [];

  const sentenceCountOfWord = data?.sentenceCountOfWord || [];

  return {
    cnWordDateArr,
    cnWordLearn,
    cnWordLearnArr,
    cnWordLearnOrReview,
    cnWordLearnOrReviewArr,
    isLoading,
    sentenceCountOfWord,
    sentenceDateArr,
    sentenceLearn,
    sentenceLearnArr,
    sentenceLearnOrReview,
    sentenceLearnOrReviewArr,
    synonymCount,
    wordDateArr,
    wordLearn,
    wordLearnArr,
    wordLearnOrReview,
    wordLearnOrReviewArr
  };
}

// 必须拆分，否则拿不到 themeContext
function Dashboard() {
  const themeContext = useThemeContext();
  const mdEditorThemeName = themeContext?.mdEditorThemeName;

  const {
    cnWordDateArr,
    cnWordLearn,
    cnWordLearnArr,
    cnWordLearnOrReview,
    cnWordLearnOrReviewArr,
    sentenceDateArr,
    sentenceLearn,
    sentenceLearnArr,
    sentenceCountOfWord,
    sentenceLearnOrReview,
    sentenceLearnOrReviewArr,
    wordDateArr,
    wordLearn,
    wordLearnArr,
    wordLearnOrReview,
    wordLearnOrReviewArr,
    synonymCount
  } = useDashboard();

  const getStatisticsOption = (
    model: string,
    dateArr: unknown[],
    learnArr: number[],
    learnOrReviewArr: number[]
  ) => ({
    legend: {
      orient: 'vertical',
      x: 'right',
      y: 'top'
    },
    series: [
      {
        data: learnArr,
        label: {
          position: 'top',
          show: true
        },
        name: 'Learn',
        type: 'line'
      },
      {
        data: learnOrReviewArr,
        label: {
          position: 'top',
          show: true
        },
        name: 'Learn or Review',
        type: 'line'
      }
    ],
    title: {
      left: 'center',
      text: `Statistics of ${model}s this month`
    },
    tooltip: {
      axisPointer: {
        type: 'cross'
      },
      trigger: 'axis'
    },
    xAxis: {
      data: dateArr,
      type: 'category'
    },
    yAxis: {
      type: 'value'
    }
  });

  const wordOption = getStatisticsOption('word', wordDateArr, wordLearnArr, wordLearnOrReviewArr);
  const cnWordOption = getStatisticsOption('English topic', cnWordDateArr, cnWordLearnArr, cnWordLearnOrReviewArr);
  const sentenceOption = getStatisticsOption('sentence', sentenceDateArr, sentenceLearnArr, sentenceLearnOrReviewArr);

  const getPieChartOption = (dataArr: unknown[], titleText: string) => ({
    legend: {
      orient: 'vertical',
      x: 'right',
      y: 'top'
    },
    series: [
      {
        data: dataArr,
        label: {
          normal: {
            formatter: '{b}: {c} ({d}%)'
          }
        },
        radius: [0, '70%'],
        type: 'pie'
      }
    ],
    title: {
      left: 'center',
      text: titleText
    },
    tooltip: {
      trigger: 'item'
    }
  });

  const synonymCountOption = getPieChartOption(synonymCount, 'Statistics on the number of synonyms per word');

  const sentenceCountOfWordOption = getPieChartOption(sentenceCountOfWord, 'Statistics on the number of sentences per word');

  return (
    <div className={styles.dashboard}>
      <Row gutter={16}>
        <Col span={8}>
          <TotalCard title="words" learn={wordLearn} learnOrReview={wordLearnOrReview} />
        </Col>
        <Col span={8}>
          <TotalCard title="English topics" learn={cnWordLearn} learnOrReview={cnWordLearnOrReview} />
        </Col>
        <Col span={8}>
          <TotalCard title="sentences" learn={sentenceLearn} learnOrReview={sentenceLearnOrReview} />
        </Col>
      </Row>
      <div>
        <ReactEcharts option={wordOption} theme={mdEditorThemeName} />
        <ReactEcharts option={cnWordOption} theme={mdEditorThemeName} />
        <ReactEcharts option={sentenceOption} theme={mdEditorThemeName} />
      </div>
      <div className={styles.pieCharts}>
        <ReactEcharts className={styles.pieChart} option={synonymCountOption} theme={mdEditorThemeName} />
        <ReactEcharts className={styles.pieChart} option={sentenceCountOfWordOption} theme={mdEditorThemeName} />
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
