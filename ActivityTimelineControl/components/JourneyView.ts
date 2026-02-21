import { ActivityNode } from "../models/ActivityNode";

export class JourneyView {
    private readonly element: HTMLDivElement;
    private activities: ActivityNode[] = [];

    constructor(_context: unknown) {
        this.element = document.createElement("div");
        this.element.className = "journey-view";
        this.render();
    }

    public update(_context: unknown): void {
        this.render();
    }

    public setActivities(activities: ActivityNode[]): void {
        this.activities = activities;
        this.render();
    }

    public getElement(): HTMLDivElement {
        return this.element;
    }

    private render(): void {
        this.element.innerHTML = "";

        if (this.activities.length === 0) {
            const empty = document.createElement("div");
            empty.className = "no-activities";
            empty.textContent = "No interactions found for this range";
            this.element.appendChild(empty);
            return;
        }

        const container = document.createElement("div");
        container.className = "journey-container";

        this.activities.forEach((activity) => {
            const node = document.createElement("div");
            node.className = "activity-node";

            const type = document.createElement("span");
            type.className = "activity-type";
            type.textContent = activity.displayName;

            const subject = document.createElement("span");
            subject.className = "activity-subject";
            subject.textContent = activity.title;

            const timestamp = document.createElement("span");
            timestamp.className = "activity-timestamp";
            timestamp.textContent = activity.date.toISOString();

            node.appendChild(type);
            node.appendChild(subject);
            node.appendChild(timestamp);
            container.appendChild(node);
        });

        this.element.appendChild(container);
    }
}