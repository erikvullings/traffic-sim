import m from 'mithril';
import 'material-icons/iconfont/filled.css';
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';
import 'maplibre-gl/dist/maplibre-gl.css';
import './css/style.css';
import './css/toggle.css';
import { routingSvc } from './services/routing-service';
import { LANGUAGE } from './utils';
import { Languages, i18n } from './services';

const language = (localStorage.getItem(LANGUAGE) || 'nl') as Languages;

document.documentElement.setAttribute('lang', language);

i18n.addOnChangeListener((language: string) => {
  console.log(`GUI language: ${language}, navigating to ${location.pathname}`);
  document.documentElement.setAttribute('lang', language);
  routingSvc.init();
  m.route(document.body, routingSvc.defaultRoute, routingSvc.routingTable());
});
i18n.init(
  {
    en: { name: 'English', fqn: 'en-UK', default: true },
    nl: { name: 'Nederlands', fqn: 'nl-NL' },
    de: { name: 'Deutsch', fqn: 'de-DE' },
    unknown: { name: 'English', fqn: 'en-UK' },
  },
  language
);
