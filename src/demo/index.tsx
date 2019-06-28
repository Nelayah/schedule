import * as R from 'ramda';
import * as React from 'react';
import * as moment from 'moment';
import renderIf from 'render-if';
import Scheduler from '../';
import PopoverForm from './PopoverForm';
import '../style/index.css';
import 'antd/lib/input/style/css';
import {
  IDataSourceProps,
  IColumnProps,
  ISelectFuncProps
} from '../externals';
import {
  Icon,
  Input
} from 'antd';

const {Search} = Input;

export interface IAppProps {
}

export interface IAppState {
  columns: IColumnProps[];
  dataSource: IDataSourceProps[];
  selectedIds: string[];
  inputValue: string;
  scrollTop: number;
  scrollLeft: number;
}

export default class extends React.Component<IAppProps, IAppState> {
  static displayName = 'Demo';
  state = {
    columns: [{key: 'archer', title: 'Archer'}],
    inputValue: undefined,
    dataSource: [],
    selectedIds: [],
    scrollTop: 0,
    scrollLeft: 0
  };

  get dataSource() {
    const {
      selectedIds,
      dataSource
    } = this.state;
    return R.map(v => R.mergeDeepLeft({isSelected: selectedIds.includes(v['dataKey'])})(v))(dataSource);
  }
  handleSelectedMouseDown = ev => {
    ev.stopPropagation();
    ev.preventDefault();

    this.setState({selectedIds: [JSON.parse(ev.currentTarget.dataset.value).dataKey]});
  }
  handleSearch = value => {
    this.setState(({columns}) => ({
      inputValue: '',
      columns: columns.concat({key: value, title: value})
    }));
  }
  handleSearchChange = ev => {
    this.setState({inputValue: ev.target.value});
  }
  handleSelect: (params: ISelectFuncProps) => void = ({col, rowStart, rowEnd}) => {
    const dataKey = String(Date.now());
    this.setState(({dataSource}) => ({
      selectedIds: [dataKey],
      dataSource: dataSource.concat({
        colKey: col.key,
        rowStartKey: rowStart,
        rowEndKey: rowEnd,
        dataKey
      })
    }));
  }
  handleScroll = (scrollTop: number, scrollLeft: number) => {
    this.setState({
      selectedIds: [],
      scrollTop,
      scrollLeft
    });
  }
  handleSelectedDataDelete = (ev: React.MouseEvent) => {
    ev.stopPropagation();
    ev.preventDefault();
    const data = JSON.parse(ev.currentTarget['dataset'].value);
    this.setState(({dataSource}) => ({
      dataSource: R.reject(R.propEq('dataKey', data.dataKey))(dataSource)
    }));
  }
  handlePopoverCancel = () => {
    const {selectedIds} = this.state;
    if (selectedIds.length === 0) return;
    this.setState(() => ({selectedIds: []}));
  }
  handlePopoverConfirm = data => {
    const updateCollections: any = R.map(R.when(R.propEq('dataKey', data.dataKey), R.mergeDeepLeft(data)));
    this.setState({
      selectedIds: [],
      dataSource: updateCollections(this.state.dataSource)
    });
  }
  handleSelectedDataFaCC = data => {
    const showNewContent = renderIf(R.isEmpty(data.content) || R.isNil(data.content));
    const isInitialFunc = data => (k1, k2) => R.when(R.isNil, R.always(moment(`2000-01-01 ${data[k2]}`)))(data[k1]);
    const isInitial = isInitialFunc(data);

    data.startTime = isInitial('startTime', 'rowStartKey');
    data.endTime = isInitial('endTime', 'rowEndKey');
    return (
      <PopoverForm
        visible={this.state.selectedIds.includes(data.dataKey)}
        onOk={this.handlePopoverConfirm}
        onCancel={this.handlePopoverCancel}
        initialValue={data}
      >
        <div
          data-value={JSON.stringify(data)}
          onMouseDown={this.handleSelectedMouseDown}
          style={{padding: '5px', width: '100%', height: '100%'}}
        >
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>{data.rowStartKey} - {data.rowEndKey}</div>
            <div
              data-value={JSON.stringify(data)}
              onMouseDown={this.handleSelectedDataDelete}
              style={{paddingRight: 10}}
            >
              <Icon type="delete" theme="filled" />
            </div>
          </div>
          <div>{showNewContent('New Scheduler')}</div>
          <div>{data.content}</div>
        </div>
      </PopoverForm>
    );
  }
  public render() {
    console.log('demo', this.dataSource, this.state.selectedIds);
    return (
      <div style={{padding: 20}}>
        <div>ScrollTop: {this.state.scrollTop}px ScrollLeft: {this.state.scrollLeft}px</div>
        <div style={{lineHeight: '32px', width: 400, marginBottom: 10}}>
          Add a user:{' '}
          <Search
            placeholder="user name"
            value={this.state.inputValue}
            onChange={this.handleSearchChange}
            onSearch={this.handleSearch}
          />
        </div>
        <Scheduler
          timelineTitle="Time/Name"
          timelineWidth={120}
          startAt="08:00"
          endAt="22:00"
          cellWidth={200}
          maxWidth={850}
          maxHeight={600}
          // @ts-ignore
          dataSource={this.dataSource}
          columns={this.state.columns}
          onSelect={this.handleSelect}
          onScroll={this.handleScroll}
          selectedDataFaCC={this.handleSelectedDataFaCC}
        />
      </div>
    );
  }
}