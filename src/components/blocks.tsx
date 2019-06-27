import * as React from 'react';
import connect from '../lib/connect';
import {prefixCls} from '../index';
import {SchedulerProps} from '../externals';

export interface IAppProps extends SchedulerProps {
  data: any;
  unit: number;
  top: number;
  height: number;
  forbidden: boolean;
}

export interface IAppState {
}

@connect
export default class extends React.Component<IAppProps, IAppState> {
  shouldComponentUpdate(nextProps) {
    return JSON.stringify(nextProps.data) !== JSON.stringify(this.props.data) || nextProps.unit !== this.props.unit;
  }
  get style(): React.CSSProperties {
    const {
      data,
      forbidden,
      top,
      height,
      unit
    } = this.props;
    return ({
      position: 'absolute',
      top,
      left: data._track * unit + 1,
      width: data._proportion * unit - 2,
      height,
      cursor: !forbidden ? 'pointer' : 'not-allowed'
    });
  }
  public render() {
    const {
      data,
      selectedDataFaCC
    } = this.props;
    return (
      <div
        className={`${prefixCls}-arrangement`}
        style={this.style}
      >
        {selectedDataFaCC && selectedDataFaCC(data)}
      </div>
    );
  }
}