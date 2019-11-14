import * as React from 'react';
import '../style/index.css';
import 'antd/lib/input/style/css';
import { IDataSourceProps, IColumnProps, ISelectFuncProps } from '../externals';
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
    static displayName: string;
    state: {
        columns: {
            key: string;
            title: string;
        }[];
        inputValue: any;
        dataSource: any[];
        selectedIds: any[];
        scrollTop: number;
        scrollLeft: number;
    };
    readonly dataSource: {
        [x: string]: any;
    }[];
    handleSelectedMouseDown: (ev: any) => void;
    handleSearch: (value: any) => void;
    handleSearchChange: (ev: any) => void;
    handleSelect: (params: ISelectFuncProps) => void;
    handleScroll: () => void;
    handleSelectedDataDelete: (ev: React.MouseEvent<Element, MouseEvent>) => void;
    handlePopoverCancel: () => void;
    handlePopoverConfirm: (data: any) => void;
    handleSelectedDataFaCC: (data: any) => JSX.Element;
    render(): JSX.Element;
}
