# Time Schedule

React 时间日程安排控件

## DEMO

跟 `antd` 配合使用的DEMO

![Alt Text](https://i.bmp.ovh/imgs/2019/07/def6f025493be745.gif)

## 安装

```bash
npm i time-schedule --save-dev
```

## 使用

```typescript
import 'time-schedule/lib/style/index.css';
import Schedule from 'time-schedule';
```

## 示例

```typescript
<Schedule
  timelineTitle="Time/Name"
  timelineWidth={120}
  startAt="08:00"
  endAt="22:00"
  cellWidth={200}
  maxWidth={850}
  maxHeight={600}
  columns={[
    {key: 'saber', title: 'Saber'},
    {key: 'archer', title: 'Archer'}
  ]}
  dataSource={[]}
/>
```
有关更完整的示例，请参阅`src / example`。


## API

## Schedule Props

参数 | 说明 | 类型 | 默认值
-|-|-|-
className | Scheduler 组件样式类名 | string | -
dataSource | 数据数组 | IDataSourceProps[] | []
startAt | 开始时间，如 '9:00' (HH:mm) | string | '00:00'
endAt | 结束时间，如 '17:00' (HH:mm) | string | '23:50'
timelineTitle | 时间轴显示文字 | string | ReactNode | -
timelineWidth | 时间轴宽度 | number | 80
timelineInterval | 时间区间间隔 (m) 默认值：30（半小时） | number | 30
timelineFormat | 设置时间轴时间格式。配置参考 moment.js | string | 'HH:mm'
columns| 表格列的配置 | IColumnProps[] | []
cellWidth | 单元格宽度 | number | 200
cellHeight | 单元格高度 | number | 30
maxWidth | Scheduler 组件最大宽度 | string \| number | 800
maxHeight | Scheduler 组件最大高度 | string \| number | 500
readonly | 是否只读状态 | boolean | false
autoSize | 是否自动适应最大宽度宽度 | boolean | true

## Event
参数|说明|参数
-|-|-
onSelect | 时间选择回调 | function({rowStartKey: string, rowEndKey: string, col: IColumnProps})
onScroll | 滚动事件 | function(scrollTop: number, scrollLeft: number)
selectedDataFaCC | 数据显示的函数子组件<br />只有 dataSource 变化，才触发子组件更新 | function(data: IDataSourceProps)

## IColumnProps

列描述数据对象

参数 | 说明 | 类型 | 默认值
-|-|-|-
key | React 需要的 key | string | -
title | 列头显示内容	| string \| ReactNode | -
(other fields) | 冗余字段。当调用 onSelect({rowStart, rowEnd, col}) 方法, `col` 将会返回这些冗余字段 | [property: string]: any | -

## IDataSourceProps

数据源描述对象

参数 | 说明 | 类型 | 默认值
-|-|-|-
colKey | IColumnProps 里的 key，用于定位数据的列项 | string | -
rowEndKey | 开始时间，如 '9:00'(HH:mm) | string | -
rowStartKey | 结束时间，如 '17:00'(HH:mm) | string | -
dataKey | 设置显示区域 key 值 | string | -
(other fields) | 冗余字段。当调用 selectedDataFaCC(data) 渲染, `data` 将会返回这些冗余字段 | [property: string]: any | -