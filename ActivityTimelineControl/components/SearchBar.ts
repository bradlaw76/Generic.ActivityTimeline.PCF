// SearchBar.ts
// This file exports a class SearchBar that allows users to input search queries to filter interactions in real-time.

export class SearchBar {
    private readonly element: HTMLDivElement;
    private readonly searchInput: HTMLInputElement;
    private onSearch: (query: string) => void = () => {};

    constructor(_context: unknown) {
        this.element = document.createElement("div");
        this.element.className = "search-bar";
        this.searchInput = document.createElement("input");
        this.createSearchBar();
    }

    private createSearchBar(): void {
        this.searchInput.type = "text";
        this.searchInput.placeholder = "Search interactions...";
        this.searchInput.addEventListener("input", this.handleInput.bind(this));
        this.element.appendChild(this.searchInput);
    }

    private handleInput(event: Event): void {
        const query = (event.target as HTMLInputElement).value;
        this.onSearch(query);
    }

    public clear(): void {
        this.searchInput.value = '';
    }

    public update(_context: unknown): void {
    }

    public setOnSearch(onSearch: (query: string) => void): void {
        this.onSearch = onSearch;
    }

    public getElement(): HTMLDivElement {
        return this.element;
    }
}