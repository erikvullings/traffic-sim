import m from 'mithril';
import { ID, Vehicle } from '../../models';
import { FlatButton, ISelectOptions, Select, TextArea } from 'mithril-materialized';
import { MeiosisComponent, t } from '../../services';
import { SlimdownView } from 'mithril-ui-form';
import { ToggleSwitchComponent } from '../ui/toggle';

export const MapRoutingComponent: MeiosisComponent = () => {
  let editDesc = false;
  let desc: string | undefined;

  const updateVehicle = async (curVehicle: Vehicle, getRoute: (v: Vehicle) => Promise<void>) => {
    // settings.vehicles = settings.vehicles.map((v) => (v.id === curVehicle.id ? curVehicle : v));
    await getRoute(curVehicle);
  };

  return {
    view: ({
      attrs: {
        state: { curVehicleId, settings, sims },
        actions: { update, getRoute, pauseResumeVehicle, updateSimDesc },
      },
    }) => {
      const { pois = [], vehicles = [] } = settings;
      const curVehicle = curVehicleId && vehicles.filter((v) => v.id === curVehicleId).shift();
      if (curVehicle && (typeof curVehicle.pois === 'undefined' || curVehicle.pois.length === 0)) {
        curVehicle.pois = [''];
      }
      const isMoving = !curVehicle || curVehicle.state === 'moving';
      const sim = curVehicleId && sims?.find((s) => s[0] === curVehicleId);
      if (curVehicleId) {
        if (sim) {
          desc = sim[5];
        }
        if (curVehicle && (typeof desc === 'undefined' || desc === null)) {
          desc = curVehicle.desc;
        }
      }

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
                m(FlatButton, {
                  iconName: curVehicle.visible === 'hidden' ? 'visibility_off' : 'visibility',
                  className: 'right p0',
                  onclick: async () => {
                    curVehicle.visible = curVehicle.visible === 'hidden' ? 'visible' : 'hidden';
                    await updateVehicle(curVehicle, getRoute);
                  },
                }),
                m(FlatButton, {
                  iconName: isMoving ? 'pause' : 'play_arrow',
                  // disabled: !isMoving && !route,
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
                options: pois,
                onchange: async (v) => {
                  curVehicle.pois![i] = v[0];
                  await updateVehicle(curVehicle, getRoute);
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
                      await updateVehicle(curVehicle, getRoute);
                    },
                  }),
            ]),

            editDesc
              ? m(TextArea, {
                  onbeforeupdate: () => !editDesc,
                  label: t('DESCRIPTION'),
                  initialValue: desc,
                  onchange: (v) => {
                    if (v === desc) return;
                    v && updateSimDesc(curVehicleId, v);
                  },
                })
              : m('.col.s12', m(SlimdownView, { md: desc, removeParagraphs: true })),
            m('.right', [m(ToggleSwitchComponent, { onchange: (v) => (editDesc = v) })]),
          ],
        ]),
      ]);
    },
  };
};
