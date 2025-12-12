import React from 'react';
import { DocSearch } from '@docsearch/react';
import '@docsearch/css';

export default function SearchBar() {
  return (
    <DocSearch
      appId='0MLXBNIK0Q'
      apiKey='6484bd6c163502bacf229cb8d22024ab'
      indices={[
        {
          name: 'configcat',
        },
      ]}
      resultsFooterComponent={({state}) => {
          return (
            <div className="DocSearch-HitsFooter">
              <a href={`/docs/search?q=${encodeURIComponent(state.query)}`}>
                See all results
              </a>
            </div>
          );
        }}
    />
  );
};
