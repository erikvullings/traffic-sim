import m from 'mithril';
import { Pages } from '../models';
import { MeiosisComponent } from '../services';
import { InfoPanel, MapComponent, MapRoutingComponent } from './map';

export const HomePage: MeiosisComponent = () => {
  return {
    oninit: ({
      attrs: {
        actions: { setPage },
      },
    }) => setPage(Pages.HOME),
    view: ({ attrs: { state, actions } }) => {
      const { role, settings: { version } = { version: 0 } } = state;
      return [
        m('#home-page.home', [
          m(MapComponent, { key: `map_${version}`, state, actions }),
          role !== 'user'
            ? m(MapRoutingComponent, { key: `map_routing_${version}`, state, actions })
            : m('div', { key: `map_routing_0` }),
          m(InfoPanel, { key: 'info-panel', state, actions }),
        ]),
      ];
    },
  };
};
