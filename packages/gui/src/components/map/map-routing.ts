import m, { route } from 'mithril';
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
        state: { curVehicleId, settings, route },
        actions: { update, saveSettings, getRoute, pauseResumeVehicle },
      },
    }) => {
      const { pois: allPois = [], vehicles = [] } = settings;
      const curVehicle = curVehicleId && vehicles.filter((v) => v.id === curVehicleId).shift();
      if (curVehicle && (typeof curVehicle.pois === 'undefined' || curVehicle.pois.length === 0)) {
        curVehicle.pois = [''];
      }
      const pois = curVehicle ? allPois.filter((p) => p.id !== curVehicle.poi) : allPois;
      const isMoving = !curVehicle || curVehicle.state === 'moving';

      console.table({ isMoving });

      return m('.map-routing', [
        m('.row', [
          m(Select, {
            label: t('VEHICLE'),
            className: 'col s8',
            placeholder: t('PICK_ONE'),
            initialValue: curVehicleId,
            options: vehicles,
            onchange: (v) => {
              // console.log(v);
              update({ curVehicleId: v[0], route: undefined });
            },
          } as ISelectOptions<ID>),
          curVehicle && [
            m('.row', [
              m('.col.s4.mt18', [
                // m(FlatButton, {
                //   iconName: curVehicle.visible === 'visible' ? 'visibility' : 'visibility_off',
                //   className: 'right p0',
                //   onclick: async () => {
                //     curVehicle.visible = curVehicle.visible === 'hidden' ? 'visible' : 'hidden';
                //     await updateVehicle(curVehicle, settings, saveSettings, getRoute);
                //   },
                // }),
                m(FlatButton, {
                  iconName: isMoving ? 'pause' : 'play_arrow',
                  disabled: !isMoving && !route,
                  className: 'right p0',
                  onclick: async () => {
                    await pauseResumeVehicle(curVehicle);
                  },
                }),
              ]),
            ]),
            curVehicle.pois!.map((checkedId, i) => [
              m(Select, {
                key: `select${isMoving}`,
                className: 'col s10',
                label: t('DESTINATION'),
                placeholder: t('PICK_ONE'),
                checkedId,
                disabled: isMoving,
                options: i === 0 ? pois : allPois.filter((p) => p.id !== curVehicle.pois![i - 1]),
                onchange: async (v) => {
                  curVehicle.pois![i] = v[0];
                  await updateVehicle(curVehicle, settings, saveSettings, getRoute);
                },
              } as ISelectOptions<ID>),
              i === curVehicle.pois!.length - 1
                ? m(FlatButton, {
                    key: `add${isMoving}`,
                    iconName: 'add',
                    className: 'col s2 mt18',
                    disabled: isMoving,
                    onclick: () => curVehicle.pois!.push(''),
                  })
                : (i > 0 || curVehicle.pois!.length > 1) &&
                  m(FlatButton, {
                    key: `delete${isMoving}`,
                    iconName: 'delete',
                    className: 'col s2 mt18',
                    disabled: isMoving,
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
