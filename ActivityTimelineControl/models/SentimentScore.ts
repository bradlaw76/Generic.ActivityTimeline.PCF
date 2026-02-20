// This file defines the structure of sentiment data, including numeric score and choice label.

export interface SentimentScore {
    score: number; // Numeric score representing sentiment
    choiceLabel: string; // Label indicating sentiment category (e.g., Positive, Neutral, Negative)
}