import * as React from 'react';
import * as R from 'ramda';
import TimeProcessor from './lib/TimeProcessor';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from 'classnames';
import Columns, { IAppProps } from './components/columns';
import Provider from './components/provider';
import {
  ScheduleProps,
  ScheduleState
} from './externals';

export const prefixCls = 'time-schedule';
export const cellCls = `${prefixCls}-cell`;
export const cellColumnsCls = `${prefixCls}-col`;
export const cellHeaderCls = classnames(cellCls, `${prefixCls}-header-cell`);

export default class extends React.Component<ScheduleProps, ScheduleState> {
  static displayName = 'Time-schedule';
  static defaultProps: ScheduleProps = {
    startAt: '00:00',
    endAt: '23:50',
    timelineInterval: 30,
    timelineWidth: 80,
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
  constructor(props: IAppProps) {
    super(props);
    this.timeProcessor = TimeProcessor.of(props.startAt, props.endAt);
    const serialization = this.timeProcessor.serialize(props.timelineInterval);
    const rows = serialization.map(v => ({
      title: v.format(props.timelineFormat),
      key: v.valueOf()
    }));
    this.width = props.cellWidth * props.columns.length + props.timelineWidth;
    this.height = rows.length * props.cellHeight;
    this.maxHeight = Math.min(props.maxHeight, this.height);
    this.maxWidth = props.autoSize ? props.maxWidth : Math.min(props.maxWidth, this.width);
    this.cellWidth = props.autoSize ? Math.max(Math.floor((props.maxWidth - props.timelineWidth) / props.columns.length), props.cellWidth) : props.cellWidth;
    this.state = {
      isScrollLeft: false,
      isScrollTop: false,
      rows
    };
  }
  componentWillReceiveProps(nextProps: ScheduleProps) {
    let rows = this.state.rows;
    // @ts-ignore
    const isDiff: any = R.complement(R.eqProps(R.__, nextProps, this.props));
    // 监听 columns、maxWidth 和 cellWidth 变化
    if ( nextProps.columns.length !== this.props.columns.length || isDiff('cellWidth') || isDiff('maxWidth') || isDiff('autoSize') || isDiff('timelineWidth')) {
      this.width = nextProps.cellWidth * nextProps.columns.length + nextProps.timelineWidth;
      this.maxWidth = nextProps.autoSize ? nextProps.maxWidth : Math.min(nextProps.maxWidth, this.width);
      this.cellWidth = nextProps.autoSize ? Math.max(Math.floor((nextProps.maxWidth - nextProps.timelineWidth) / nextProps.columns.length), nextProps.cellWidth) : nextProps.cellWidth;
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
  shouldComponentUpdate(nextProps: ScheduleProps, nextState: ScheduleState) {
    // @ts-ignore
    const isDiffState: any = R.complement(R.eqProps(R.__, nextState, this.state));
    const isDiffPropsJSON: any = key => JSON.stringify(nextProps[key]) !== JSON.stringify(this.props[key]);
    const getColumnsKeyString = obj => JSON.stringify(R.pluck('key')(obj.columns));
    const columnsKeyEquals = R.equals(getColumnsKeyString(nextProps), getColumnsKeyString(this.props));
    // @ts-ignore
    const getColumnsTitleSnap = R.compose(R.map(R.when(R.has('toJSON'), v => v.toJSON())), R.pluck('title'), R.prop('columns'));
    const columnsTitleEquals = R.equals(getColumnsTitleSnap(nextProps), getColumnsTitleSnap(this.props));
    const shouldUpdateState = R.keys(this.state).reduce((prev, key) => prev || isDiffState(key), false);

    return isDiffPropsJSON('dataSource') || !columnsKeyEquals || !columnsTitleEquals || shouldUpdateState;
  }
  // 数据行列滚动
  handleBodyScroll = () => {
    const {onScroll} = this.props;
    if (this.scrollMarker) return this.scrollMarker = false;
    this.row.current.scrollTop = this.cell.current.view.scrollTop;
    this.header.current.scrollLeft = this.cell.current.view.scrollLeft;
    onScroll && onScroll(this.cell.current.view.scrollTop, this.cell.current.view.scrollLeft);
    this.scrollMarker = true;
  }
  // 固定行列滚动
  handleFixedScroll = () => {
    const {onScroll} = this.props;
    if (this.scrollMarker) return this.scrollMarker = false;
    this.cell.current.view.scrollTop = this.row.current.scrollTop;
    this.cell.current.view.scrollLeft = this.header.current.scrollLeft;
    onScroll && onScroll(this.row.current.scrollTop, this.header.current.scrollLeft);
    this.scrollMarker = true;
  }
  public render() {
    const {
      columns,
      timelineTitle,
      className,
      dataSource,
      cellHeight,
      autoSize,
      timelineWidth
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
              style={{width: timelineWidth, height: cellHeight, lineHeight: `${cellHeight}px`}}
            >
              {timelineTitle}
            </div>
            <div
              className={`${prefixCls}-header-col`}
              style={{width: this.maxWidth - timelineWidth, height: cellHeight}}
            >
              <div
                ref={this.header}
                className={`${prefixCls}-header-col-items`}
                style={{width: this.maxWidth - timelineWidth}}
                onScroll={this.handleFixedScroll}
              >
                <div style={{width: (tableWidth) - timelineWidth}}>
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
                <div className={cellCls} style={{width: timelineWidth, height: cellHeight / 2}}></div>
                {rows.map(v => {
                  return (
                    <div
                      key={v.key}
                      className={cellCls}
                      style={{width: timelineWidth, height: cellHeight, lineHeight: `${cellHeight}px`}}
                    >
                      {v.title}
                    </div>
                  );
                })}
                <div className={cellCls} style={{width: timelineWidth, height: cellHeight / 2}}></div>
              </div>
            </div>
            <Scrollbars
              ref={this.cell}
              onScroll={this.handleBodyScroll}
              autoHide
              style={{
                marginLeft: timelineWidth,
                float: 'left',
                width: this.maxWidth - timelineWidth,
                height: this.maxHeight
              }}
            >
              <div style={{width: tableWidth - timelineWidth}}>
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