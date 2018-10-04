import React from 'react';

import { DonateAndSubscribe, Linkset, LogoBox, SocialsAndLegal } from './components';
import './NewFooter.scss';

const HorizontalRule = () => (
  <section className="HorizontalRule">
    <section className="HorizontalRule-line" />
  </section>
);

const VerticalRule = () => (
  <section className="VerticalRule">
    <section className="VerticalRule-line" />
  </section>
);

const MobileFooter = () => (
  <section className="mobile-only">
    <section className="NewFooter">
      <LogoBox />
      <HorizontalRule />
      <DonateAndSubscribe />
      <HorizontalRule />
      <Linkset />
      <SocialsAndLegal />
    </section>
  </section>
);

const TabletFooter = () => (
  <section className="tablet-only">
    <section className="NewFooter">
      <LogoBox />
      <VerticalRule />
      <section style={{ display: 'flex', flexDirection: 'column', flex: 5 }}>
        <Linkset />
        <DonateAndSubscribe />
      </section>
    </section>
  </section>
);

const DesktopFooter = () => (
  <section className="desktop-only">
    <section className="NewFooter">
      <p style={{ color: 'white' }}>Logo</p>
      <p style={{ color: 'white' }}>Legal</p>
      <VerticalRule />
      <p style={{ color: 'white' }}>Linkset</p>
      <VerticalRule />
      <p style={{ color: 'white' }}>Donate / Subscribe</p>
    </section>
  </section>
);

export default function NewFooter() {
  return (
    <React.Fragment>
      <MobileFooter />
      <TabletFooter />
      <DesktopFooter />
    </React.Fragment>
  );
}

// export default function NewFooter() {
//   return (
//     <section className="NewFooter">
//       <LogoBox />
//       <HorizontalRule />
//       <VerticalRule />
//       <section className="desktop-only">
//         <Linkset />
//       </section>
//       <section className="tablet-only">
//         <Linkset />
//         <DonateAndSubscribe />
//       </section>
//       <section className="mobile-only">
//         <DonateAndSubscribe />
//       </section>
//       <HorizontalRule />
//       <section className="desktop-only">
//         <VerticalRule />
//       </section>
//       <section className="desktop-only">
//         <DonateAndSubscribe />
//       </section>
//       <section className="mobile-only">
//         <Linkset />
//       </section>
//       <section className="NewFooter-socials-legal">
//         <SocialsAndLegal />
//       </section>
//     </section>
//   );
// }
