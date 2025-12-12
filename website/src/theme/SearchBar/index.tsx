import { DocSearch } from '@docsearch/react';

import '@docsearch/css';

function App() {
  return (
    <DocSearch
      appId="0MLXBNIK0Q"
      apiKey="6484bd6c163502bacf229cb8d22024ab"
      indices={
        [
          {
            name: "configcat",
          }
        ]
      }
      resultsFooterComponent={({ state }) => {
        const query = state.query
        return (
          <div className="ds-footer">
            <a
              href={`/search?q=${encodeURIComponent(query)}`}
              className="ds-footer-link"
            >
              See all results
            </a>
          </div>
        );
      }}
    />
  );
}

export default App;
