import m, { FactoryComponent } from 'mithril';
import { uniqueId } from 'mithril-materialized';

/** A simple toggle switch, toggling a state between two image icons */
export const ToggleSwitchComponent: FactoryComponent<{
  initialValue?: boolean;
  /** Material icon to use for the off image, @default edit */
  off?: string;
  /** Material icon to use for the on image, @default visibility */
  on?: string;
  /** Class to apply to the off material icons image, @default 'blue white-text' */
  offClass?: string;
  /** Class to apply to the on material icons image, @default 'green white-text' */
  onClass?: string;
  /** Triggered when the input value is changed */
  onchange?: (v: boolean) => void;
}> = () => {
  const id = uniqueId();

  let state = false;
  return {
    oninit: ({ attrs: { initialValue = false } }) => {
      state = initialValue;
    },
    view: ({
      attrs: { off = 'edit', on = 'visibility', offClass = 'blue white-text', onClass = 'green white-text', onchange },
    }) => {
      return m('.on-off-toggle-switch', [
        m('input[type=checkbox].on-off-toggle-switch-checkbox', {
          id,
          checked: state,
          onclick: () => {
            state = !state;
            onchange && onchange(state);
          },
        }),
        m('label.on-off-toggle-switch', { for: id }, [
          m('i.material-icons.on-off-toggle-switch-on', { className: offClass }, off),
          m('i.material-icons.on-off-toggle-switch-off', { className: onClass }, on),
        ]),
      ]);
    },
  };
};
