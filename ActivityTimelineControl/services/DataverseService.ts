// ActivityTimelineControl/services/DataverseService.ts

export class DataverseService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = "/api/data/v9.2/";
    }

    public async fetchActivities(recordId: string): Promise<Activity[]> {
        const query = `${this.apiUrl}activitypointer?$filter=_regarding_object_id_value eq ${recordId}`;
        const response = await fetch(query, {
            method: "GET",
            headers: {
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8",
                "Prefer": "odata.include-annotations=*"
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching activities: ${response.statusText}`);
        }

        const data = await response.json();
        return data.value;
    }

    public async fetchSentimentScores(recordId: string): Promise<SentimentScore[]> {
        const query = `${this.apiUrl}phonecall?$filter=_regarding_object_id_value eq ${recordId}&$select=gensoft_sentimentscore,gensoft_transcriptsentimentchoice`;
        const response = await fetch(query, {
            method: "GET",
            headers: {
                "OData-MaxVersion": "4.0",
                "OData-Version": "4.0",
                "Accept": "application/json",
                "Content-Type": "application/json; charset=utf-8",
                "Prefer": "odata.include-annotations=*"
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching sentiment scores: ${response.statusText}`);
        }

        const data = await response.json();
        return data.value.map((item: any) => ({
            score: item.gensoft_sentimentscore,
            choiceLabel: this.getSentimentChoiceLabel(item.gensoft_transcriptsentimentchoice)
        }));
    }

    private getSentimentChoiceLabel(choice: number): string {
        switch (choice) {
            case 687940000:
                return "Positive";
            case 687940001:
                return "Neutral";
            case 687940002:
                return "Negative";
            default:
                return "Unknown";
        }
    }
}