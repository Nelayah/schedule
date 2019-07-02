import * as React from 'react';
import { ScheduleProps } from '../externals';
export interface IAppProps extends ScheduleProps {
    data: any;
    unit: number;
    top: number;
    height: number;
    forbidden: boolean;
}
export interface IAppState {
}
export default class extends React.Component<IAppProps, IAppState> {
    shouldComponentUpdate(nextProps: any): boolean;
    readonly style: React.CSSProperties;
    render(): JSX.Element;
}
