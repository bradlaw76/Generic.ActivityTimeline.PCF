// FilterControls.ts

export class FilterControls {
    private readonly element: HTMLDivElement;

    constructor(_context: unknown) {
        this.element = document.createElement("div");
        this.element.className = "filter-controls";
        this.render();
    }

    public update(_context: unknown): void {
    }

    public getElement(): HTMLDivElement {
        return this.element;
    }

    private render(): void {
        this.element.innerHTML = "";

        const filterTypes = document.createElement("div");
        filterTypes.className = "filter-types";

        const search = document.createElement("input");
        search.type = "text";
        search.placeholder = "Search...";

        this.element.appendChild(filterTypes);
        this.element.appendChild(search);
    }
}