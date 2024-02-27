export const formLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 19 }
};

export const btnLayout = {
  wrapperCol: { offset: 3, span: 19 }
};

export const DEBOUNCE_DEFAULT_TIMEOUT = 500;
export const DEBOUNCE_DEFAULT_OPTION = {
  trailing: true
};

export const ECHARTS_AXIS_ARROW_CONFIG = {
  axisLine: {
    show: true,
    symbol: ['none', 'arrow'],
    symbolOffset: [0, 7],
    symbolSize: [8, 8]
  },
  axisTick: {
    inside: true,
    show: true
  }
};

export const WORD_COMPLEXITY_INTRO = 'len(note) + sum(len(sentences[i].sentence))';
export const CN_WORD_COMPLEXITY_INTRO = 'len(title) + len(note)';
export const SENTENCE_COMPLEXITY_INTRO = 'len(sentence) + len(note)';
