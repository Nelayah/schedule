import * as React from 'react';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import 'antd/lib/popover/style/css';
import 'antd/lib/form/style/css';
import 'antd/lib/button/style/css';
import 'antd/lib/input/style/css';
import 'antd/lib/time-picker/style/css';
export interface IAppProps {
    form?: WrappedFormUtils;
    visible?: boolean;
    initialValue?: any;
    onOk?: (data?: any) => void;
    onCancel?: () => void;
}
export interface IAppState {
}
export default class extends React.Component<IAppProps, IAppState> {
    static defaultProps: {
        initialValue: {};
    };
    componentWillReceiveProps(nextProps: IAppProps): void;
    handleConfirm: () => void;
    handleDisabledStartTimeHours: () => number[];
    handleDisabledStartTimeMinutes: (selectedHour: any) => number[];
    handleDisabledEndTimeHours: () => number[];
    handleDisabledEndTimeMinutes: (selectedHour: any) => number[];
    handleTimeChange: (key: any, value: any) => void;
    handleStartTimeChange: (value: any) => void;
    handleEndTimeChange: (value: any) => void;
    readonly handleFormRender: JSX.Element;
    render(): JSX.Element;
}
