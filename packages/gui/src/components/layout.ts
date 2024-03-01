import m from 'mithril';
import { Icon } from 'mithril-materialized';
import logo from '../assets/logo.svg';
import { Pages, Page } from '../models';
import { routingSvc } from '../services/routing-service';
import { APP_TITLE, MeiosisComponent } from '../services';
import { SideNav, SideNavTrigger } from './ui/sidenav';

export const Layout: MeiosisComponent = () => {
  const style = 'font-size: 2.2rem; width: 4rem;';

  return {
    view: ({ children, attrs: { state, actions } }) => {
      const { page } = state;
      const { changePage } = actions;
      const curPage = routingSvc
        .getList()
        .filter((p) => p.id === page)
        .shift();
      const isActive = (d: Page) => (page === d.id ? 'active' : undefined);

      return [
        m('.main', { style: 'overflow-x: hidden' }, [
          m(
            '.navbar-fixed',
            { style: 'z-index: 1001' },
            m(
              'nav',
              m('.nav-wrapper', [
                m(
                  'a.brand-logo.hide-on-med-and-down[title=landing page]',
                  {
                    style: 'margin-left: 20px; color: black;',
                    href: routingSvc.href(Pages.LANDING),
                  },
                  [
                    m(`img[width=50][height=50][src=${logo}][alt=logo]`, {
                      style: 'margin-top: 5px; margin-left: -5px;',
                    }),
                    m('span', { style: 'margin-left: 20px; vertical-align: top;' }, APP_TITLE),
                  ]
                ),
                m('ul.right.hide-on-med-and-down', [
                  ...routingSvc
                    .getList()
                    .filter(
                      (d) =>
                        d.id !== Pages.LANDING &&
                        ((typeof d.visible === 'boolean' ? d.visible : d.visible(state)) || isActive(d))
                    )
                    .map((d: Page) =>
                      m('li', { style: 'text-align:center', class: isActive(d) }, [
                        m(
                          'a.primary-text',
                          {
                            title: d.title,
                            href: routingSvc.href(d.id),
                            onclick: () => changePage(d.id),
                          },
                          m(Icon, {
                            className: d.iconClass ? ` ${d.iconClass}` : '',
                            style,
                            iconName: typeof d.icon === 'string' ? d.icon : d.icon ? d.icon() : '',
                          })
                        ),
                      ])
                    ),
                ]),
              ])
            )
          ),
          curPage && curPage.hasSidebar && [m(SideNavTrigger, {}), m(SideNav, { state, actions })],
          m('.container', { style: 'padding-top: 1rem' }, children),
        ]),
      ];
    },
  };
};
