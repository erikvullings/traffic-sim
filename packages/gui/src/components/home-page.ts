import m from 'mithril';
import { Pages } from '../models';
import { MeiosisComponent } from '../services';
import { MapComponent, MapRoutingComponent } from './map';

export const HomePage: MeiosisComponent = () => {
  return {
    oninit: ({
      attrs: {
        actions: { setPage },
      },
    }) => setPage(Pages.HOME),
    view: ({ attrs: { state, actions } }) => {
      const { role } = state;
      return [
        m(
          '#home-page.home',
          m(MapComponent, { state, actions }),
          role !== 'user' && m(MapRoutingComponent, { state, actions })
        ),
      ];
    },
  };
};
