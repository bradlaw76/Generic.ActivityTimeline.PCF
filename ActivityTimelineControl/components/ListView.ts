// ListView.ts
// This file exports a class ListView that renders the list view of the activity timeline, providing a vertical feed of interactions.

import { Activity } from "../models/Activity";
import { FilterState } from "../models/FilterState";

export class ListView {
    private activities: Activity[];
    private filterState: FilterState;

    constructor(activities: Activity[], filterState: FilterState) {
        this.activities = activities;
        this.filterState = filterState;
    }

    public render(): HTMLElement {
        const listContainer = document.createElement('div');
        listContainer.className = 'list-view';

        this.activities.forEach(activity => {
            if (this.shouldDisplayActivity(activity)) {
                const activityElement = this.createActivityElement(activity);
                listContainer.appendChild(activityElement);
            }
        });

        return listContainer;
    }

    private shouldDisplayActivity(activity: Activity): boolean {
        // Implement filtering logic based on this.filterState
        return true; // Placeholder for actual filtering logic
    }

    private createActivityElement(activity: Activity): HTMLElement {
        const activityElement = document.createElement('div');
        activityElement.className = 'activity-item';
        activityElement.innerHTML = `
            <div class="activity-type">${activity.type}</div>
            <div class="activity-subject">${activity.subject}</div>
            <div class="activity-timestamp">${activity.timestamp}</div>
        `;
        return activityElement;
    }
}