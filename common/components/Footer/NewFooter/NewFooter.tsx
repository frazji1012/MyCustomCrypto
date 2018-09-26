import React from 'react';

import logo from 'assets/images/logo-mycrypto.svg';
import ThemeToggle from 'components/Footer/ThemeToggle';
import './NewFooter.scss';

export default function NewFooter() {
  return (
    <section className="NewFooter">
      <section className="NewFooter-logo-container">
        <section className="NewFooter-logo-container-image">
          <img src={logo} alt="Logo" />
        </section>
        <section className="NewFooter-logo-container-text">
          MyCrypto is an open-source, client-side tool for generating ether wallets, handling ERC-20
          tokens, and interacting with the blockchain more easily. Developed by and for the
          community since 2015, we’re focused on building awesome products that put the power in
          people’s hands.
        </section>
        <section className="NewFooter-logo-container-toggle">
          <ThemeToggle />
        </section>
      </section>
      <section className="NewFooter-actions-container">Actions</section>
      <section className="NewFooter-links-container">Links</section>
    </section>
  );
}
