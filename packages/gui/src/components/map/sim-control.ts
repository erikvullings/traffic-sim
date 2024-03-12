import m from 'mithril';
import { API, MeiosisComponent, reloadSettings } from '../../services';
import { FlatButton } from 'mithril-materialized';
import { SimState } from '../../models';

export const SimControl: MeiosisComponent = () => {
  return {
    view: ({
      attrs: {
        state: { simState },
        actions: { update },
      },
    }) => {
      return m('.sim-control.right', [
        m(FlatButton, {
          iconName: simState === 'started' ? 'pause' : 'play_arrow',
          className: 'right p0',
          onclick: async () => {
            let newSimState: SimState = simState === 'started' ? 'paused' : 'started';
            await m.request(`${API}/sim/state/${newSimState === 'started' ? 'start' : 'pause'}`);
            update({ simState: newSimState });
          },
        }),
        m(FlatButton, {
          iconName: 'stop',
          className: 'right p0',
          onclick: async () => {
            await m.request(`${API}/sim/state/reset`);
            const settings = await reloadSettings();

            update({
              simState: 'reset',
              sims: () => [],
              settings: () => settings,
            });
          },
        }),
      ]);
    },
  };
};
