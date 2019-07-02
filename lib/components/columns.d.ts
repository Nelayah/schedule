import * as React from 'react';
import { ScheduleProps } from '../externals';
export interface IAppProps extends ScheduleProps {
    rows: any[];
    cellCls: string;
    targetCol: any;
    dataSource?: any[];
}
export interface IAppState {
    isActive: boolean;
    selectedEndIndex: number;
    selectedStartIndex: number;
    selectedData: any[];
}
export default class extends React.Component<IAppProps, IAppState> {
    static defaultProps: {
        dataSource: any[];
    };
    state: {
        isActive: boolean;
        selectedStartIndex: number;
        selectedEndIndex: number;
        selectedData: any[];
    };
    tracks: number;
    componentDidMount(): void;
    componentWillReceiveProps(nextProps: IAppProps): void;
    shouldComponentUpdate(nextProps: IAppProps, nextState: IAppState): any;
    readonly selectedAreas: any[];
    handleSelectedBlocks: (v: any) => boolean;
    handleCalculateDisplay: (dataSource: any) => void;
    handleStartIndex: (ev: any) => void;
    handleEndIndex: (ev: any) => void;
    handleCellBlocksActive: () => void;
    handleCellBlocksInActive: () => void;
    getCellCls: (isSelected: any) => {
        [x: string]: any;
    };
    render(): JSX.Element;
}
