import m from 'mithril';
import { ID, Settings, Vehicle } from '../../models';
import { FlatButton, ISelectOptions, Select } from 'mithril-materialized';
import { MeiosisComponent, t } from '../../services';

export const MapRoutingComponent: MeiosisComponent = () => {
  const updateVehicle = async (
    curVehicle: Vehicle,
    settings: Settings,
    saveSettings: (settings: Settings) => Promise<void>,
    getRoute: (v: Vehicle) => Promise<void>
  ) => {
    settings.vehicles = settings.vehicles.map((v) => (v.id === curVehicle.id ? curVehicle : v));
    await saveSettings(settings);
    await getRoute(curVehicle);
  };

  return {
    view: ({
      attrs: {
        state: { curVehicleId, settings },
        actions: { update, saveSettings, getRoute },
      },
    }) => {
      const { pois = [], vehicles = [] } = settings;
      const curVehicle = curVehicleId && vehicles.filter((v) => v.id === curVehicleId).shift();
      if (curVehicle && !(curVehicle.pois instanceof Array)) curVehicle.pois = [''];

      return m('.map-routing', [
        m('.row', [
          m(Select, {
            label: t('VEHICLE'),
            className: 'col s8',
            placeholder: t('PICK_ONE'),
            options: vehicles,
            onchange: (v) => {
              console.log(v);
              update({ curVehicleId: v[0] });
            },
          } as ISelectOptions<ID>),
          curVehicle && [
            m('.row', [
              m('.col.s4.mt18', [
                m(FlatButton, {
                  iconName: curVehicle.visible === 'visible' ? 'visibility' : 'visibility_off',
                  className: 'right p0',
                  onclick: async () => {
                    curVehicle.visible = curVehicle.visible === 'hidden' ? 'visible' : 'hidden';
                    await updateVehicle(curVehicle, settings, saveSettings, getRoute);
                  },
                }),
                m(FlatButton, {
                  iconName: curVehicle.state === 'moving' ? 'pause' : 'play_arrow',
                  className: 'right p0',
                  onclick: async () => {
                    curVehicle.state = curVehicle.state === 'moving' ? 'paused' : 'moving';
                    await updateVehicle(curVehicle, settings, saveSettings, getRoute);
                  },
                }),
              ]),
            ]),
            curVehicle.pois!.map((checkedId, i) => [
              m(Select, {
                className: 'col s10',
                label: t('DESTINATION'),
                placeholder: t('PICK_ONE'),
                checkedId,
                options: pois,
                onchange: async (v) => {
                  curVehicle.pois![i] = v[0];
                  await updateVehicle(curVehicle, settings, saveSettings, getRoute);
                },
              } as ISelectOptions<ID>),
              i === curVehicle.pois!.length - 1
                ? m(FlatButton, { iconName: 'add', className: 'col s2 mt18', onclick: () => curVehicle.pois!.push('') })
                : (i > 0 || curVehicle.pois!.length > 1) &&
                  m(FlatButton, {
                    iconName: 'delete',
                    className: 'col s2 mt18',
                    onclick: async () => {
                      curVehicle.pois = curVehicle.pois!.filter((_, idx) => idx !== i);
                      await updateVehicle(curVehicle, settings, saveSettings, getRoute);
                    },
                  }),
            ]),
          ],
        ]),
      ]);
    },
  };
};
