type ZoneInfoType = {
    id: number
    zone_id: string;
    name: string;
    total_slots: number;
    slots: boolean[];
    occupancy_rate: number;
    fare: number;
};


export type { ZoneInfoType };