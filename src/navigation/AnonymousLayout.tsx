import { UIView, useCurrentStateAndParams } from '@uirouter/react';

import { AppFooter } from './AppFooter';
import { CookiesConsent } from './cookies/CookiesConsent';
import { SiteHeader } from './header/SiteHeader';

export const AnonymousLayout = () => {
  const { state } = useCurrentStateAndParams();
  return (
    <>
      <CookiesConsent />
      <div className="app-wrap footer-indent">
        {!state.data.hideHeader && <SiteHeader />}
        <UIView className="app-content"></UIView>
      </div>
      <AppFooter />
    </>
  );
};
