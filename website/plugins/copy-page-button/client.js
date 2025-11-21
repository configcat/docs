import React from 'react';
import { createRoot } from 'react-dom/client';
import CopyPageButton from './CopyPageButton';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

// Only run in browser
if (ExecutionEnvironment.canUseDOM) {
  let root = null;
  let lastUrl = location.href;
  let recheckInterval = null;

  const getPluginOptions = () =>
    (typeof window !== 'undefined' && window.__COPY_PAGE_BUTTON_OPTIONS__) ||
    {};

  const cleanup = () => {
    const container = document.getElementById('copy-page-button-container');
    if (container) {
      if (root) {
        try {
          root.unmount();
        } catch (e) {}
        root = null;
      }
      container.remove();
    }
    if (recheckInterval) {
      clearInterval(recheckInterval);
      recheckInterval = null;
    }
  };

  // Inject button next to main <h1> in docs header (preserve scroll to prevent mobile jump)
  const injectNextToHeading = () => {
    const header = document.querySelector('.theme-doc-markdown header');
    if (!header) return;

    const h1 = header.querySelector('h1');
    if (!h1) return;

    // Avoid duplicates
    if (header.querySelector('#copy-page-button-container')) return;

    // Save current scroll position (works for mobile and desktop)
    const scrollX = window.scrollX || window.pageXOffset || 0;
    const scrollY = window.scrollY || window.pageYOffset || 0;

    // Remove old container (if present) to avoid duplicates
    cleanup();

    const container = document.createElement('div');
    container.id = 'copy-page-button-container';

    const pluginOptions = getPluginOptions();
    const customStyles = pluginOptions.customStyles || {};
    const containerStyles = customStyles.container?.style || {};
    Object.assign(container.style, containerStyles);

    // Insert after the <h1> using insertAdjacentElement to avoid affecting focus
    h1.insertAdjacentElement('afterend', container);

    // Render React root into container
    if (root) {
      try {
        root.unmount();
      } catch (e) {}
    }
    root = createRoot(container);

    root.render(
      React.createElement(CopyPageButton, {
        customStyles: pluginOptions.customStyles,
        enabledActions: pluginOptions.enabledActions,
      }),
    );
  };

  const initializeButton = () => {
    setTimeout(() => {
      injectNextToHeading();

      // Re-check in case of hydration delays
      let attempts = 0;
      const maxAttempts = 30;
      recheckInterval = setInterval(() => {
        attempts++;
        const hasButton = document.getElementById('copy-page-button-container');
        const h1 = document.querySelector('.theme-doc-markdown header h1');
        if (h1 && !hasButton) injectNextToHeading();
        if (attempts > maxAttempts || hasButton) {
          clearInterval(recheckInterval);
          recheckInterval = null;
        }
      }, 300);
    }, 150);
  };

  const handleRouteChange = () => {
    cleanup();
    // Delay slightly to let Docusaurus render the new heading, then inject
    setTimeout(() => {
      injectNextToHeading();
    }, 250);
  };

  // --- Bootstrapping ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeButton);
  } else {
    initializeButton();
  }

  // Handle SPA navigation
  window.addEventListener('popstate', handleRouteChange);
  if (typeof document !== 'undefined') {
    document.addEventListener('docusaurus-route-update', handleRouteChange);
  }

  // Detect pushState/replaceState
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  const checkUrlChange = () => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      handleRouteChange();
    }
  };

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    setTimeout(checkUrlChange, 0);
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    setTimeout(checkUrlChange, 0);
  };
}
