// SentimentIndicator.ts

import React from 'react';

interface SentimentIndicatorProps {
    score: number;
}

const SentimentIndicator: React.FC<SentimentIndicatorProps> = ({ score }) => {
    let sentimentClass = '';
    let sentimentLabel = '';

    if (score > 5) {
        sentimentClass = 'sentiment-positive';
        sentimentLabel = 'Positive';
    } else if (score < 5) {
        sentimentClass = 'sentiment-negative';
        sentimentLabel = 'Negative';
    } else {
        sentimentClass = 'sentiment-neutral';
        sentimentLabel = 'Neutral';
    }

    return (
        <div className={`sentiment-indicator ${sentimentClass}`}>
            <span>{sentimentLabel}</span>
            <span className="sentiment-score">{score}</span>
        </div>
    );
};

export default SentimentIndicator;