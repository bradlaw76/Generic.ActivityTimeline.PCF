export interface FilterState {
    activeTypes: string[];
    searchQuery: string;
    dateRangeDays: number;
    zoomLevel: number;
    showTimeLabels: boolean;
    activeTab: "journey" | "list";
    largeText: boolean;
}