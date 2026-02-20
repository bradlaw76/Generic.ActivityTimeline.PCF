// This file defines the current state of user-selected filters, including active activity types and search query.

export interface FilterState {
    activeActivityTypes: string[];
    searchQuery: string;
}