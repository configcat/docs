import React from 'react';
import { DocSearch } from '@docsearch/react';
import '@docsearch/css';

export default function SearchBar() {
  return (
    <DocSearch
      appId="0MLXBNIK0Q"
      apiKey="6484bd6c163502bacf229cb8d22024ab"
      indices={[
        {
          name: 'configcat', // Same as indexName in docusaurus.config.ts
        },
      ]}
      resultsFooterComponent={({ state }) => {
        return (
          <a href={`/docs/search?q=${encodeURIComponent(state.query)}`}>
            See all results
          </a>
        );
      }}
      transformItems={(items) => {
        const origin = window.location.origin;

        return items.map((item) => {
          const url = new URL(item.url);
          return {
            ...item,
            url: `${origin}${url.pathname}${url.search}${url.hash}`,
          };
        });
      }}
    />
  );
}
