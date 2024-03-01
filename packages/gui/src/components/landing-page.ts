import m from 'mithril';
import { Icon } from 'mithril-materialized';
import background from '../assets/background.jpg';
import { MeiosisComponent } from '../services';
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
        m(
          '.overlay.center',
          {
            style: 'position: absolute; width: 100%',
          },
          [
            m('h3.indigo-text.text-darken-4.bold.hide-on-med-and-down', 'Introduction'),
            // m('h3.indigo-text.text-darken-4.bold.show-on-medium-and-down', 'PSP'),
            // m('.row', [
            //   m('.col.s12.m6', [
            //     m('.card white darken-2', [
            //       m('.card-content', [
            //         m('.card-title', 'Voor professionals:'),
            //         m(
            //           'p.left-align',
            //           m('ul', [
            //             m(
            //               'li',
            //               m(FlatButton, {
            //                 iconName: 'arrow_right',
            //                 label: 'Meld mij aan',
            //                 modalId: 'createAccount',
            //               })
            //             ),
            //             m(
            //               'li',
            //               m(FlatButton, {
            //                 iconName: 'arrow_right',
            //                 label: 'Bekijk bestaande contracten',
            //                 onclick: () => {
            //                   const id = uuid4();
            //                   routingSvc.switchTo(Dashboards.CONTRACTS, {
            //                     id,
            //                   });
            //                 },
            //               })
            //             ),
            //           ])
            //         ),
            //       ]),
            //     ]),
            //   ]),
            // ]),
          ]
        ),
        m('img.responsive-img.center', { src: background }),
        // m('.buttons.center', { style: 'margin: 10px auto;' }, []),
        m(
          '.section.white',
          m('.row.container.center', [
            m('.row', [
              m(
                '.col.s12.m4',
                m('.intro-block', [
                  m('.center', m(Icon, { iconName: 'handshake' })),
                  m('h5.center', 'TODO'),
                  m('p.light', 'TODO'),
                ])
              ),
              m(
                '.col.s12.m4',
                m('.intro-block', [
                  m('.center', m(Icon, { iconName: 'front_hand' })),
                  m('h5.center', 'TODO'),
                  m('p.light', `TODO`),
                ])
              ),
              m(
                '.col.s12.m4',
                m('.intro-block', [
                  m('.center', m(Icon, { iconName: 'map' })),
                  m('h5.center', 'TODO'),
                  m('p.light', 'TODO'),
                ])
              ),
            ]),
          ])
        ),
      ]),
    ],
  };
};
