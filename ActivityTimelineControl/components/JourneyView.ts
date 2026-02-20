// JourneyView.ts

import { Component } from 'react';
import { Activity } from '../models/Activity';
import './JourneyView.css';

interface JourneyViewProps {
    activities: Activity[];
}

class JourneyView extends Component<JourneyViewProps> {
    render() {
        const { activities } = this.props;

        return (
            <div className="journey-view">
                {activities.length === 0 ? (
                    <div className="no-activities">No interactions found for this range</div>
                ) : (
                    <div className="journey-container">
                        {activities.map((activity, index) => (
                            <div key={index} className="activity-node">
                                <span className="activity-type">{activity.type}</span>
                                <span className="activity-subject">{activity.subject}</span>
                                <span className="activity-timestamp">{activity.timestamp}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }
}

export default JourneyView;