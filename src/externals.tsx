export interface SchedulerProps {
  className?: string;
  dataSource?: IDataSourceProps[];
  startAt?: string;
  endAt?: string;
  timelineTitle?: string;
  timelineWidth?: number;
  timelineInterval?: number;
  timelineFormat?: string;
  columns?: IItemsType[];
  cellWidth?: number;
  cellHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  readonly?: boolean;
  autoSize?: boolean;
  onSelect?: (params: ISelectFuncProps) => void;
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
  selectedDataFaCC?: (selectedData: any) => React.ReactNode;
}

export interface SchedulerState {
  isScrollLeft: boolean;
  isScrollTop: boolean;
  rows?: IItemsType[];
}

export interface ISelectFuncProps {
  rowStart: string;
  rowEnd: string;
  col: IColumnProps;
}

export interface IColumnProps {
  key: string;
  title: string;
}

export interface IItemsType {
  key: string;
  disabled?: boolean;
  title: string | React.ReactNode;
}

export interface IDataSourceProps {
  colKey: string;
  rowStartKey: string;
  rowEndKey: string;
  content?: string;
  dataKey?: string;
  [propertyName: string]: any;
}