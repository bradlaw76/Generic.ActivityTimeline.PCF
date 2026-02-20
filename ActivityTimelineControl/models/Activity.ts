export interface Activity {
    type: string; // The type of the activity (e.g., email, phone call, task)
    subject: string; // The subject of the activity
    description: string; // A detailed description of the activity
    timestamp: Date; // The date and time when the activity occurred
    owner: string; // The owner of the activity (user or team)
    state: string; // The current state of the activity (e.g., completed, in progress)
}