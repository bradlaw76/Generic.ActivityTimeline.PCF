# Generic Activity Timeline PCF Control

## Overview

The Generic Activity Timeline PCF Control is designed to provide a dual-view activity timeline for Dynamics 365 Model-Driven Apps. This control integrates seamlessly with the Dataverse platform, allowing users to visualize customer interactions in both a Journey view and a List view, complete with sentiment analysis and filtering capabilities.

## Features

- **Dual-View Display**: Users can switch between a horizontal Journey view and a vertical List view of activities.
- **Sentiment Analysis**: Visual indicators for sentiment scores associated with phone interactions.
- **Real-Time Filtering**: Users can filter interactions by type and search terms dynamically.
- **Intelligence Panel**: Displays detailed metadata for selected interactions, enhancing user insights.
- **CSV Export**: Allows users to export visible interactions to CSV format for reporting and analysis.

## Project Structure

The project is organized as follows:

```
Generic.ActivityTimeline.PCF
├── ActivityTimelineControl
│   ├── ControlManifest.Input.xml
│   ├── index.ts
│   ├── css
│   │   └── ActivityTimelineControl.css
│   ├── components
│   │   ├── JourneyView.ts
│   │   ├── ListView.ts
│   │   ├── IntelligencePanel.ts
│   │   ├── SentimentIndicator.ts
│   │   ├── FilterControls.ts
│   │   └── SearchBar.ts
│   ├── services
│   │   ├── DataverseService.ts
│   │   ├── SentimentService.ts
│   │   └── ExportService.ts
│   ├── models
│   │   ├── Activity.ts
│   │   ├── SentimentScore.ts
│   │   └── FilterState.ts
│   └── utils
│       ├── DateUtils.ts
│       ├── Sanitizer.ts
│       └── GccDetector.ts
├── .gitignore
├── package.json
├── tsconfig.json
├── pcfconfig.json
├── featureconfig.json
└── README.md
```

## Setup Instructions

1. **Clone the Repository**: 
   ```
   git clone <repository-url>
   cd Generic.ActivityTimeline.PCF
   ```

2. **Install Dependencies**: 
   ```
   npm install
   ```

3. **Build the Project**: 
   ```
   npm run build
   ```

4. **Deploy the Control**: Follow the deployment instructions specific to your Dynamics 365 environment.

## Usage

To use the Generic Activity Timeline PCF Control in your Dynamics 365 application, add it to your form or dashboard as a custom control. Configure the properties as needed to tailor the control to your specific requirements.

## Contribution Guidelines

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your branch and create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- Thanks to the Dynamics 365 community for their support and contributions.
- Special thanks to the developers and designers who contributed to the creation of this control.