export interface ActivityNode {
    id: string;
    title: string;
    description: string;
    date: Date;
    rawType: string | number;
    entityName: string;
    normalizedType: string;
    displayName: string;
    source: "dataverse" | "demo";
    state: string;
    owner: string;
    sentimentScore?: number | null;
    sentimentChoiceValue?: number;
    sentimentChoiceLabel?: string;
    author?: string;
}