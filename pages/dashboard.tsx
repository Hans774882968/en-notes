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

function useRecordCountThisMonth() {
  const { data, isLoading } = useSWR(
    '/api/dashboard/recordCountThisMonth',
    (url) => Request.get<DashboardResp>({ url })
  );
  const wordLearn = data?.word.learn || 0;
  const wordLearnOrReview = data?.word.learnOrReview || 0;
  const wordDateArr = data?.word.data.map((item) => item.date) || [];
  const wordLearnArr = data?.word.data.map((item) => item.learn) || [];
  const wordLearnOrReviewArr = data?.word.data.map((item) => item.learnOrReview) || [];
  const cnWordLearn = data?.cnWord.learn || 0;
  const cnWordLearnOrReview = data?.cnWord.learnOrReview || 0;
  const cnWordDateArr = data?.cnWord.data.map((item) => item.date) || [];
  const cnWordLearnArr = data?.cnWord.data.map((item) => item.learn) || [];
  const cnWordLearnOrReviewArr = data?.cnWord.data.map((item) => item.learnOrReview) || [];
  const sentenceLearn = data?.sentence.learn || 0;
  const sentenceLearnOrReview = data?.sentence.learnOrReview || 0;
  const sentenceDateArr = data?.sentence.data.map((item) => item.date) || [];
  const sentenceLearnArr = data?.sentence.data.map((item) => item.learn) || [];
  const sentenceLearnOrReviewArr = data?.sentence.data.map((item) => item.learnOrReview) || [];
  return {
    cnWordDateArr,
    cnWordLearn,
    cnWordLearnArr,
    cnWordLearnOrReview,
    cnWordLearnOrReviewArr,
    isLoading,
    sentenceDateArr,
    sentenceLearn,
    sentenceLearnArr,
    sentenceLearnOrReview,
    sentenceLearnOrReviewArr,
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
    sentenceLearnOrReview,
    sentenceLearnOrReviewArr,
    wordDateArr,
    wordLearn,
    wordLearnArr,
    wordLearnOrReview,
    wordLearnOrReviewArr
  } = useRecordCountThisMonth();

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
