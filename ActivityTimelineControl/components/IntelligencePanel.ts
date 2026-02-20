// IntelligencePanel.ts
// This file exports a class IntelligencePanel that displays detailed metadata for selected interactions, including owner, state, and description.

export class IntelligencePanel {
    private owner: string;
    private state: string;
    private description: string;

    constructor(owner: string, state: string, description: string) {
        this.owner = owner;
        this.state = state;
        this.description = description;
    }

    public render(): string {
        return `
            <div class="intelligence-panel">
                <h3>Interaction Details</h3>
                <p><strong>Owner:</strong> ${this.owner}</p>
                <p><strong>State:</strong> ${this.state}</p>
                <p><strong>Description:</strong> ${this.description}</p>
            </div>
        `;
    }
}