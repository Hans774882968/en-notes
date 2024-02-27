[TOC]

## 基础组件

### Jest

根据[官方文档](https://nextjs.org/docs/app/building-your-application/testing/jest)，我们不得不走一遍比较麻烦的手动配置流程。整个流程走下来以后，如果不引入`lodash-es`等包就OK。但如果引用了，就会碰到这个问题：jest不支持`es`模块的`npm`包（如：`lodash-es`）。

首先我按我去年做的[hans-reres 项目](https://github.com/Hans774882968/hans-reres/blob/main/README.md)走了一遍 jest 配置流程，发现问题并没有解决。值得注意的是，之前提到的babel配置文件是不必要的，且会造成next项目无法启动。`transform`配置暂时改成：

```ts
transform: {
  '^.+\\.(ts|tsx)$': 'ts-jest',
  '^.+\\.js$': 'ts-jest' // 不用 'babel-jest'
}
```

然后我在急了一段时间后，决定Google一下，找到了[参考链接4](https://github.com/vercel/next.js/discussions/34589)，大意是 next 内部的代码导致`transformIgnorePatterns`加不上了，所以我们不得不在下面多写一段代码把这个配置加回来。

```ts
// 原本的代码是 export default createJestConfig(config); 需要改成下面这一坨

const nextGetConfig = createJestConfig(config);

const getConfig = async () => {
  const nextJestConfig = await nextGetConfig();
  const transformIgnorePatterns = [
    '<rootDir>/node_modules/(?!lodash-es)',
    ...(nextJestConfig.transformIgnorePatterns || []).filter(
      (pattern) => pattern !== '/node_modules/'
    )
  ];
  return {
    ...nextJestConfig,
    transformIgnorePatterns
  };
};

export default getConfig;
```

重新运行，发现问题已经解决。但严格来说我这个 workaround 也可能埋坑。看[相关源码](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/jest/jest.ts)

```ts
        transformIgnorePatterns: [
          // To match Next.js behavior node_modules is not transformed, only `transpiledPackages`
          ...(transpiled
            ? [
                `/node_modules/(?!.pnpm)(?!(${transpiled})/)`,
                `/node_modules/.pnpm/(?!(${transpiled.replace(
                  /\//g,
                  '\\+'
                )})@)`,
              ]
            : ['/node_modules/']),
          // CSS modules are mocked so they don't need to be transformed
          '^.+\\.module\\.(css|sass|scss)$',

          // Custom config can append to transformIgnorePatterns but not modify it
          // This is to ensure `node_modules` and .module.css/sass/scss are always excluded
          ...(resolvedJestConfig.transformIgnorePatterns || []),
        ],
```

幸好我目前用的`npm`，不用`pnpm`，暂时不用管。

#### VSCode Jest插件

去年这个插件不会在每次修改文件都自动跑测试的，今年发现新增了这个irritating的特性。根据[官方文档](https://github.com/jest-community/vscode-jest#runmode)，`Ctrl+Shift+P`打开`User Settings`，改下`"jest.runMode": "on-demand"`就行。

### MarkdownEditor

#### 字数、行数统计

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

## 具体页面

### 单词、English Topic创建、编辑二合一页

这个页面希望创建、编辑二合一，所以我设计了一个状态机。目前拥有的状态：Search、Fetch Record、Create、Update。进入页面时为Search状态；输入关键词后搜索单词；输入框失去焦点后，获取记录前变为Fetch Record状态；请求返回后，若数据库有记录则变为Update状态，否则为Create状态；提交后要立刻再次拉取记录，如果原先是Create状态则变为Update状态，否则状态不变。为什么这里没有提及“获取下拉框选项”相关的状态？因为获取下拉框选项和失去焦点后获取记录这两件事的发生顺序不一定是前者先于后者，可能是：发起获取下拉框选项的请求→发起获取记录的请求→获取记录的请求返回→获取下拉框选项的请求返回，等等顺序。这就存在一个竞态条件。为了规避这个问题，我们就不引入这两个状态，而是单独用`isFetchingOptions`变量控制。

状态机的实现可以单独抽出一个自定义hook。因为react存在这么一个问题：

```tsx
function onClick() {
  console.log(count); // value is x
  setCount(count + 1);
  console.log(count); // still x
  setCount(count + 1);
  console.log(count); // still x
}
```

并不能做到加两次，所以我们使用了`react-use`的`useGetSet`（`ahooks`也提供了类似的hook）。[实现代码传送门](https://github.com/Hans774882968/en-notes/blob/main/lib/frontend/hooks/useCreateUpdateStateMachine.ts)

## 参考资料

1. https://juejin.cn/post/7176075684823957561
2. https://juejin.cn/post/6969572789581938718
3. https://zh-hans.react.dev/learn/you-might-not-need-an-effect
4. next里使用Jest如何解决“不支持`es`模块的`npm`包”：https://github.com/vercel/next.js/discussions/34589