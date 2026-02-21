// IntelligencePanel.ts
// This file exports a class IntelligencePanel that displays detailed metadata for selected interactions, including owner, state, and description.

export class IntelligencePanel {
    private readonly element: HTMLDivElement;
    private owner: string = "-";
    private state: string = "-";
    private description: string = "";

    constructor(_context: unknown) {
        this.element = document.createElement("div");
        this.element.className = "intelligence-panel";
        this.render();
    }

    public update(_context: unknown): void {
        this.render();
    }

    public getElement(): HTMLDivElement {
        return this.element;
    }

    public setDetails(owner: string, state: string, description: string): void {
        this.owner = owner;
        this.state = state;
        this.description = description;
        this.render();
    }

    public render(): HTMLElement {
        this.element.innerHTML = `
            <h3>Interaction Details</h3>
            <p><strong>Owner:</strong> ${this.owner}</p>
            <p><strong>State:</strong> ${this.state}</p>
            <p><strong>Description:</strong> ${this.description}</p>
        `;
        return this.element;
    }
}