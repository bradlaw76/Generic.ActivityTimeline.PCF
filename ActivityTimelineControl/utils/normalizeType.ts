import { ENTITY_DISPLAY_NAME_MAP } from "../constants";

export interface NormalizedTypeResult {
    normalizedType: string;
    displayName: string;
}

const KNOWN_ACTIVITY_TYPES: Record<string, string> = {
    phonecall: "phonecall",
    email: "email",
    appointment: "appointment",
    task: "task",
    note: "note",
    annotation: "note",
    sentiment_score: "sentiment_score"
};

const ACTIVITY_TYPE_CODE_MAP: Record<number, string> = {
    4202: "email",
    4201: "appointment",
    4210: "phonecall",
    4212: "task",
    4200: "note"
};

export function normalizeType(rawType: string | number, entityName?: string): NormalizedTypeResult {
    let normalizedType = "note";

    if (typeof rawType === "number") {
        normalizedType = ACTIVITY_TYPE_CODE_MAP[rawType] ?? normalizedType;
    } else {
        const lowered = rawType.toLowerCase();
        normalizedType = KNOWN_ACTIVITY_TYPES[lowered] ?? lowered;
    }

    if (entityName?.toLowerCase() === "annotation") {
        normalizedType = "note";
    }

    return {
        normalizedType,
        displayName: ENTITY_DISPLAY_NAME_MAP[normalizedType] ?? normalizedType
    };
}