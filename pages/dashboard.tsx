import { DashboardResp, PieChartItem } from '@/lib/backend/paramAndResp';
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

  const wordCountOfSentence = data?.wordCountOfSentence || [];

  const wordComplexity = data?.wordComplexity || { ranges: [], values: [] };
  const sentenceComplexity = data?.sentenceComplexity || { ranges: [], values: [] };
  const cnWordComplexity = data?.cnWordComplexity || { ranges: [], values: [] };

  return {
    cnWordComplexity,
    cnWordDateArr,
    cnWordLearn,
    cnWordLearnArr,
    cnWordLearnOrReview,
    cnWordLearnOrReviewArr,
    isLoading,
    sentenceComplexity,
    sentenceCountOfWord,
    sentenceDateArr,
    sentenceLearn,
    sentenceLearnArr,
    sentenceLearnOrReview,
    sentenceLearnOrReviewArr,
    synonymCount,
    wordComplexity,
    wordCountOfSentence,
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
    synonymCount,
    wordCountOfSentence,
    wordComplexity,
    sentenceComplexity,
    cnWordComplexity
  } = useDashboard();

  const getStatisticsOption = (
    model: string,
    dateArr: string[],
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
      text: `Statistics of ${model}s This Month`
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

  const wordOption = getStatisticsOption('Word', wordDateArr, wordLearnArr, wordLearnOrReviewArr);
  const cnWordOption = getStatisticsOption('English Topic', cnWordDateArr, cnWordLearnArr, cnWordLearnOrReviewArr);
  const sentenceOption = getStatisticsOption('Sentence', sentenceDateArr, sentenceLearnArr, sentenceLearnOrReviewArr);

  const getPieChartOption = (dataArr: PieChartItem[], titleText: string) => ({
    legend: {
      orient: 'vertical',
      x: 'right',
      y: 'top'
    },
    series: [
      {
        data: dataArr,
        label: {
          formatter: '{b}: {c} ({d}%)'
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

  const synonymCountOption = getPieChartOption(synonymCount, 'Statistics on the Number of Synonyms Per Word');

  const sentenceCountOfWordOption = getPieChartOption(sentenceCountOfWord, 'Statistics on the Number of Sentences Per Word');

  const wordCountOfSentenceOption = getPieChartOption(wordCountOfSentence, 'Statistics on the Number of Word Per Sentence');

  const getComplexityOption = (xData: string[], yData: number[], title: string, subTitle: string) => ({
    grid: {
      top: 70
    },
    legend: {
      orient: 'vertical',
      x: 'right',
      y: 'top'
    },
    series: [
      {
        data: yData,
        label: {
          position: 'top',
          show: true
        },
        type: 'bar'
      }
    ],
    title: {
      left: 'center',
      subtext: subTitle,
      text: title
    },
    tooltip: {
      axisPointer: {
        type: 'cross'
      },
      trigger: 'axis'
    },
    xAxis: {
      axisLabel: {
        interval: 0
      },
      axisLine: {
        show: true,
        symbol: ['none', 'arrow'],
        symbolOffset: [0, 7],
        symbolSize: [8, 8]
      },
      axisTick: {
        inside: true,
        show: true
      },
      data: xData,
      type: 'category'
    },
    yAxis: {
      axisLine: {
        show: true,
        symbol: ['none', 'arrow'],
        symbolOffset: [0, 7],
        symbolSize: [8, 8]
      },
      axisTick: {
        inside: true,
        show: true
      },
      name: 'Count',
      type: 'value'
    }
  });

  const wordComplexityOption = getComplexityOption(
    wordComplexity.ranges,
    wordComplexity.values,
    'Word Complexity',
    '(len(note) + sum(len(sentences[i].sentence)))'
  );
  const sentenceComplexityOption = getComplexityOption(
    sentenceComplexity.ranges,
    sentenceComplexity.values,
    'Sentence Complexity',
    '(len(sentence) + len(note))'
  );
  const cnWordComplexityOption = getComplexityOption(
    cnWordComplexity.ranges,
    cnWordComplexity.values,
    'English Topic Complexity',
    '(len(title) + len(note))'
  );

  return (
    <div className={styles.dashboard} >
      <Row gutter={16}>
        <Col span={8}>
          <TotalCard title="Words" learn={wordLearn} learnOrReview={wordLearnOrReview} />
        </Col>
        <Col span={8}>
          <TotalCard title="English Topics" learn={cnWordLearn} learnOrReview={cnWordLearnOrReview} />
        </Col>
        <Col span={8}>
          <TotalCard title="Sentences" learn={sentenceLearn} learnOrReview={sentenceLearnOrReview} />
        </Col>
      </Row>
      <div>
        <ReactEcharts option={wordOption} theme={mdEditorThemeName} />
        <ReactEcharts option={cnWordOption} theme={mdEditorThemeName} />
        <ReactEcharts option={sentenceOption} theme={mdEditorThemeName} />
      </div>
      <div className={styles.charts}>
        <ReactEcharts className={styles.chart} option={synonymCountOption} theme={mdEditorThemeName} />
        <ReactEcharts className={styles.chart} option={sentenceCountOfWordOption} theme={mdEditorThemeName} />
      </div>
      <div className={styles.charts}>
        <ReactEcharts className={styles.chart} option={wordCountOfSentenceOption} theme={mdEditorThemeName} />
        <ReactEcharts className={styles.chart} option={wordComplexityOption} theme={mdEditorThemeName} />
      </div>
      <div className={styles.charts}>
        <ReactEcharts className={styles.chart} option={sentenceComplexityOption} theme={mdEditorThemeName} />
        <ReactEcharts className={styles.chart} option={cnWordComplexityOption} theme={mdEditorThemeName} />
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
