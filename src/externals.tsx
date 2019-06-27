export interface SchedulerProps {
  className?: string;
  dataSource?: DataSourceType[];
  startAt?: string;
  endAt?: string;
  timelineTitle?: string;
  timelineInterval?: number;
  timelineFormat?: string;
  columns?: ItemsType[];
  cellWidth?: number;
  cellHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  readonly?: boolean;
  autoSize?: boolean;
  onSelect?: (params: ISelect) => void;
  onScroll?: (scrollTop: number, scrollLeft: number) => void;
  selectedDataFaCC?: (selectedData: any) => React.ReactNode;
}

export interface ISelect {
  rowStart?: string;
  rowEnd?: string;
  col?: ColumnProps;
}

export interface ColumnProps {
  key: string;
  title: string;
}

export interface ItemsType {
  key: string;
  disabled?: boolean;
  title: string | React.ReactNode;
}

export interface DataSourceType {
  colKey: string;
  rowStartKey: string;
  rowEndKey: string;
  content: string;
  [propertyName: string]: any;
}

export interface SchedulerState {
  isScrollLeft: boolean;
  isScrollTop: boolean;
  rows?: ItemsType[];
}