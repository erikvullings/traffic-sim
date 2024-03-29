import m from 'mithril';
import { ISelectOptions, Select } from 'mithril-materialized';
import { Pages } from '../models';
import { Languages, MeiosisComponent, UserRole, i18n, t } from '../services';

export const AboutPage: MeiosisComponent = () => {
  return {
    oninit: ({
      attrs: {
        actions: { setPage },
      },
    }) => setPage(Pages.ABOUT),
    view: ({
      attrs: {
        state: { role, language },
        actions: { setRole, setLanguage },
      },
    }) => {
      const roleIcon = role === 'user' ? 'person' : role === 'editor' ? 'edit' : 'manage_accounts';

      return m(
        '.container',
        m('#about-page.row.about.page', [
          m(Select, {
            label: t('SELECT_ROLE'),
            className: 'col s6',
            checkedId: role,
            iconName: roleIcon,
            options: [
              { id: 'user', label: t('USER') },
              // { id: 'editor', label: t('EDITOR') },
              { id: 'admin', label: t('ADMIN') },
            ],
            onchange: (role) => {
              setRole(role[0]);
            },
          } as ISelectOptions<UserRole>),
          m(Select, {
            className: 'col s6',
            checkedId: language,
            iconName: 'language',
            label: t('SELECT_LANGUAGE'),
            options: [
              { id: 'en', label: i18n.locales.en.name },
              { id: 'nl', label: i18n.locales.nl.name },
              { id: 'de', label: i18n.locales.de.name },
            ],
            onchange: (l) => {
              setLanguage(l[0]);
            },
          } as ISelectOptions<Languages>),
          m('.col.s12', [
            m('h5', 'Attribution'),
            m(
              'p',
              m(
                'ul.browser-default',
                m(
                  'li',
                  m.trust(
                    'Traffic by DinosoftLabs from <a href="https://thenounproject.com/browse/icons/term/traffic/" target="_blank" title="Traffic Icons">Noun Project</a> (CC BY 3.0)'
                  )
                ),
                m(
                  'li',
                  m.trust(
                    'Walk by Yon ten from <a href="https://thenounproject.com/browse/icons/term/walk/" target="_blank" title="Walk Icons">Noun Project</a> (CC BY 3.0)'
                  )
                ),
                m(
                  'li',
                  m.trust(
                    `Warehouse by Ker'is from <a href="https://thenounproject.com/browse/icons/term/warehouse/" target="_blank" title="warehouse Icons">Noun Project</a> (CC BY 3.0)`
                  )
                ),
                m(
                  'li',
                  m.trust(
                    `Pin by Arafat Uddin from <a href="https://thenounproject.com/browse/icons/term/pin/" target="_blank" title="Pin Icons">Noun Project</a> (CC BY 3.0)`
                  )
                ),
                m(
                  'li',
                  m.trust(
                    `Route by Arafat Uddin from <a href="https://thenounproject.com/browse/icons/term/route/" target="_blank" title="route Icons">Noun Project</a> (CC BY 3.0)`
                  )
                )
              )
            ),
          ]),
        ])
      );
    },
  };
};
