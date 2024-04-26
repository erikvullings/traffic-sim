import m from 'mithril';
import { MeiosisComponent, t } from '../../services';
import { padLeft } from 'mithril-materialized';
import { render } from 'mithril-ui-form';
import { capitalize } from '../../utils';
import { VehicleVisibility } from '../../models';

export const InfoPanel: MeiosisComponent = () => {
  const etaToMsg = (id: [id: string, VehicleVisibility] = ['', 'hidden'], eta = 0, desc = '') => {
    const delta = eta === 0 ? 0 : new Date(eta).valueOf() - Date.now();
    const arrivalIn = `${padLeft(Math.round((delta / 3600000) % 24))}:${padLeft(Math.round((delta / 60000) % 60))}`;
    const deltaMsg = delta === 0 ? '' : `${t('ARRIVAL_IN')} ${arrivalIn}`;
    const etaMsg =
      eta === 0
        ? t('ARRIVED')
        : `${t('ETA')}: ${new Date(eta).toLocaleTimeString().replace(/:\d{2}$/, '')} (${deltaMsg}).`;
    return `<strong>${id ? capitalize(id[0]) : ''}:</strong> ${etaMsg}\n${desc ? render(desc, true) : ''}`;
  };

  return {
    view: ({
      attrs: {
        state: { sims = [], settings },
      },
    }) => {
      const { vehicles = [] } = settings;
      const lookupName = vehicles.reduce((acc, cur) => {
        acc.set(cur.id, [cur.label, cur.visible]);
        return acc;
      }, new Map<string, [string, VehicleVisibility]>());

      return (
        sims.length > 0 &&
        m(
          '.info-panel',
          m(
            'table',
            m(
              'tbody',
              sims
                .filter(([id]) => {
                  const found = lookupName.get(id);
                  return found && found[1] !== 'hidden';
                })
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([id, , , , eta, desc]) => m('tr', m('td', m.trust(etaToMsg(lookupName.get(id), eta, desc)))))
            )
          )
        )
      );
    },
  };
};
