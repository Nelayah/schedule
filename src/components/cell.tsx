import * as R from 'ramda';
import * as React from 'react';
import * as moment from 'moment';
import connect from '../lib/connect';
import {SchedulerProps} from '../externals';

export interface IAppProps extends SchedulerProps {
  className?: string;
  index?: number;
  min?: number;
  max?: number;
  rows?: any;
  onMouseDown?: (ev: React.MouseEvent) => void;
  onMouseOver?: (ev: React.MouseEvent) => void;
}

export interface IAppState {
}

const format = v => moment(v).format('HH:mm');

@connect
export default class extends React.Component<IAppProps, IAppState> {
  static defaultProps = {
    index: 0,
    onMouseDown: null,
    onMouseOver: null
  };
  shouldComponentUpdate(nextProps) {
    // @ts-ignore
    const isDiff: any = R.complement(R.eqProps(R.__, nextProps, this.props));
    return ['cellWidth', 'cellHeight', 'className', 'min', 'max'].reduce((prev, key) => prev || isDiff(key), false);
  }
  public render() {
    const {
      className,
      index,
      cellWidth,
      cellHeight,
      onMouseDown,
      onMouseOver,
      rows,
      min,
      max
    } = this.props;
    return (
      <div
        data-index={index}
        className={className}
        style={{
          width: cellWidth,
          height: cellHeight,
          lineHeight: `${cellHeight}px`,
          color: 'white'
        }}
        onMouseDown={onMouseDown}
        onMouseOver={onMouseOver}
      >
        {R.complement(R.isNil)(rows) && min === index && `${format(rows[min].key)} - ${format(rows[max + 1].key)}`}
      </div>
    );
  }
}