import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {
    componentDidMount() {
        if (window.docsearch) {
            window.docsearch({
                apiKey: '36b9ea4801b9b88e1e8fa2e42d3cc705',
                indexName: 'configcat',
                inputSelector: '#search-input', // the selector of my search input
            })
        }
    }

    render() {
        return (
            <div className="search">
                <input id="search-input" type="text" placeholder="Search" />
                <span className="icon">🔍</span>
            </div>
        );
    }

}

export default SearchBar;

