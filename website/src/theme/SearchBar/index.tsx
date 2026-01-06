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
          const currentPath = window.location.pathname;

          const isDocsResult = url.pathname.startsWith('/docs');
          const isBlogResult = url.pathname.startsWith('/blog');

          const onDocsSite = currentPath.startsWith('/docs');
          const onBlogSite = currentPath.startsWith('/blog');

          // Only rewrite if the item belongs to current site
          if ((isDocsResult && onDocsSite) || (isBlogResult && onBlogSite)) {
            return {
              ...item,
              url: `${origin}${url.pathname}${url.search}${url.hash}`,
            };
          }
          return item;
        });
      }}
    />
  );
}
