/// <reference types="powerapps-component-framework" />

// ActivityTimelineControl/index.ts

import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { JourneyView } from "./components/JourneyView";
import { ListView } from "./components/ListView";
import { IntelligencePanel } from "./components/IntelligencePanel";
import { FilterControls } from "./components/FilterControls";
import { SearchBar } from "./components/SearchBar";

export class ActivityTimelineControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private container: HTMLDivElement;
    private journeyView!: JourneyView;
    private listView!: ListView;
    private intelligencePanel!: IntelligencePanel;
    private filterControls!: FilterControls;
    private searchBar!: SearchBar;

    constructor() {
        this.container = document.createElement("div");
    }

    public init(
        context: ComponentFramework.Context<IInputs>,
        _notifyOutputChanged: () => void,
        _state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this.journeyView = new JourneyView(context);
        this.listView = new ListView(context);
        this.intelligencePanel = new IntelligencePanel(context);
        this.filterControls = new FilterControls(context);
        this.searchBar = new SearchBar(context);

        this.container.appendChild(this.journeyView.getElement());
        this.container.appendChild(this.listView.getElement());
        this.container.appendChild(this.intelligencePanel.getElement());
        this.container.appendChild(this.filterControls.getElement());
        this.container.appendChild(this.searchBar.getElement());

        container.appendChild(this.container);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.journeyView.update(context);
        this.listView.update(context);
        this.intelligencePanel.update(context);
        this.filterControls.update(context);
        this.searchBar.update(context);
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        // Cleanup if necessary
    }
}