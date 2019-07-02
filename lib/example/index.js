import * as R from 'ramda';
import * as React from 'react';
import moment from '../lib/moment-es6';
import renderIf from 'render-if';
import Schedule from '../';
import PopoverForm from './PopoverForm';
import '../style/index.css';
import 'antd/lib/input/style/css';
import { Icon, Input } from 'antd';
const { Search } = Input;
export default class default_1 extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            columns: [{ key: 'family', title: 'Family Schedule' }],
            inputValue: undefined,
            dataSource: [],
            selectedIds: [],
            scrollTop: 0,
            scrollLeft: 0
        };
        this.handleSelectedMouseDown = ev => {
            ev.stopPropagation();
            ev.preventDefault();
            this.setState({ selectedIds: [JSON.parse(ev.currentTarget.dataset.value).dataKey] });
        };
        this.handleSearch = value => {
            this.setState(({ columns }) => ({
                inputValue: '',
                columns: columns.concat({ key: value, title: value })
            }));
        };
        this.handleSearchChange = ev => {
            this.setState({ inputValue: ev.target.value });
        };
        this.handleSelect = ({ col, rowStart, rowEnd }) => {
            const dataKey = String(Date.now());
            this.setState(({ dataSource }) => ({
                selectedIds: [dataKey],
                dataSource: dataSource.concat({
                    colKey: col.key,
                    rowStartKey: rowStart,
                    rowEndKey: rowEnd,
                    dataKey
                })
            }));
        };
        this.handleScroll = () => {
            if (this.state.selectedIds.length === 0)
                return;
            this.setState({
                selectedIds: []
            });
        };
        this.handleSelectedDataDelete = (ev) => {
            ev.stopPropagation();
            ev.preventDefault();
            const data = JSON.parse(ev.currentTarget['dataset'].value);
            this.setState(({ dataSource }) => ({
                dataSource: R.reject(R.propEq('dataKey', data.dataKey))(dataSource)
            }));
        };
        this.handlePopoverCancel = () => {
            const { selectedIds } = this.state;
            if (selectedIds.length === 0)
                return;
            this.setState(() => ({ selectedIds: [] }));
        };
        this.handlePopoverConfirm = data => {
            const updateCollections = R.map(R.when(R.propEq('dataKey', data.dataKey), R.mergeDeepLeft(data)));
            this.setState({
                selectedIds: [],
                dataSource: updateCollections(this.state.dataSource)
            });
        };
        this.handleSelectedDataFaCC = data => {
            const showNewContent = renderIf(R.isEmpty(data.content) || R.isNil(data.content));
            const isInitialFunc = data => (k1, k2) => R.when(R.isNil, R.always(moment(`2000-01-01 ${data[k2]}`)))(data[k1]);
            const isInitial = isInitialFunc(data);
            data.startTime = isInitial('startTime', 'rowStartKey');
            data.endTime = isInitial('endTime', 'rowEndKey');
            return (React.createElement(PopoverForm, { visible: this.state.selectedIds.includes(data.dataKey), onOk: this.handlePopoverConfirm, onCancel: this.handlePopoverCancel, initialValue: data },
                React.createElement("div", { "data-value": JSON.stringify(data), onMouseDown: this.handleSelectedMouseDown, style: { padding: '5px', width: '100%', height: '100%' } },
                    React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between' } },
                        React.createElement("div", null,
                            data.rowStartKey,
                            " - ",
                            data.rowEndKey),
                        React.createElement("div", { "data-value": JSON.stringify(data), onMouseDown: this.handleSelectedDataDelete, style: { paddingRight: 10 } },
                            React.createElement(Icon, { type: "delete", theme: "filled" }))),
                    React.createElement("div", null, showNewContent('New Schedule')),
                    React.createElement("div", null, data.content))));
        };
    }
    get dataSource() {
        const { selectedIds, dataSource } = this.state;
        return R.map(v => R.mergeDeepLeft({ isSelected: selectedIds.includes(v['dataKey']) })(v))(dataSource);
    }
    render() {
        return (React.createElement("div", { style: { padding: 20, width: '100%' } },
            React.createElement("div", { style: { lineHeight: '32px', width: 400, marginBottom: 10 } },
                "Add a user:",
                ' ',
                React.createElement(Search, { placeholder: "user name", value: this.state.inputValue, onChange: this.handleSearchChange, onSearch: this.handleSearch })),
            React.createElement(Schedule, { timelineTitle: "Time/Name", timelineWidth: 120, startAt: "08:00", endAt: "22:00", cellWidth: 200, maxWidth: 850, maxHeight: 600, autoSize: true, 
                // @ts-ignore
                dataSource: this.dataSource, columns: this.state.columns, onSelect: this.handleSelect, onScroll: this.handleScroll, selectedDataFaCC: this.handleSelectedDataFaCC })));
    }
}
default_1.displayName = 'Demo';
