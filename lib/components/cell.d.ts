import * as React from 'react';
import { SchedulerProps } from '../externals';
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
export default class extends React.Component<IAppProps, IAppState> {
    static defaultProps: {
        index: number;
        onMouseDown: any;
        onMouseOver: any;
    };
    shouldComponentUpdate(nextProps: any): any;
    render(): JSX.Element;
}
