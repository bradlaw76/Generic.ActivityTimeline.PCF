// SentimentService.ts
// This file exports a class SentimentService that processes sentiment data and provides methods for sentiment analysis.

export class SentimentService {
    // Method to analyze sentiment scores
    public analyzeSentiment(sentimentScore: number): string {
        if (sentimentScore > 5) {
            return 'Positive';
        } else if (sentimentScore < 5) {
            return 'Negative';
        } else {
            return 'Neutral';
        }
    }

    // Method to get sentiment color based on score
    public getSentimentColor(sentimentScore: number): string {
        if (sentimentScore > 5) {
            return 'green'; // Positive
        } else if (sentimentScore < 5) {
            return 'red'; // Negative
        } else {
            return 'gray'; // Neutral
        }
    }
}