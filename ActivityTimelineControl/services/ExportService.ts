// ExportService.ts

export class ExportService {
    /**
     * Exports the visible interactions to a CSV format.
     * @param interactions - The array of interactions to export.
     * @returns A string representing the CSV formatted data.
     */
    public static exportToCSV(interactions: any[]): string {
        const headers = ['Date', 'Type', 'Status', 'Owner', 'Subject', 'Description'];
        const rows = interactions.map(interaction => [
            interaction.timestamp,
            interaction.type,
            interaction.status,
            interaction.owner,
            interaction.subject,
            interaction.description
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        return csvContent;
    }

    /**
     * Triggers the download of the CSV file.
     * @param csvData - The CSV data to download.
     * @param filename - The name of the file to download.
     */
    public static downloadCSV(csvData: string, filename: string): void {
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}