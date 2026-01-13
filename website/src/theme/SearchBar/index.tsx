import React from 'react';
import { DocSearch } from '@docsearch/react';
import '@docsearch/css';

export default function SearchBar() {
  return (
    <DocSearch
      appId='0G4A1N5W4D'
      apiKey='6ef464aa13ff206475397b835c52b646'
      indices={[
        {
          name: 'docs', // Same as indexName in docusaurus.config.ts
        },
      ]}
      resultsFooterComponent={({state}) => {
          return (
            <a href={`/docs/search?q=${encodeURIComponent(state.query)}`}>
              See all results
            </a>
          );
        }}
    />
  );
};
