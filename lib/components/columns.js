var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as React from 'react';
import * as R from 'ramda';
import * as moment from 'moment';
import * as utils from '../lib/utils';
import renderIf from 'render-if';
import classnames from 'classnames';
import Blocks from './blocks';
import Cell from './cell';
import TimeProcessor from '../lib/TimeProcessor';
import connect from '../lib/connect';
import { prefixCls, cellColumnsCls } from '../index';
let default_1 = class default_1 extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isActive: false,
            selectedStartIndex: -100,
            selectedEndIndex: -100,
            selectedData: []
        };
        this.tracks = 1;
        // 判断是否超过显示区域开始时间或结束时间
        this.handleSelectedBlocks = v => {
            const { rows } = this.props;
            return !(rows[0].key > TimeProcessor.toTimestamp(v.rowStartKey) || rows[rows.length - 1].key < TimeProcessor.toTimestamp(v.rowEndKey));
        };
        // 计算时间段交叉重叠的情况
        this.handleCalculateDisplay = dataSource => {
            if (dataSource.length === 0)
                return this.setState({ selectedData: [] });
            const data = utils.preProcessing(dataSource);
            this.tracks = data.tracks + 1;
            data.times.forEach(v => {
                const minimum = utils.findTheMinimumGreater(v);
                v._minimum = minimum;
                if (minimum === utils.MAX_REF_NUMBER)
                    return v._proportion = this.tracks - v._track;
                v._proportion = minimum - v._track;
            });
            this.setState({ selectedData: data.times });
        };
        // 记录选择起点
        this.handleStartIndex = ev => {
            if (this.props.readonly)
                return;
            const selectedStartIndex = ev.target.dataset.index;
            this.setState({
                selectedStartIndex,
                selectedEndIndex: selectedStartIndex
            });
        };
        // 记录选择终点
        this.handleEndIndex = ev => {
            if (!this.state.isActive || this.props.readonly)
                return;
            this.setState({ selectedEndIndex: ev.target.dataset.index });
        };
        // 使当前区域激活状态
        this.handleCellBlocksActive = () => {
            if (this.props.readonly)
                return;
            this.setState({ isActive: true });
        };
        // 使当前区域处于非激活状态
        this.handleCellBlocksInActive = () => {
            const { onSelect, rows, targetCol, readonly } = this.props;
            const { selectedStartIndex, selectedEndIndex } = this.state;
            if (readonly)
                return;
            const min = Math.min(selectedStartIndex, selectedEndIndex);
            const max = Math.max(selectedStartIndex, selectedEndIndex) + 1;
            if (onSelect && min !== -100 && max !== -100) {
                onSelect({
                    rowStart: moment(rows[min].key).format('HH:mm'),
                    rowEnd: moment(rows[max].key).format('HH:mm'),
                    col: targetCol
                });
            }
            this.setState({
                isActive: false,
                selectedStartIndex: -100,
                selectedEndIndex: -100
            });
        };
        // 单元格类名
        this.getCellCls = isSelected => {
            const { readonly } = this.props;
            return ({
                [`${prefixCls}-forbidden`]: readonly,
                [`${prefixCls}-cell-data`]: !readonly,
                [`${prefixCls}-cell-active`]: isSelected
            });
        };
    }
    componentDidMount() {
        this.handleCalculateDisplay(this.props.dataSource);
    }
    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.dataSource) !== JSON.stringify(this.props.dataSource)) {
            this.handleCalculateDisplay(nextProps.dataSource);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        // @ts-ignore
        const isDiffState = R.complement(R.eqProps(R.__, nextState, this.state));
        // @ts-ignore
        const isDiffProps = R.complement(R.eqProps(R.__, nextProps, this.props));
        const shouldUpdateState = R.keys(this.state).reduce((prev, key) => prev || isDiffState(key), false);
        return JSON.stringify(nextProps.dataSource) !== JSON.stringify(this.props.dataSource) || isDiffProps('cellWidth') || shouldUpdateState;
    }
    // 过滤不在显示时区的数据
    get selectedAreas() {
        const { selectedData } = this.state;
        return selectedData.filter(this.handleSelectedBlocks);
    }
    render() {
        const { rows, cellCls, cellWidth, cellHeight, timelineInterval, readonly } = this.props;
        const { isActive, selectedEndIndex, selectedStartIndex } = this.state;
        const min = Math.min(selectedStartIndex, selectedEndIndex);
        const max = Math.max(selectedStartIndex, selectedEndIndex);
        const unit = Math.floor(cellWidth / this.tracks);
        const showOverlay = renderIf(!readonly);
        const cellClassName = i => classnames(cellCls, this.getCellCls(i >= min && i <= max && max * min >= 0));
        return (React.createElement("div", { className: classnames(cellColumnsCls, { [`${cellColumnsCls}-active`]: isActive }), onMouseDown: this.handleCellBlocksActive, onMouseUp: this.handleCellBlocksInActive, onMouseLeave: this.handleCellBlocksInActive, style: { width: cellWidth } },
            React.createElement("div", { className: `${cellColumnsCls}-background` },
                React.createElement(Cell, { className: cellCls }),
                rows.map((v, i) => {
                    return (React.createElement(Cell, { key: v.key, className: cellClassName(i) }));
                })),
            showOverlay(React.createElement("div", { className: `${prefixCls}-col-overlap` },
                React.createElement(Cell, { className: cellCls }),
                rows.map((v, i) => {
                    return (React.createElement(Cell, { key: v.key, index: i, rows: rows, min: min, max: max, className: cellClassName(i), onMouseDown: this.handleStartIndex, onMouseOver: this.handleEndIndex }));
                }))),
            this.selectedAreas.map(v => {
                const getDefaultKey = R.defaultTo(`${v.rowStartKey}_${v.rowEndKey}`);
                return (React.createElement(Blocks, { key: getDefaultKey(v.dataKey), data: v, top: TimeProcessor.calculateTimeLen(v.rowStartKey, rows[0].key, timelineInterval, cellHeight) + cellHeight + 1, height: TimeProcessor.calculateTimeLen(v.rowEndKey, v.rowStartKey, timelineInterval, cellHeight) - 2, unit: unit, forbidden: readonly }));
            })));
    }
};
default_1.defaultProps = {
    dataSource: []
};
default_1 = __decorate([
    connect
], default_1);
export default default_1;
