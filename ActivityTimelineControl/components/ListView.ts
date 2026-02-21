// ListView.ts
// This file exports a class ListView that renders the list view of the activity timeline, providing a vertical feed of interactions.

import { ActivityNode } from "../models/ActivityNode";
import { FilterState } from "../models/FilterState";

export class ListView {
    private readonly element: HTMLDivElement;
    private activities: ActivityNode[] = [];
    private filterState: FilterState = {
        activeTypes: [],
        searchQuery: "",
        dateRangeDays: 30,
        zoomLevel: 1,
        showTimeLabels: true,
        activeTab: "list",
        largeText: false
    };

    constructor(_context: unknown) {
        this.element = document.createElement("div");
        this.element.className = "list-view";
        this.render();
    }

    public update(_context: unknown): void {
        this.render();
    }

    public getElement(): HTMLDivElement {
        return this.element;
    }

    public setActivities(activities: ActivityNode[]): void {
        this.activities = activities;
        this.render();
    }

    public setFilterState(filterState: FilterState): void {
        this.filterState = filterState;
        this.render();
    }

    public render(): HTMLElement {
        this.element.innerHTML = "";

        this.activities.forEach((activity) => {
            if (this.shouldDisplayActivity(activity)) {
                const activityElement = this.createActivityElement(activity);
                this.element.appendChild(activityElement);
            }
        });

        return this.element;
    }

    private shouldDisplayActivity(activity: ActivityNode): boolean {
        const typeMatches = this.filterState.activeTypes.length === 0 ||
            this.filterState.activeTypes.includes(activity.normalizedType);

        const normalizedSearch = this.filterState.searchQuery.trim().toLowerCase();
        const searchMatches = normalizedSearch.length === 0 ||
            activity.title.toLowerCase().includes(normalizedSearch) ||
            activity.description.toLowerCase().includes(normalizedSearch);

        return typeMatches && searchMatches;
    }

    private createActivityElement(activity: ActivityNode): HTMLElement {
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item';
        activityElement.innerHTML = `
            <div class="activity-type">${activity.displayName}</div>
            <div class="activity-subject">${activity.title}</div>
            <div class="activity-timestamp">${activity.date.toISOString()}</div>
        `;
        return activityElement;
    }
}