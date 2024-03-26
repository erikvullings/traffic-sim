import m from 'mithril';
import { Pages, PoiType, PointOfInterest, Settings, Vehicle, VehicleType } from '../models';
import { Languages, MeiosisComponent, i18n, t } from '../services';
import { FormAttributes, LayoutForm, UIForm } from 'mithril-ui-form';
import { UploadDownload } from './ui/upload-download';
import { SimControl } from './map/sim-control';
import { ISelectOptions, Select } from 'mithril-materialized';
import { extractLatLong } from '../utils';
import { MiniMapComponent } from './map';

export const SettingsPage: MeiosisComponent = () => {
  const defaultIcons = new Map<VehicleType | PoiType, string>([
    [
      'car',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAotJREFUSInVlc9LVFEUxz/nzYyo/QJplTjz7nOcqEUU9IMgoYQwiIgEN/0FbVq0aNMyaOciahe4ihQiijbSQhhSamNQbVJT73vT1KYfVFgqzsw9LZqRcdRmAg36wl28c773+73nXs47oqpsJbwtVf8XBvGNEul0ukdVDzrnEjUpFZGpVCo1ks1mi/UMpPYNjDHNInIfOAf8BJaBnUARWABi5e+JUqnUm8vlvv7JYM0VeZ53Beh1zvVZa7dba9tUdQoYtNa2WWt3eZ53AuiKxWK361WwykBERFUvichQFEWPNto0Ozv7TESuAReDIDjasIHv+8eApKoO1TuZtfaOqr4BboqINFpBP/AllUpl6xmoaqlcxfEgCC5sxFt55HQ63eOcuwdsA97W8PYDP4B362gcAj4Cd4HRQqEwns/nF1cZBEFwGbhV79QNYhEYVNWrYRguSSaT2V0oFHJA6yYZVPDAWtsvvu/3isiTTRYHQET2eiKyYyvEAZxz+9b7F5WAHLD0F1pL5T2l6qCIJDxVna+KfVPVw9ZaPxaLJYEXDYhPJBKJDmut75w7AnyvJFR13isWi2OALQeGwzB8BTAzM/NJVQcaMBiYnp7+DBBF0UsRGS5rzQFP4/l8fjGZTHbH4/HnItJUW2KZ/FBEVpWvqjER6atwKnDONYlIpKrdURQtoaqoKsaYG8aYBd/3e8u9kTHGTBpjxiqc2mWMGTfGTAZB0KWq+L5/xhizYIy5XuGsdHJHR0dLIpEYAU7yu1laROQDcGpubm5mvbvp7OzMqGoW2FO1J7u8vHy20s2r5oGIiDHmNHBAVd8Xi8XH1W2/Htrb21ubm5vPq2o78DoMw1GtEl0zcDYb///Q/wUAnTrZv58OWwAAAABJRU5ErkJggg==',
    ],
    [
      'truck',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAYdJREFUSInVVr1LHFEcnHl7hXBELJL69vZheYf4B+RfCAQrr4hdmgSSiLg29mIjkpCkWG20FvurAlqlsT723ZLaItkyuIzN7rFZuQ9wN+BUv515O8P7fpSEJmEadf8fAa2i8H1/3RhzCqAHgAv8m0qKkiTZ1oxxnvTAGHMCoL+gOQAsk/zo+/6rWY3KQ9Rb0LiK/iyRRe+CIHjscroluR/H8dcyWcckX5E8AHAj6XO3212rNYDkMI7j0PO81wBSkmGtAQVGo1Eq6RuADWvtau0BAEDyCMBfSTsTrsZJLuPWOfcCaG4nPy+Kp38W1RnwC8AhgKtGAkhej8fjPZLDf/jSKkoBPMv5DMB5Xg8AeBW/efof59wKUDquSUaSPuSfZ865rTxYAN5UDObpUVFMApxznzqdzg9jTISH+E3yOwBIejtNl3Qn6WeSJJcPAvJL48Ja+1LS+yAIinthIOnYORcCgLV2SdK7aXoVrSphjAmzLPMAbObUl3a7HZb03SzLzDS9Cj75V8U9qsydZE4D230AAAAASUVORK5CYII=',
    ],
    [
      'bicycle',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAA2hJREFUSIm1lV1oHFUUx3/n3myi0IqmFaKNdWdm1whZC2JKJSCoNQ9KC1r6IILtg4gt+PUoPipifSnUvvig4AdipE8WRaRSRfwATZSCloSZzExCQGK11sSOpe7e48PelU2yW5OAfxjmzj3n/M/HveeMqCr/J3rWaxBF0W2qugswqrqQ5/mHqtropi/ryUBETBAEF4DNbduPp2n6ejcbs2Z2QFUd8D6QAhe8091XDGqjZxCG4ZPAcVWdybKs0k1v2RmEYXgS2Nu2VQcOpWn6RgfbbwFEJBwcHNwyPz//WycHK0t0c4cA7ulkaK09A1wGpFQqjawpA2vtXapaBXDOPQfsB+4Pw3CiG4HPYifwyX86iON4EZgEiKKox59Pv3+uhJ1ryqCFkZGRkqre66N70zk3tSLibcBTa3HQ8RYFQXC3iHwGOGvtQBzH51qyWq22qSiKL4Dbgb+AqwGstTfFcTy/kmtVHwwNDW01xhz0nxPt5CJii6J4z5NfFpG9wJ8AjUbjYLVajbpmEEXRdlU9TvOaipdfBI709/e/MjEx8XcYhseAp73sCaACPAP0tnF+55w7lOf59/86KJfLNxhjvgbKq+rVxNuqOikixwBU9YiI3AGMddFfMsaMJknyo/Gpv+TJfwdOeKVzwIt+faBFLiLjxpjYk6uqnvY6iyKyn+YI2eycOwogw8PDvUVRLAJ9wKOq+pCI7KPZxUvAtW0l+0pV7xORE8AeERlvNBrPG2NSL78V2AW8BbhGo7HVFEUReHKAUyLSWvcA17WRny+VSg9mWXaJZu0BTuV5ngG5J7TW2lZGRkTKxqcEgHPuRmvtI8aY3SIyJiJjNKcnwNnp6elf/bpls93bjVprd8zOzp6t1+vbWnyq+odJ03QBOANgjHm5r6/vUpIkp2dmZj6t1+sp0BrHn7cZfuzfh4MgKOd5/nMcxz/VarVeEXnBq83Nzc1loqpEUbRHVT+g2RfTwEfAJuBh4BpgwRizI0mSXwCCIBgQkR+AAWARGFfViyLyADDUcp5l2WvtfXBYVY8CV7Ecc8aYfUmSTLZvViqVUefcSWALq/FqlmXPqqouGxVRFN2iqgeAEVU9b4z5slQqvTM1NbXUgYRqtXq9c+4xVb1TRHpVNXXOvZvn+TctnQ3/0daKdf2TN4J/AEdGcv6r4CYKAAAAAElFTkSuQmCC',
    ],
    [
      'pedestrian',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAYFJREFUSIm11TFoVEEQBuBvLhG5SlNYKKRQIY0KEbES7MRKK8FSxMLCQhCxjIV9IFhZ2FuIYCNoIzaW2iiIBA2BGFC00yJq1uJN8TiS3L6Xc2HZWWZn/v1ndmajlOJ/jkGXwxFxLiLuR8SFaqNSStXEUWyg4C/ma+y6MJjFnpQHODxpBlN4kgxeYG+NXXRJckTMYqqUslJt1IHBDfzWxP9ytV2l81vYzPAUrGM4EQDcaTluz5u7BsCZdPYLH0cAvtSwGPdML+Z6F29GdAfxNCJO9k4y3uZtj+FR6/YfsJryJq50ZhAR0ziOlVLK+xH1J8xpkr+MP30ZnMeJlF+2GDyrfabTY8L3PNkEdo71NqO2F81hX3ufIZwYwKlc1/FT01mvThLgbK6vsJTyQkQMx1pWVPIlTf8puIb9+J7727ut5NMZkoLHGIy0jx+Y6QWAI/iajl5rtQUMsZa6e30BFtPBMg5sob+e+s996+CB5hdbKqV820L/EIfwbqccd/rR+ox/+Fy/ab398RwAAAAASUVORK5CYII=',
    ],
    [
      'motorcycle',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAcFJREFUSInt1TlrFVEUB/Dffb4imsJKxaQVhAQ7FQTNB7BS8hWCIGohNhosbCSthYIWLqCdIDbaxKVzAzGgoBGM4oIbbrHIiyY5FnOfji/zQjCkCHjgMMOce/7/s85NEWExpbao6P8J5iP1hQKklFYoAp2KiEarfUEZpJSu4DtuYUfVmXo+2I91GMeDiLhTAbYMW7AWb3APV7O5DwMppYsRMf2XY96DPtxAZD2MWkSU7U9L9sAHTOMU1uAjhpo+v31LIB04iZkMMIazOIfJFvCyTuBxfp/B9kqCTNKJbdiL0TlA22kD62cRoBuXc8qBJ9iJff9AMoVL6I4ItZRSJ27iB3qxCsdwHs9wrbXhFTKBPYoB2JADvZ5H2AE8RL1UqtW4gBcYmSPaUbzEwZZS1/EI++EMjmfDygw633LsytFvnjU9nMDpGl7n0oiIb+hHDwaz82BOuUp+Ksa1p8LWi1cUDf6MQ/LsYyPeYQjDil40dQR38/cB7MZbbMq+tRzUJ3SVF+k5vmSQBo4qLVs7RcIRxZCM4Wt+bo0IqXmjpZQ6FL+C5bgfEe/blKVSUkpdOfNx3I6ISfwhWCxZ+hfO0if4Be3YKEuDSI1ZAAAAAElFTkSuQmCC',
    ],
    [
      'motorscooter',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAAbpJREFUSInN1T9rVFEQBfDfXVf8AwqGaKGdYBHwG8g2WipC0E8QCWpjIRaKpWIn2KSLglgJ4goSUqhYCSqIXQTFJoqKZYIgqLkWO5u9Wd8zu9FABobLO2/mnjcz576bcs7W0xrruvuGJUgpPUspvS98ojY45zy04wNy4XfrYtNahpxSOoZtOIwz+JRz3vffKigqGSuq2F8V809Dzjm/wXw8tqpimimlLTi+yl4vcs7z/WBKaUxPKC3crkrebeXAqnymoj3jWIj3ixivaaMRfB2ApBUJDVzBUuDvcLB2TpE0NQDBc+xEu8BmseuvQgiCjwMQZHyJdQnX0MQkXuO7zvm4gZGyRZuLcgfxRZyM5Js1MW8x2iUYHWLz3O03jhbYlM6hO1cMfrpLMIiKlr0o/U5g9/tUMxH4AhpNfMNFHTuPPXgQQ+3aAZzCzwLbG+tLK+1VrDuwvV+zM8He7sOvBz5XYNOBPaXzTwv8UuCfl1VUvDxRtKON07ilJ4ILRewh/NKT62TM4kdgV/8gWOVMPESzL/ayagU+wdZKgqKSGczhUfR/U03sEdyL3j/G2fJD1nQfDGMb804exn4DU1QMjs96t6oAAAAASUVORK5CYII=',
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
        { id: 'motorcycle', label: t('MOTORCYCLE') },
        { id: 'motorscooter', label: t('SCOOTER') },
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
    { id: 'desc', type: 'textarea', label: t('DESCRIPTION2'), className: 'col s6' },
    { id: 'desc', type: 'markdown', label: t('PREVIEW'), readonly: true, show: ['desc'], className: 'col s6' },
  ];

  const poiForm: UIForm<PointOfInterest> = [
    { id: 'id', autogenerate: 'id', type: 'text', className: 'col s4 m2', required: true },
    { id: 'label', type: 'text', label: t('NAME'), className: 'col s4 m2', required: true },
    {
      id: 'type',
      type: 'select',
      label: t('TYPE'),
      required: true,
      value: 'poi',
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
    { id: 'latlon', type: 'text', label: t('LATLON', 'TITLE'), placeholder: t('LATLON', 'DESC'), className: 'col s6' },
    { id: 'lat', type: 'number', disabled: true, label: t('LAT'), className: 'col s3' },
    { id: 'lon', type: 'number', disabled: true, label: t('LON'), className: 'col s3' },
    { id: 'desc', type: 'textarea', label: t('DESCRIPTION2'), className: 'col s6' },
    { id: 'desc', type: 'markdown', label: t('PREVIEW'), readonly: true, show: ['desc'], className: 'col s6' },
  ];

  const form = [
    { id: 'appName', label: t('APP_NAME'), type: 'text', className: 'col s6' },
    { id: 'mapUrl', label: t('MAP_URL'), type: 'url', className: 'col s6' },
    { id: 'pois', label: t('POIS'), type: poiForm, repeat: true, pageSize: 1 },
    { id: 'vehicles', label: t('VEHICLES'), type: vehicleForm, repeat: true, pageSize: 1 },
  ] as UIForm<Settings>;

  return {
    oninit: ({
      attrs: {
        actions: { setPage },
      },
    }) => {
      setPage(Pages.SETTINGS);
    },
    view: ({ attrs: { state, actions } }) => {
      const { settings, language } = state;
      const { saveSettings, setLanguage } = actions;

      return m(
        '.container',
        m('#settings-page.row.settings.page', [
          m('.col.s12', [
            m(Select, {
              className: 'left',
              checkedId: language,
              iconName: 'language',
              label: t('SELECT_LANGUAGE'),
              options: [
                { id: 'en', label: i18n.locales.en.name },
                { id: 'nl', label: i18n.locales.nl.name },
                { id: 'de', label: i18n.locales.de.name },
              ],
              onchange: async (l) => {
                setLanguage(l[0]);
              },
            } as ISelectOptions<Languages>),
            m(UploadDownload, { settings, saveSettings }),
            m(SimControl, { state, actions }),
          ]),
          m('h5.col.s12', t('SETTINGS', 'TITLE')),
          m(LayoutForm, {
            form,
            obj: settings,
            onchange: () => {
              const { vehicles = [], pois = [] } = settings;
              vehicles.forEach((v) => {
                if (v.defaultIcon) {
                  const icon = defaultIcons.get(v.type);
                  if (icon) v.icon = icon;
                }
              });
              pois.forEach((p) => {
                if (p.latlon) {
                  const coordinates = extractLatLong(p.latlon);
                  if (coordinates) {
                    const { lat, lon } = coordinates;
                    p.lat = lat;
                    p.lon = lon;
                  }
                }
                if (p.defaultIcon) {
                  const icon = defaultIcons.get(p.type);
                  if (icon) p.icon = icon;
                }
              });
              saveSettings(settings);
            },
          } as FormAttributes<Settings>),
          m(MiniMapComponent, { state, actions }),
        ])
      );
    },
  };
};
