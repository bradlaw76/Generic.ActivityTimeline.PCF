export const ENTITY_DISPLAY_NAME_MAP: Record<string, string> = {
    phonecall: "Phone Call",
    email: "Email",
    appointment: "Appointment",
    task: "Task",
    note: "Note",
    annotation: "Note",
    sentiment_score: "Sentiment"
};

export const TYPE_ICON_MAP: Record<string, string> = {
    phonecall: "📞",
    email: "✉️",
    appointment: "📅",
    task: "✅",
    note: "📝",
    sentiment_score: "💬"
};

export const SENTIMENT_CHOICE_LABEL_MAP: Record<number, string> = {
    687940000: "Positive",
    687940001: "Neutral",
    687940002: "Negative"
};

export const SENTIMENT_CLASS_MAP: Record<string, string> = {
    Positive: "sentiment-positive",
    Neutral: "sentiment-neutral",
    Negative: "sentiment-negative",
    Unknown: "sentiment-neutral"
};