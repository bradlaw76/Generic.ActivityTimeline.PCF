// FilterControls.ts
// This file exports a class FilterControls that provides UI elements for filtering interactions by type and search terms.

import React from 'react';

interface FilterControlsProps {
    activityTypes: string[];
    onFilterChange: (selectedTypes: string[], searchTerm: string) => void;
}

interface FilterControlsState {
    selectedTypes: string[];
    searchTerm: string;
}

export class FilterControls extends React.Component<FilterControlsProps, FilterControlsState> {
    constructor(props: FilterControlsProps) {
        super(props);
        this.state = {
            selectedTypes: [],
            searchTerm: ''
        };
    }

    handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        this.setState(prevState => {
            const selectedTypes = checked
                ? [...prevState.selectedTypes, value]
                : prevState.selectedTypes.filter(type => type !== value);
            this.props.onFilterChange(selectedTypes, this.state.searchTerm);
            return { selectedTypes };
        });
    };

    handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = event.target.value;
        this.setState({ searchTerm });
        this.props.onFilterChange(this.state.selectedTypes, searchTerm);
    };

    render() {
        return (
            <div className="filter-controls">
                <div className="filter-types">
                    {this.props.activityTypes.map(type => (
                        <label key={type}>
                            <input
                                type="checkbox"
                                value={type}
                                checked={this.state.selectedTypes.includes(type)}
                                onChange={this.handleTypeChange}
                            />
                            {type}
                        </label>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    value={this.state.searchTerm}
                    onChange={this.handleSearchChange}
                />
            </div>
        );
    }
}