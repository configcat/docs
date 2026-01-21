import React from 'react';
import { DocSearch } from '@docsearch/react';
import { useLocation } from '@docusaurus/router';
import '@docsearch/css';

export default function SearchBar() {
  const location = useLocation();

  const getCurrentDocsVersion = (): string => {
    if (location.pathname.startsWith('/docs/V1/')) {
      return 'V1';
    }
    return 'current';
  };

  const currentVersion = getCurrentDocsVersion();

  return (
    <DocSearch
      appId="0MLXBNIK0Q"
      apiKey="6484bd6c163502bacf229cb8d22024ab"
      indices={[
        {
          name: 'docs', // Same as indexName in docusaurus.config.ts
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

        return items.filter((item) => {
          const url = new URL(item.url);
          console.log(item.url)
          const isV1Item = url.pathname.startsWith('/docs/V1/');

          if (currentVersion === 'V1') {
            return isV1Item;
          } else {
            return !isV1Item;
          }
        })
          .map((item) => {
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
