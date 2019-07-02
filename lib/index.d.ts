import * as React from 'react';
import { IAppProps } from './components/columns';
import { ScheduleProps, ScheduleState } from './externals';
export declare const prefixCls = "time-schedule";
export declare const cellCls: string;
export declare const cellColumnsCls: string;
export declare const cellHeaderCls: any;
export default class extends React.Component<ScheduleProps, ScheduleState> {
    static displayName: string;
    static defaultProps: ScheduleProps;
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
    componentWillReceiveProps(nextProps: ScheduleProps): void;
    shouldComponentUpdate(nextProps: ScheduleProps, nextState: ScheduleState): any;
    handleBodyScroll: () => boolean;
    handleFixedScroll: () => boolean;
    render(): JSX.Element;
}
