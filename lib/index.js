import * as React from 'react';
import * as R from 'ramda';
import TimeProcessor from './lib/TimeProcessor';
import { Scrollbars } from 'react-custom-scrollbars';
import classnames from 'classnames';
import Columns from './components/columns';
import Provider from './components/provider';
export const prefixCls = 'time-schedule';
export const cellCls = `${prefixCls}-cell`;
export const cellColumnsCls = `${prefixCls}-col`;
export const cellHeaderCls = classnames(cellCls, `${prefixCls}-header-cell`);
export default class default_1 extends React.Component {
    constructor(props) {
        super(props);
        this.header = React.createRef();
        this.row = React.createRef();
        this.cell = React.createRef();
        this.height = 0;
        this.width = 0;
        this.cellWidth = 0;
        this.maxWidth = 0;
        this.maxHeight = 0;
        this.scrollMarker = false;
        // 数据行列滚动
        this.handleBodyScroll = () => {
            const { onScroll } = this.props;
            if (this.scrollMarker)
                return this.scrollMarker = false;
            this.row.current.scrollTop = this.cell.current.view.scrollTop;
            this.header.current.scrollLeft = this.cell.current.view.scrollLeft;
            onScroll && onScroll(this.cell.current.view.scrollTop, this.cell.current.view.scrollLeft);
            this.scrollMarker = true;
        };
        // 固定行列滚动
        this.handleFixedScroll = () => {
            const { onScroll } = this.props;
            if (this.scrollMarker)
                return this.scrollMarker = false;
            this.cell.current.view.scrollTop = this.row.current.scrollTop;
            this.cell.current.view.scrollLeft = this.header.current.scrollLeft;
            onScroll && onScroll(this.row.current.scrollTop, this.header.current.scrollLeft);
            this.scrollMarker = true;
        };
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
    componentWillReceiveProps(nextProps) {
        let rows = this.state.rows;
        // @ts-ignore
        const isDiff = R.complement(R.eqProps(R.__, nextProps, this.props));
        // 监听 columns、maxWidth 和 cellWidth 变化
        if (nextProps.columns.length !== this.props.columns.length || isDiff('cellWidth') || isDiff('maxWidth') || isDiff('autoSize') || isDiff('timelineWidth')) {
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
    shouldComponentUpdate(nextProps, nextState) {
        // @ts-ignore
        const isDiffState = R.complement(R.eqProps(R.__, nextState, this.state));
        const isDiffPropsJSON = key => JSON.stringify(nextProps[key]) !== JSON.stringify(this.props[key]);
        const getColumnsKeyString = obj => JSON.stringify(R.pluck('key')(obj.columns));
        const shouldUpdateState = R.keys(this.state).reduce((prev, key) => prev || isDiffState(key), false);
        return isDiffPropsJSON('dataSource') || getColumnsKeyString(nextProps) !== getColumnsKeyString(this.props) || shouldUpdateState;
    }
    render() {
        const { columns, timelineTitle, className, dataSource, cellHeight, autoSize, timelineWidth } = this.props;
        const { rows } = this.state;
        const tableWidth = autoSize ? Math.max(this.maxWidth, this.width) : this.width;
        return (React.createElement(Provider, Object.assign({}, this.props, { cellWidth: this.cellWidth }),
            React.createElement("div", { className: classnames(prefixCls, className), style: { maxWidth: this.maxWidth } },
                React.createElement("div", { className: `${prefixCls}-header`, style: { width: tableWidth } },
                    React.createElement("div", { className: classnames(cellHeaderCls, `${prefixCls}-timeline-title`), style: { width: timelineWidth, height: cellHeight, lineHeight: `${cellHeight}px` } }, timelineTitle),
                    React.createElement("div", { className: `${prefixCls}-header-col`, style: { width: this.maxWidth - timelineWidth, height: cellHeight } },
                        React.createElement("div", { ref: this.header, className: `${prefixCls}-header-col-items`, style: { width: this.maxWidth - timelineWidth }, onScroll: this.handleFixedScroll },
                            React.createElement("div", { style: { width: (tableWidth) - timelineWidth } }, columns.map(v => {
                                return (React.createElement("div", { key: v.key, className: cellHeaderCls, style: { width: this.cellWidth, height: cellHeight, lineHeight: `${cellHeight}px` } }, v.title));
                            }))))),
                React.createElement("div", { className: `${prefixCls}-body`, style: { height: this.maxHeight, width: tableWidth } },
                    React.createElement("div", { className: classnames(cellColumnsCls, `${prefixCls}-col-fixed`) },
                        React.createElement("div", { ref: this.row, className: `${prefixCls}-col-fixed-container`, 
                            // 隐藏 多余的滚动条
                            style: { height: this.maxHeight, width: this.maxWidth + 20 }, onScroll: this.handleFixedScroll },
                            React.createElement("div", { className: cellCls, style: { width: timelineWidth, height: cellHeight / 2 } }),
                            rows.map(v => {
                                return (React.createElement("div", { key: v.key, className: cellCls, style: { width: timelineWidth, height: cellHeight, lineHeight: `${cellHeight}px` } }, v.title));
                            }),
                            React.createElement("div", { className: cellCls, style: { width: timelineWidth, height: cellHeight / 2 } }))),
                    React.createElement(Scrollbars, { ref: this.cell, onScroll: this.handleBodyScroll, autoHide: true, style: {
                            marginLeft: timelineWidth,
                            float: 'left',
                            width: this.maxWidth - timelineWidth,
                            height: this.maxHeight
                        } },
                        React.createElement("div", { style: { width: tableWidth - timelineWidth } }, columns.map(v => {
                            return (React.createElement(Columns, { key: v.key, targetCol: v, rows: rows, cellCls: cellCls, dataSource: dataSource.filter(x => x.colKey === v.key) }));
                        })))))));
    }
}
default_1.displayName = 'Time-schedule';
default_1.defaultProps = {
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
