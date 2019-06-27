import * as React from 'react';
import { SchedulerProps } from '../externals';
export interface IAppProps extends SchedulerProps {
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
