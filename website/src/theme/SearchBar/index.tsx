import React from 'react';
import { DocSearch, DocSearchProps } from '@docsearch/react';
import '@docsearch/css';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function SearchBar() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <DocSearch
      {...(siteConfig.themeConfig.algolia as DocSearchProps)}
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
