import {
  CN_WORD_COMPLEXITY_INTRO,
  ECHARTS_AXIS_ARROW_CONFIG,
  SENTENCE_COMPLEXITY_INTRO,
  WORD_COMPLEXITY_INTRO
} from '@/lib/frontend/const';
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

  const newTextWritten = data?.newTextWritten || { cnWordNewWrittenTotals: [], dates: [], sentenceNewWrittenTotals: [], wordNewWrittenTotals: [] };

  return {
    cnWordComplexity,
    cnWordDateArr,
    cnWordLearn,
    cnWordLearnArr,
    cnWordLearnOrReview,
    cnWordLearnOrReviewArr,
    isLoading,
    newTextWritten,
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
  const { mdEditorThemeName } = useThemeContext();

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
    cnWordComplexity,
    newTextWritten
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

  const getComplexityOption = (xData: string[], yData: number[], titleText: string, subTitleText: string) => ({
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
      subtext: subTitleText,
      text: titleText
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
      data: xData,
      type: 'category',
      ...ECHARTS_AXIS_ARROW_CONFIG
    },
    yAxis: {
      name: 'Count',
      type: 'value',
      ...ECHARTS_AXIS_ARROW_CONFIG
    }
  });

  const wordComplexityOption = getComplexityOption(
    wordComplexity.ranges,
    wordComplexity.values,
    'Word Complexity',
    `(${WORD_COMPLEXITY_INTRO})`
  );
  const sentenceComplexityOption = getComplexityOption(
    sentenceComplexity.ranges,
    sentenceComplexity.values,
    'Sentence Complexity',
    `(${SENTENCE_COMPLEXITY_INTRO})`
  );
  const cnWordComplexityOption = getComplexityOption(
    cnWordComplexity.ranges,
    cnWordComplexity.values,
    'English Topic Complexity',
    `(${CN_WORD_COMPLEXITY_INTRO})`
  );

  const getNewTextWrittenOption = (titleText: string, series: object[]) => ({
    legend: {
      orient: 'vertical',
      x: 'right',
      y: 'top'
    },
    series,
    title: {
      left: 'center',
      text: titleText
    },
    tooltip: {
      axisPointer: {
        type: 'cross'
      },
      trigger: 'axis'
    },
    xAxis: {
      data: newTextWritten.dates,
      type: 'category',
      ...ECHARTS_AXIS_ARROW_CONFIG
    },
    yAxis: {
      name: 'Characters',
      type: 'value',
      ...ECHARTS_AXIS_ARROW_CONFIG
    }
  });

  const wordNewTextWrittenOption = getNewTextWrittenOption(
    'Statistics of Newly Written Text (Word)',
    [
      {
        data: newTextWritten.wordNewWrittenTotals,
        label: {
          position: 'top',
          show: true
        },
        name: 'Word',
        type: 'line'
      }
    ]
  );
  const cnWordAndSentenceNewTextWrittenOption = getNewTextWrittenOption(
    'Statistics of Newly Written Text (English Topic and Sentence)',
    [
      {
        data: newTextWritten.cnWordNewWrittenTotals,
        label: {
          position: 'top',
          show: true
        },
        name: 'English Topic',
        type: 'line'
      },
      {
        data: newTextWritten.sentenceNewWrittenTotals,
        label: {
          position: 'top',
          show: true
        },
        name: 'Sentence',
        type: 'line'
      }
    ]
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
      <div>
        <ReactEcharts option={wordNewTextWrittenOption} theme={mdEditorThemeName} />
        <ReactEcharts option={cnWordAndSentenceNewTextWrittenOption} theme={mdEditorThemeName} />
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
