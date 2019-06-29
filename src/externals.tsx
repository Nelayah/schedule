export interface SchedulerProps {
  className?: string;
  dataSource?: IDataSourceProps[];
  startAt?: string;
  endAt?: string;
  timelineTitle?: string;
  timelineWidth?: number;
  timelineInterval?: number;
  timelineFormat?: string;
  columns?: IColumnProps[];
  cellWidth?: number;
  cellHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  readonly?: boolean;
  autoSize?: boolean;
  onSelect?: (params: ISelectFuncProps) => void;
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
  selectedDataFaCC?: (selectedData: IDataSourceProps) => React.ReactNode;
}

export interface SchedulerState {
  isScrollLeft: boolean;
  isScrollTop: boolean;
  rows?: IColumnProps[];
}

export interface IColumnProps {
  key: string;
  title: string | React.ReactNode;
  [propertyName: string]: any;
}

export interface IDataSourceProps {
  colKey: string;
  rowStartKey: string;
  rowEndKey: string;
  dataKey?: string;
  [propertyName: string]: any;
}

export interface ISelectFuncProps {
  rowStart: string;
  rowEnd: string;
  col: IColumnProps;
}