import * as React from 'react';
import { IAppProps } from './components/columns';
import { SchedulerProps, SchedulerState } from './externals';
export declare const prefixCls = "time-scheduler";
export declare const cellCls: string;
export declare const cellColumnsCls: string;
export declare const cellHeaderCls: any;
export default class extends React.Component<SchedulerProps, SchedulerState> {
    static displayName: string;
    static defaultProps: SchedulerProps;
    header: any;
    row: any;
    cell: any;
    timeProcessor?: any;
    height: number;
    width: number;
    cellWidth: number;
    maxWidth: number;
    maxHeight: number;
    scrollMarker: boolean;
    constructor(props: IAppProps);
    componentWillReceiveProps(nextProps: SchedulerProps): void;
    shouldComponentUpdate(nextProps: SchedulerProps, nextState: SchedulerState): any;
    handleBodyScroll: () => boolean;
    handleFixedScroll: () => boolean;
    render(): JSX.Element;
}
