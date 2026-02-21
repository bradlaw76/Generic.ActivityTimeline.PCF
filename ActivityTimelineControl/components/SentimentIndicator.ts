// SentimentIndicator.ts

export interface SentimentIndicatorViewModel {
    sentimentClass: "sentiment-positive" | "sentiment-neutral" | "sentiment-negative";
    sentimentLabel: "Positive" | "Neutral" | "Negative";
    score: number;
}

export function getSentimentIndicator(score: number): SentimentIndicatorViewModel {
    if (score > 5) {
        return {
            sentimentClass: "sentiment-positive",
            sentimentLabel: "Positive",
            score
        };
    }

    if (score < 5) {
        return {
            sentimentClass: "sentiment-negative",
            sentimentLabel: "Negative",
            score
        };
    }

    return {
        sentimentClass: "sentiment-neutral",
        sentimentLabel: "Neutral",
        score
    };
}