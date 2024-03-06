import m from 'mithril';
import { Pages, PoiType, PointOfInterest, Settings, Vehicle, VehicleType } from '../models';
import { MeiosisComponent, t } from '../services';
import { FormAttributes, LayoutForm, UIForm } from 'mithril-ui-form';
import { UploadDownload } from './ui/upload-download';

export const SettingsPage: MeiosisComponent = () => {
  const defaultIcons = new Map<VehicleType | PoiType, string>([
    [
      'car',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAACNuAAAjbgHnu+UfAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABSVJREFUaIHtmWuIVGUYx3/PzKxb2wXdhRQ0d99zdo1Ay2DRQLIsK4RIA9cuUGSCWX2IvlVfElNEQopoQa1QCAovEWofupgTIiW0IGKGOjvvmW39oJXLrpdgd2fO04c9o2cvZ3cuyTiw/0/v87zv8zz//5lz3tuIqlLNiFWaQLmYFFBpTAqoNKpeQKKYwa2trTU9PT0vAc8D84GGAkP/BjpFZK/v+zs9z+stkmckpNB1wHXdOar6NTC3zJp/+b7/XCaTSZaZByhQgDGmSUSOAdND7n+B8yF7OnBb0D4HDIT6bgfuCtnZWCz2ZGdn5+FSSIdRkADHcZLAI4GZAd70PO+ghoIdx9kNrAKIx+NzU6nUqRE57heRD1V1SeA6X1NTM+/MmTP/lCNgwo+4ubl5UYj8hVgstthae0CL3INYa0/Mnj37CeDnwDVjcHBwfTE5xsKEAlT1xVB7c2dnZ3epxZLJZDaXy60B+gPXWsdx7ik1H0wgQETiqvpMYA5ms9kvyikG0NXVZYFPArMG2FJOvnEFOI6zhODjE5FD3d3dPeUUy0NVNwIXA3O567qPlZprXAGq2hYy95ZaZCQ8z+sNROTrfCAiJS2qkUEiEgdWBObgwMDA/lIKRKGhoaEdSAXmA8aYF0rJEykg/PoAP/1fr08eHR0dg8C7IdfmmTNn1hWbJ3IdcF13p6q+DKCqp0TkjwlyPQjcHbS/By4VUp+hXzkBICK7fN/flslkOlQ1V0D8aAFNTU3LYrHYVuDeQhLcIPSKSBI4BPyYTqdTUQOHCXBd9x1V3cTQk7mZYIFdU6ZM+ej06dOXwx3XBDiOswrYXQFyxeBP3/dXZDKZ43mHqCotLS21uVwuA8yoHLeCcTEejy9MpVJpCGYh3/efojrIAzRks9kdeSMvYFHl+BQPEXnUdd1WuL4OTB9n/E0JVV0GgYBg1a0qiIgDVXyoV9VboYoF5FHorUQ/cAzoBeYBzo0go6ppEfkdmAYsBGoniskL6B9nzH7gVWvthbzDcZw24DPgztLpDsMlYI3nefvyDmPMDBHZDjwdEdMP11+hqL3G0cbGxpVh8gDW2r2q+myZpMNos9buCzs8zztfX1+/UlV/iYhJQSAgHo9/BYza/YnI+mQymR0r2vO874CjZdEewhFr7Q9jdXR0dAyKyPoxunK5XO5LCAQEy/KogVevXj02QfFfi6I6BoL7pkjU1dWNVeO94Gx9fRay1m5U1deAK3lfbW3tlAmKj9tfCHzfrxmvv6+vL1zjiqqus9ZuyjuGzUKe520zxiwQkdUA8Xh8KRFnYRGRpqampSLXdt5rGZqlCsFUYEeQZ6mISNQ9UyKReDzfVtU9nudtH8ZjZJwxZoWIfBOYZ0VkQTqd7huZ2HXd11W1PTBPWmvvK5A8AI7jnCS4Z1XVdSOJBVymishvQHPgWm6tPRAeM2ohy2QyB4ETgTlHVY86jrNYgkfd2Ng4zXGcjar6cShsQzHkA7yfb4hIu+M4G4wxUwNbjDEPMzRJ5Mkf9zzv25FJxjwTNzc3z/V9/whDC0oeF4HLwCyGv3qfWmvXliAAY8znIvJKyJVl6GL4TqA+5O/J5XIPdXV1jTqXRx7qjTHzRWQP0BJR3we2ep73tqr6pQgQkbgxZgvwFtHbmrPAKmvtibE6x72dNsbcEovFVgNtqjoPuENVz4nIYaA9KmmxCB7WG6q6RERmAZdF5KTv+3sSicTOVCoVuVMo+A+OmxVVvxudFFBpTAqoNKpewH9QjPqXaDKYowAAAABJRU5ErkJggg==',
    ],
    [
      'truck',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAB2HAAAdhwGP5fFlAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAvhJREFUaIHtmM9r02AYx79P0zY0IoLzZKE1KWUThuJlzvP04p8wmV4UD+I8rgiKyg5zgiDevOq8eFYQlAmKUim6w47Lu9iBnj04IT/6eDCVLEmbzHRNBv1AoO+T5/vm/fKm7/vmIWbGfiaX9gCSMjKQNiMDaZMPC5bLZUWW5QYzzxLRMQDSAJ/pMLORy+VWTNNc2tra+p2kM/Ivo+7g3wKYTtJxTD5ZljWTxETgFZJluYHhDB4AzhSLxYUkHQQMMPNskg53CzNfSKIPGHDf+WGiJhGHrUKD/MPGIdHzQlehYaNpmncl+QmgRURLuq6/idJmcR84BGCGmV9rmnYlKjmLBrrkADyq1+u1qKTUEUJQ9yKiKoA191bJcZxGP20mDHjRdb0NYN4TulSr1Sq98jNnAACEEO8BfHCbBWa+0Ss3kwYAgIiWPM2r4+PjR8LyMmtA1/WXRPTFbR4wTfNaWF5mDQBAp9N50P1NRPMTExMH/TmZNmAYxgsAG27zsGVZl/05geO0b1fMGmtCiFPeQKZnIITj/sB+MyD7A/vNQICRgbQZGUibkYG9gIhuKooid78R+uVm0kCpVHq8vr5uxsnNpIHt7e35ycnJYpzcsLOQjeGXVuLiCCF2VFLCZuBbnw5MZl6wbbts23aZmRsAYk31gPTCHwjUhZj5ie9ryHvv9ubm5rIndF9VVf/XU08GoF/xxwIzMDY29hDAu7AOHMd5GifWiyR6Zv5o2/ayPx4w0Gq1rGq1eg7ALWbW4w5uj3AAbDDzHdu2z4aV4UNLi6urqzaARQCLmqY1AUwBgCRJcwDue3MLhcJFz0LQFELsKM0n1UcRWRtl5hUimgIAIrqnquq/aZckaY6I7nrSn4XonyfRRxFYRv3U63XZcZwmgJMRfX1VFGXavwG5+s8ATvyPPopIAwBQqVSO5vP5V+htYq3T6Zw3DOPHXuj7EWsnbrfb3yVJOo2/Jb8mgF/u1QRwXZKk6X4PT6rvR6wZyDKZPAvthpGBtPkDVZtUfNVVA3wAAAAASUVORK5CYII=',
    ],
    [
      'bicycle',
      'data:image/png;base64,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',
    ],
    [
      'pedestrian',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAcWAAAHFgHjmmr+AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAA09JREFUaIHVmk9IVFEUxn8nTS0hQiuhooLSojKDNCJcGKERtApchbkIooVERBtrEQQVtGpRi6B/CC6ynbiwP7uKjCiSNDICoSwoLIhK09LT4s3E687TeXPnXh0/uDDvnnfu+b458+aee2ZEVZnLmDfbBLJFvs/FRSQP2ALMB3pVdcx1DG8ZEJEaoB94DjwBBkVkr/M4Pp4BEVkC9AFlhmkMqFbVPlexfGXgCKnkAQqB4y4D+RKwahrbapeBfAkYmMb22mUgX89AMfACWGeYvgGVqvreVSwvGVDVn0ADcD80/QzY5ZI8eMrAfwFESoF8Vf3kY31vG5mIlAH1QDHQ7SsOqup8APuBr4AmxjjQ5CWWB/JNwJ8Q+eQYBdbmtADgEDARQT45ruesAOBwGvKayExFzgkgKB0m05BPjhs5JQA4EZO4lyxkS74+guB4DBE3c0VAh0HsDXA0ZhbWuxBgXUokTlu7Q1PjQB0wFMM9D7gqIhtt4yeRTS1UA5SErh+q6scM/GuBlyLSISJm0Rcb2QioN67vxfD5HhG/EegXkVYbEtkIaDCu78TwOQ9cJvi4hVEAnBWRNZmSsBIgIoXAjtDUZ4L6Px1+qGoLsAFoI9j4kpgEfmfKJZsM/Aq97tLE11IcqOqgqjYTtFzagB6CYu9DpiSsymlVHRORA8AZ4B1wKmQuzWCdV0CzDYckrM8DqtoJdEaYttnTyRw+jpTVHtacEk4FiEgBsNnlmungOgOVBM2rqbDMcTznAtJ9fFpEpCTNPRnBtQDzATY3rMUE5bcz+M5AO9BrzB0TkRWuAjoTkNidzQf4KXDamFsAnHQV193RDg6SWvdvT9gek3rocdKhcEW+lqBtYrZRihL2ughx7TkhAKgAhiMIXjTu6zbsE0DVrAogqHsGIsg/SL77oXurSG27dM2aAKAIeBRB/i2wdAqfWxH31824AEAIviJNMsNA+TR+5aR2LXpIdMlnUsC5CPKjwM4YvlcifPfNmABgOanN2wmgMab/SmDE8L9rK8BmIysiaIuE0aqqt+M4q+oQcMmYXmjB49+CNlm4RvDOTQIXLPwXEZyhlSAbe2wzYP0Tk4hsAkZUddDSPx/YCgyq6hcrEszAb2S+Mef/rfIXSCdVH0rxsoIAAAAASUVORK5CYII=',
    ],
    [
      'poi',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAcWAAAHFgHjmmr+AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAz1JREFUaIHFmV1ojmEYx3/3tjebtI1ZM0zZgYyUhsLamZQ5kU2ckI98FimnyokjORIOlJRywJFxIBIxkgjJiRQZs4aYMMPa5eC5n3qtno/rfu7nfa+6Tt7ruq/r/3s+3vvjMSKCbzPGNAItwFTAAMPAgIgMeu/lA8AYUwf0AF1AJ9AYkfoN6AOuAxdF5FPm5iLi7MAc4CQwAojS/wDngfmZNDgKLwCHHYVP9L/AcWBySQCA2cB9D8In+gugLVcAoA3oz0F86F+AjlwAgFZgMEfxof8EVngFAGqBlyUQH/oQMNMnwIUSig/9NvZvPhMAsLoM4kPfngmAYBZ9XkaAQaA6TmMF8bYWWJSQE2c/CJYRrjYD2BabkXAHLqO/agPAAaC5qE4DsAN45VDvkdMjBEwBfiubXQPqYmpOIlg+aCFaXQDWKJs8JOF5tXUrgKvK2jtd3oH2mNhEGwf2iMhoUqKIjAN7gV+K+kuiAnEA8xQNHojI07TJIvIe6FXUj9QSB9CgaHBXkesyZnpUIA6gWtHgsyI3tI+K3JqoQByA5v97miI3NM0d/hoViAPQbPc6FLmhdSpyh6ICcQADigadxpgFaZONMU3AOkX9D1GBOIB7igaVwGljTCEp0RhjgBMEE2Va64uMJMya2j3vJaAmpmYVwSGAdiae5boa7XVo9grYAtQW1akBuoFnDvWeZFlOr3JoGPofgv3za2A0Q52tzgAWwuWq+fIhEtZXaQC6ygiwK1FfUoKFOFcG8bfwsSe2APXA2xKKHwbmptKWJslCLMbPUWKSjwPrU+tKm2ghNpcA4IhKkybZQpzKUfwVoCJvgAJwJwfxL4F6tR7tAAvRBLzzKP47sNBJi8sgC7GcbDNs8Uu7wVmH60ALsdsDwNFMGrIMthBnMoi/AVSWG6BAsF7Xin8DNGTun7WAhWgm2MGlFT8CtHvp7aOIhVhJ+qPIjd76+ipkIfanEH/Ma0+fxSzE2RjxN4Eqn/28fKkvNmNMNcGp27IJoX5gqfj4Ol9kSR841CbBAW8P/58rjQLdvsVDDgAAItIPbALG7E/7RORxHr28P0L/FTfmENAiIgdz65EnAIAxpkpExpIz3ewfuODYxf1t4KIAAAAASUVORK5CYII=',
    ],
    [
      'warehouse',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAcWAAAHFgHjmmr+AAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAmVJREFUaIHtmb9rFUEQxz/jj5hgFNGAUf8B7aI2r7C1tLIQi6QQBBuxFBHRztrSQtTYKIKViuhDIYUogoQgBItYGBs7TRRDfC9jsRe4bG43vPHurYf3hWl2mLff793MvNtZUVXqjE2pCfwtGgGp0QhIjcoEiMgBEZkUkbsisr+qfVDVUg0YAi4CC4Bm9hO4BgyVvl/J5E8An3LEfZsHJgD5pwQAR4CpCHHf3gKt5AKAfcBNoNMD+VVbASaB0b4LAAaAC8B3A3HffmT1MdgXAVmez5VA3LfPwERlAoBDwLMKiPv2ChgrTQCwB7hhzHOrdbP62GsWAGzN8vxbH4n7tpjVxzaLgHZC4r49D/GMfUqMRHz9RpBL8zGXGlsMMfeBR2UTyXASONVLgEXAB1V9aIjbECJysNeY2qdQIyA1GgGpUXsBljaKiJwBzrH2AawAt4DHwG1gtxf2BRhX1UXLniGYBADngbGC9WHgN3C8wHcUaAEvjHsWwppCobjNmYUQ85VKpDawCuhE1kM+cOlVKqw1cB04y/oivoM7CD3AHUXzmAdeG/cLwipgBjecGsitdYGPuFHLG2DUi5kDlkSkhZts5OthGbhnYhI5Uk5TfLy7THg6MQucDvgUOEZ49PgUuBLwvbccKWPYHljfhWulIQxHYmNxQfy3XSgGreA3g7AKeEkx0TbwDnc34OMrrvjbBT4NrG8IUVVE5BJw2PPtpPif8xewhMvlfBfq4AZR4IZifk4v4DoVwA7WdsBl3CXIIO6CxEeX9Q9lVlWvrnacJ6QfXvVqU6rq3kCd0XSh1GgEpEbtBfwBtCJ7so9OwocAAAAASUVORK5CYII=',
    ],
  ]);

  const vehicleForm: UIForm<Vehicle> = [
    { id: 'id', autogenerate: 'id', type: 'text', className: 'col s4 m2', required: true },
    { id: 'label', type: 'text', label: t('NAME'), className: 'col s4 m2', required: true },
    {
      id: 'type',
      type: 'select',
      label: t('TYPE'),
      required: true,
      value: 'car',
      options: [
        { id: 'car', label: t('CAR') },
        { id: 'truck', label: t('TRUCK') },
        { id: 'bicycle', label: t('BICYCLE') },
        // { id: 'motorcycle', label: t('MOTORCYCLE') },
        { id: 'pedestrian', label: t('PEDESTRIAN') },
      ],
      className: 'col s4 m2',
    },
    { id: 'defaultIcon', type: 'switch', label: t('DEFAULT_ICON'), className: 'col s4 m3 h84' },
    {
      id: 'icon',
      type: 'base64',
      label: t('ICON'),
      className: 'col s12 m3',
      required: true,
      options: [{ id: '.png' }],
    },
    { id: 'poi', label: t('POI2'), type: 'select', options: 'pois', required: true },
    { id: 'desc', type: 'textarea', label: t('DESCRIPTION') },
  ];

  const poiForm: UIForm<PointOfInterest> = [
    { id: 'id', autogenerate: 'id', type: 'text', className: 'col s4 m2', required: true },
    { id: 'label', type: 'text', label: t('NAME'), className: 'col s4 m2', required: true },
    {
      id: 'type',
      type: 'select',
      label: t('TYPE'),
      required: true,
      value: 'car',
      options: [
        { id: 'poi', label: t('POI') },
        { id: 'warehouse', label: t('WAREHOUSE') },
      ],
      className: 'col s4 m2',
    },
    { id: 'defaultIcon', type: 'switch', label: t('DEFAULT_ICON'), className: 'col s4 m3 h84' },
    {
      id: 'icon',
      type: 'base64',
      label: t('ICON'),
      className: 'col s12 m3',
      required: true,
      options: [{ id: '.png' }],
    },
    { id: 'lat', type: 'number', label: t('LAT'), className: 'col s6' },
    { id: 'lon', type: 'number', label: t('LON'), className: 'col s6' },
    { id: 'desc', type: 'textarea', label: t('DESCRIPTION') },
  ];

  const form = [
    { id: 'appName', label: t('APP_NAME'), type: 'text', className: 'col s6' },
    { id: 'mapUrl', label: t('MAP_URL'), type: 'url', className: 'col s6' },
    { id: 'pois', label: t('POIS'), type: poiForm, repeat: true, pageSize: 10 },
    { id: 'vehicles', label: t('VEHICLES'), type: vehicleForm, repeat: true, pageSize: 10 },
  ] as UIForm<Settings>;

  return {
    oninit: ({
      attrs: {
        actions: { setPage },
      },
    }) => {
      setPage(Pages.SETTINGS);
    },
    view: ({
      attrs: {
        state: { settings },
        actions: { saveSettings },
      },
    }) => {
      return m(
        '.container',
        m('#settings-page.row.settings.page', [
          m('.col.s12.right', m(UploadDownload, { settings, saveSettings })),
          m('h5.col.s12', t('SETTINGS', 'TITLE')),
          m(LayoutForm, {
            form,
            obj: settings,
            onchange: () => {
              console.log(settings);
              const { vehicles = [], pois = [] } = settings;
              vehicles.forEach((v) => {
                if (v.defaultIcon) {
                  const icon = defaultIcons.get(v.type);
                  // console.log(icon);
                  if (icon) v.icon = icon;
                }
              });
              pois.forEach((p) => {
                console.log(p.icon);
                if (p.defaultIcon) {
                  const icon = defaultIcons.get(p.type);
                  // console.log(icon);
                  if (icon) p.icon = icon;
                }
              });
              saveSettings(settings);
            },
          } as FormAttributes<Settings>),
        ])
      );
    },
  };
};
