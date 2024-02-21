[toc]

## MarkdownEditor

### 字数、行数统计

为了实现字数、行数统计，我们首先想到的是用`@uiw/react-md-editor`提供的`onStatistics`事件。这个事件就是专门用来实现字数统计功能的。资料很少，实测结果：

```js
{
  "selection": {
    "start": 5,
    "end": 5
  },
  "text": "赞美的话5",
  "selectedText": "",
  "lineCount": 1,
  "length": 5
}
```

选中文本不提供行号+列号，让人很为难。最后的伪代码如下：

```tsx
const [lines, setLines] = useState(getLineCount(value));
const [characters, setCharacters] = useState(value ? value.length : 0);
const onStatistics = (data: Statistics) => {
  setLines(data.lineCount);
  setCharacters(data.length);
};

<div>
  <MDEditor
    onStatistics={onStatistics}
  />
  <div className={styles.statistics}>
    <span>lines: {lines}</span>
    <span>characters: {characters}</span>
  </div>
</div>
```

如果它的外部不会改变文本，用这个事件完全足够了。现在的问题是，我们之前实现了一个`Clean Note`功能，会在组件外部改变文本，我们需要感知到文本的改变并相应地更新`lines`和`characters`。这是[React中的一个很基础的问题](https://zh-hans.react.dev/learn/you-might-not-need-an-effect)，有几种做法：

1. 用`useEffect(() => xxx, [value])`。实际上这种场景不需要使用`useEffect`。
2. 抽出一个`Inner`组件，然后调用`<Inner key={value} />`。这样实现后行为的确符合预期，但1、很慢、很卡。2、每次输入一个字符都会丢失焦点，因为`key`的变化会导致整个DOM子树重新渲染。
3. 引入一个`lastValue`变量，`value !== lastValue`说明`value`改变了。使用该方案后`onStatistics`就可以删除了。

最终选用了方案3。伪代码：

```ts
const [lines, setLines] = useState(getLineCount(value));
const [characters, setCharacters] = useState(value ? value.length : 0);

const [lastValue, setLastValue] = useState('');

if (value !== lastValue) {
  setLastValue(value || '');
  setLines(getLineCount(value));
  setCharacters(value ? value.length : 0);
}
```

## 参考链接

1. https://juejin.cn/post/7176075684823957561
2. https://juejin.cn/post/6969572789581938718
3. https://zh-hans.react.dev/learn/you-might-not-need-an-effect