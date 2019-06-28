import * as React from 'react';
import * as R from 'ramda';
import TimeProcessor from './lib/TimeProcessor';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from 'classnames';
import Columns from './components/columns';
import Provider from './components/provider';
import {
  SchedulerProps,
  SchedulerState
} from './externals';

export const prefixCls = 'time-scheduler';
export const cellCls = `${prefixCls}-cell`;
export const cellColumnsCls = `${prefixCls}-col`;
export const cellHeaderCls = classnames(cellCls, `${prefixCls}-header-cell`);
export const TIMELINE_COL_WIDTH = 80;

export default class extends React.Component<SchedulerProps, SchedulerState> {
  static defaultProps: SchedulerProps = {
    startAt: '00:00',
    endAt: '23:50',
    timelineInterval: 30,
    timelineFormat: 'HH:mm',
    columns: [],
    dataSource: [],
    cellWidth: 200,
    cellHeight: 30,
    maxWidth: 800,
    maxHeight: 500,
    readonly: false,
    autoSize: true
  };
  header: any = React.createRef();
  row: any = React.createRef();
  cell: any = React.createRef();
  timeProcessor?: any;
  height: number = 0;
  width: number = 0;
  cellWidth: number = 0;
  maxWidth: number = 0;
  maxHeight: number = 0;
  scrollMarker = false;
  constructor(props) {
    super(props);
    this.timeProcessor = TimeProcessor.of(props.startAt, props.endAt);
    const serialization = this.timeProcessor.serialize(props.timelineInterval);
    const rows = serialization.map(v => ({
      title: v.format(props.timelineFormat),
      key: v.valueOf()
    }));
    this.width = props.cellWidth * props.columns.length + TIMELINE_COL_WIDTH;
    this.height = rows.length * props.cellHeight;
    this.maxHeight = Math.min(props.maxHeight, this.height);
    this.maxWidth = props.autoSize ? props.maxWidth : Math.min(props.maxWidth, this.width);
    this.cellWidth = props.autoSize ? Math.max(Math.floor((props.maxWidth - TIMELINE_COL_WIDTH) / props.columns.length), props.cellWidth) : props.cellWidth;
    this.state = {
      isScrollLeft: false,
      isScrollTop: false,
      rows
    };
  }
  componentWillReceiveProps(nextProps: SchedulerProps) {
    let rows = this.state.rows;
    // @ts-ignore
    const isDiff: any = R.complement(R.eqProps(R.__, nextProps, this.props));
    // 监听 columns、maxWidth 和 cellWidth 变化
    if ( nextProps.columns.length !== this.props.columns.length || isDiff('cellWidth') || isDiff('maxWidth') || isDiff('autoSize')) {
      this.width = nextProps.cellWidth * nextProps.columns.length + TIMELINE_COL_WIDTH;
      this.maxWidth = nextProps.autoSize ? nextProps.maxWidth : Math.min(nextProps.maxWidth, this.width);
      this.cellWidth = nextProps.autoSize ? Math.max(Math.floor((nextProps.maxWidth - TIMELINE_COL_WIDTH) / nextProps.columns.length), nextProps.cellWidth) : nextProps.cellWidth;
    }
    // 监听 startAt、endAt、timelineInterval 和 timelineFormat 变化
    if (isDiff('startAt') || isDiff('endAt') || isDiff('timelineInterval') || isDiff('timelineFormat')) {
      this.timeProcessor = TimeProcessor.of(nextProps.startAt, nextProps.endAt);
      const serialization = this.timeProcessor.serialize(nextProps.timelineInterval);
      rows = serialization.map(v => ({
        title: v.format(nextProps.timelineFormat),
        key: v.valueOf()
      }));
    }
    // 监听 rows、cellHeight 和 maxHeight 变化
    if (rows !== this.state.rows || isDiff('cellHeight') || isDiff('maxHeight')) {
      this.height = rows.length * nextProps.cellHeight;
      this.maxHeight = Math.min(nextProps.maxHeight, this.height);
    }
  }
  shouldComponentUpdate(nextProps: SchedulerProps, nextState: SchedulerState) {
    // @ts-ignore
    const isDiffState: any = R.complement(R.eqProps(R.__, nextState, this.state));
    const shouldUpdateState = R.keys(this.state).reduce((prev, key) => prev || isDiffState(key), false);
    return JSON.stringify(nextProps.dataSource) !== JSON.stringify(this.props.dataSource) || shouldUpdateState;
  }
  // 数据行列滚动
  handleBodyScroll = () => {
    const {onScroll} = this.props;
    if (this.scrollMarker) return this.scrollMarker = false;
    this.row.current.scrollTop = this.cell.current.view.scrollTop;
    this.header.current.scrollLeft = this.cell.current.view.scrollLeft;
    onScroll(this.cell.current.view.scrollTop, this.cell.current.view.scrollLeft);
    this.scrollMarker = true;
  }
  // 固定行列滚动
  handleFixedScroll = () => {
    const {onScroll} = this.props;
    if (this.scrollMarker) return this.scrollMarker = false;
    this.cell.current.view.scrollTop = this.row.current.scrollTop;
    this.cell.current.view.scrollLeft = this.header.current.scrollLeft;
    onScroll(this.row.current.scrollTop, this.header.current.scrollLeft);
    this.scrollMarker = true;
  }
  public render() {
    const {
      columns,
      timelineTitle,
      className,
      dataSource,
      cellHeight,
      autoSize
    } = this.props;
    const {rows} = this.state;
    const tableWidth = autoSize ? Math.max(this.maxWidth, this.width) : this.width;
    return (
      <Provider
        {...this.props}
        cellWidth={this.cellWidth}
      >
        <div className={classnames(prefixCls, className)} style={{maxWidth: this.maxWidth}}>
          {/* 表格表头 */}
          <div className={`${prefixCls}-header`} style={{width: tableWidth}}>
            <div
              className={classnames(cellHeaderCls, `${prefixCls}-timeline-title`)}
              style={{width: TIMELINE_COL_WIDTH, height: cellHeight, lineHeight: `${cellHeight}px`}}
            >
              {timelineTitle}
            </div>
            <div
              className={`${prefixCls}-header-col`}
              style={{width: this.maxWidth - TIMELINE_COL_WIDTH, height: cellHeight}}
            >
              <div
                ref={this.header}
                className={`${prefixCls}-header-col-items`}
                style={{width: this.maxWidth - TIMELINE_COL_WIDTH}}
                onScroll={this.handleFixedScroll}
              >
                <div style={{width: (tableWidth) - TIMELINE_COL_WIDTH}}>
                  {columns.map(v => {
                    return (
                      <div
                        key={v.key}
                        className={cellHeaderCls}
                        style={{width: this.cellWidth, height: cellHeight, lineHeight: `${cellHeight}px`}}
                      >
                        {v.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {/* 表格主体 */}
          <div className={`${prefixCls}-body`} style={{height: this.maxHeight, width: tableWidth}}>
            <div className={classnames(cellColumnsCls, `${prefixCls}-col-fixed`)}>
              <div
                ref={this.row}
                className={`${prefixCls}-col-fixed-container`}
                // 隐藏 多余的滚动条
                style={{height: this.maxHeight, width: this.maxWidth + 20}}
                onScroll={this.handleFixedScroll}
              >
                <div className={cellCls} style={{width: TIMELINE_COL_WIDTH, height: cellHeight / 2}}></div>
                {rows.map(v => {
                  return (
                    <div
                      key={v.key}
                      className={cellCls}
                      style={{width: TIMELINE_COL_WIDTH, height: cellHeight, lineHeight: `${cellHeight}px`}}
                    >
                      {v.title}
                    </div>
                  );
                })}
                <div className={cellCls} style={{width: TIMELINE_COL_WIDTH, height: cellHeight / 2}}></div>
              </div>
            </div>
            <Scrollbars
              ref={this.cell}
              onScroll={this.handleBodyScroll}
              autoHide
              style={{
                marginLeft: TIMELINE_COL_WIDTH,
                float: 'left',
                width: this.maxWidth - TIMELINE_COL_WIDTH,
                height: this.maxHeight
              }}
            >
              <div style={{width: tableWidth - TIMELINE_COL_WIDTH}}>
                {columns.map(v => {
                  return (
                    <Columns
                      key={v.key}
                      targetCol={v}
                      rows={rows}
                      cellCls={cellCls}
                      dataSource={dataSource.filter(x => x.colKey === v.key)}
                    />
                  );
                })}
              </div>
            </Scrollbars>
          </div>
        </div>
      </Provider>
    );
  }
}