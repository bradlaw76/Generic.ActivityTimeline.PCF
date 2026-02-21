// ActivityTimelineControl/services/DataverseService.ts

import { SENTIMENT_CHOICE_LABEL_MAP } from "../constants";
import { ActivityNode } from "../models/ActivityNode";
import { SentimentScore } from "../models/SentimentScore";
import { normalizeType } from "../utils/normalizeType";

export class DataverseService {
    private apiUrl: string;

    constructor() {
        this.apiUrl = "/api/data/v9.2/";
    }

    public async fetchActivities(recordId: string): Promise<ActivityNode[]> {
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
        return (data.value ?? []).map((item: any) => {
            const rawType = item.activitytypecode ?? item.activitytypecode_value ?? item.activitytype;
            const entityName = item.activitytypecode ?? item.activitytype;
            const normalized = normalizeType(rawType ?? "note", entityName);

            return {
                id: item.activityid ?? item.activitypointerid ?? "",
                title: item.subject ?? "(no subject)",
                description: item.description ?? "",
                date: new Date(item.scheduledend ?? item.modifiedon ?? item.createdon ?? Date.now()),
                rawType: rawType ?? "unknown",
                entityName: entityName ?? "activitypointer",
                normalizedType: normalized.normalizedType,
                displayName: normalized.displayName,
                source: "dataverse",
                state: item.statecode?.toString?.() ?? "",
                owner: item["_ownerid_value@OData.Community.Display.V1.FormattedValue"] ?? "",
                author: item.createdbyname
            } as ActivityNode;
        });
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
        return (data.value ?? []).map((item: any) => {
            const choiceValue = item.gensoft_transcriptsentimentchoice ?? -1;
            return {
                score: item.gensoft_sentimentscore ?? null,
                choiceValue,
                choiceLabel: this.getSentimentChoiceLabel(choiceValue)
            } as SentimentScore;
        });
    }

    private getSentimentChoiceLabel(choice: number): string {
        return SENTIMENT_CHOICE_LABEL_MAP[choice] ?? "Unknown";
    }
}