import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

if (ExecutionEnvironment.canUseDOM) {
  const modifySearchPageLinks = () => {
    // 1. Target the <article> elements used on the /search page
    const articles = document.querySelectorAll('[class*="searchResultItem"]');

    articles.forEach((article) => {
      // 2. Target the <a> tag inside that article
      const link = article.querySelector('a');

      if (link && link.href) {
        try {
          const url = new URL(link.href);
          const origin = window.location.origin;

          // 3. Reconstruct the URL to use the current host (origin)
          link.href = `${origin}${url.pathname}${url.search}${url.hash}`;
        } catch (e) {
          // Skip if the URL is not valid
        }
      }
    });
  };

  const observer = new MutationObserver(modifySearchPageLinks);

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
