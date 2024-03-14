import m from 'mithril';
import { Icon } from 'mithril-materialized';
import background from '../assets/background.jpg';
import { MeiosisComponent, t } from '../services';
import { Pages } from '../models';

export const LandingPage: MeiosisComponent = () => {
  return {
    oninit: ({
      attrs: {
        actions: { setPage },
      },
    }) => {
      setPage(Pages.LANDING);
    },
    view: ({
      attrs: {
        // state: { account },
        // actions: { updateAccount, updateClientAccount },
      },
    }) => [
      m('div', { style: 'position: relative;' }, [
        m('.overlay.center', [
          m('h3.indigo-text.text-darken-4.bold.hide-on-med-and-down', 'Traffic Simulator'),
          m('img.responsive-img.center', { src: background }),
          m('p', t('INTRO')),
        ]),
        // m('.buttons.center', { style: 'margin: 10px auto;' }, []),
        // m(
        //   '.section.white',
        //   m('.row.container.center', [
        //     m('.row', [
        //       m(
        //         '.col.s12.m4',
        //         m('.intro-block', [
        //           m('.center', m(Icon, { iconName: 'handshake' })),
        //           m('h5.center', 'TODO'),
        //           m('p.light', 'TODO'),
        //         ])
        //       ),
        //       m(
        //         '.col.s12.m4',
        //         m('.intro-block', [
        //           m('.center', m(Icon, { iconName: 'front_hand' })),
        //           m('h5.center', 'TODO'),
        //           m('p.light', `TODO`),
        //         ])
        //       ),
        //       m(
        //         '.col.s12.m4',
        //         m('.intro-block', [
        //           m('.center', m(Icon, { iconName: 'map' })),
        //           m('h5.center', 'TODO'),
        //           m('p.light', 'TODO'),
        //         ])
        //       ),
        //     ]),
        //   ])
        // ),
      ]),
    ],
  };
};
