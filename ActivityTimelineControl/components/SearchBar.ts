// SearchBar.ts
// This file exports a class SearchBar that allows users to input search queries to filter interactions in real-time.

export class SearchBar {
    private searchInput: HTMLInputElement;
    private onSearch: (query: string) => void;

    constructor(onSearch: (query: string) => void) {
        this.onSearch = onSearch;
        this.createSearchBar();
    }

    private createSearchBar(): void {
        this.searchInput = document.createElement('input');
        this.searchInput.type = 'text';
        this.searchInput.placeholder = 'Search interactions...';
        this.searchInput.addEventListener('input', this.handleInput.bind(this));
        document.body.appendChild(this.searchInput); // Adjust as necessary for your layout
    }

    private handleInput(event: Event): void {
        const query = (event.target as HTMLInputElement).value;
        this.onSearch(query);
    }

    public clear(): void {
        this.searchInput.value = '';
    }
}