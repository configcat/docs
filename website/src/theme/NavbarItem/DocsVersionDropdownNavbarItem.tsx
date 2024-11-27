import React from 'react';
import DocsVersionDropdownNavbarItem from '@theme-original/NavbarItem/DocsVersionDropdownNavbarItem';
import type DocsVersionDropdownNavbarItemType from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';
import type { WrapperProps } from '@docusaurus/types';
import { useLocation } from '@docusaurus/router';

type Props = WrapperProps<typeof DocsVersionDropdownNavbarItemType>;

export default function DocsVersionDropdownNavbarItemWrapper(props: Props): JSX.Element {
  const location = useLocation();

  const unversionedRoutes = [
    // any route that starts with `/docs/api`
    /^\/docs\/api\/.*$/g,
    // If we want to disable it on the sdk reference too
    // /^\/docs\/sdk-reference\/.*$/g
  ]

  function checkPathname(pathname) {
    // Check if the provided pathname matches any of the regexes in the list
    return unversionedRoutes.some(regex => regex.test(pathname))
  }

  if (checkPathname(location.pathname)) {
    return null;
  }

  return <DocsVersionDropdownNavbarItem {...props} />;
}
