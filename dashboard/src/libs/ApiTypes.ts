type ZoneInfoType = {
    id: number
    zone_id: string;
    name: string;
    total_slots: number;
    slots: boolean[];
    occupancy_rate: number;
    fare: number;
};


type PaginationInfoType = {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
};

type LogItem = {
  type: string;
  time: string; 
  slot: number;
  date: string;
  zone: string;
};

type LogsListProps = {
  logs?: LogItem[];
  hasMore?: boolean;
  setPaginationInfo?: ( info : PaginationInfoType ) => void;
  zone_id?: string;
};


export type { ZoneInfoType, PaginationInfoType, LogItem, LogsListProps };