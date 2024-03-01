import m from 'mithril';
import { Pages } from '../models';
import { MeiosisComponent } from '../services';

export const HomePage: MeiosisComponent = () => {
  return {
    oninit: ({
      attrs: {
        actions: { setPage },
      },
    }) => setPage(Pages.HOME),
    view: () => {
      return [m('#home-page.row.home.page', 'HOME-PAGE')];
    },
  };
};
