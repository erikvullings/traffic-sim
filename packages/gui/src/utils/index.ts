import { padLeft } from 'mithril-materialized';

export const LANGUAGE = 'SG_LANGUAGE';
export const SAVED = 'SG_MODEL_SAVED';

const supRegex = /\^([^_ ]+)(_|$|\s)/g;
const subRegex = /\_([^\^ ]+)(\^|$|\s)/g;

/** Expand markdown notation by converting A_1 to subscript and x^2 to superscript. */
export const subSup = (s: string) => (s ? s.replace(supRegex, `<sup>$1</sup>`).replace(subRegex, `<sub>$1</sub>`) : s);

export const capitalize = (s?: string) => s && s.charAt(0).toUpperCase() + s.slice(1);

/**
 * Debounce function wrapper, i.e. between consecutive calls of the wrapped function,
 * there will be at least TIMEOUT milliseconds.
 * @param func Function to execute
 * @param timeout Timeout in milliseconds
 * @returns
 */
export const debounce = (func: (...args: any) => void, timeout: number) => {
  let timer: number;
  return (...args: any) => {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      func(...args);
    }, timeout);
  };
};

export const formatDate = (date: number | Date = new Date()) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${padLeft(d.getMonth() + 1)}-${padLeft(d.getDate())}`;
};

/**
 * Get a color that is clearly visible against a background color
 * @param backgroundColor Background color, e.g. #99AABB
 * @returns
 */
export const getTextColorFromBackground = (backgroundColor?: string) => {
  if (!backgroundColor) {
    return 'black-text';
  }
  const c = backgroundColor.substring(1); // strip #
  const rgb = parseInt(c, 16); // convert rrggbb to decimal
  const r = (rgb >> 16) & 0xff; // extract red
  const g = (rgb >> 8) & 0xff; // extract green
  const b = (rgb >> 0) & 0xff; // extract blue

  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

  return luma < 105 ? 'white-text' : 'black-text';
};

type Option<T> = {
  id: T;
  label: string;
  title?: string;
};

export const getOptionsLabel = <T>(options: Array<Option<T>>, id?: T | T[], showTitle = true) => {
  if (!id) {
    return '';
  }
  const print = (o: Option<T>) =>
    showTitle ? `${o.label}${o.title ? ` (${o.title.replace(/\.\s*$/, '')})` : ''}` : o.label;
  if (id instanceof Array) {
    return options
      .filter((o) => id.indexOf(o.id) >= 0)
      .map((o) => print(o))
      .join(', ');
  }
  const found = options.filter((o) => o.id === id).shift();
  return found ? print(found) : '';
};

/** Join a list of items with a comma, and use AND for the last item in the list. */
export const joinListWithAnd = (arr: string[] = [], and = 'and', prefix = '') => {
  const terms = arr.filter((term) => term);
  return terms.length === 0
    ? ''
    : prefix +
        (terms.length === 1
          ? terms[0]
          : `${terms
              .slice(0, terms.length - 1)
              .map((t, i) => (i === 0 || typeof t === 'undefined' ? t : t.toLowerCase()))
              .join(', ')} ${and} ${terms[terms.length - 1].toLowerCase()}`);
};

/** Convert markdown text to HTML */
// export const markdown2html = (markdown = '') =>
//   m.trust(render(markdown, true, true));

export const isUnique = <T>(item: T, pos: number, arr: T[]) => arr.indexOf(item) == pos;

/** Generate an array of numbers, from start till end, with optional step size. */
export const generateNumbers = (start: number, end: number, step: number = 1): number[] => {
  if (start > end) {
    throw new Error('Start number must be less than or equal to the end number.');
  }

  if (step <= 0) {
    throw new Error('Step size must be a positive number.');
  }

  const length = Math.floor((end - start) / step) + 1;
  return Array.from({ length }, (_, index) => start + index * step);
};

export const getRandomValue = <T>(array: T[]): T | undefined => {
  if (array.length === 0) {
    return undefined;
  }

  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

/**
 * Deep copy function for TypeScript.
 * @param T Generic type of target/copied value.
 * @param target Target value to be copied.
 * @see Source project, ts-deepcopy https://github.com/ykdr2017/ts-deepcopy
 * @see Code pen https://codepen.io/ErikVullings/pen/ejyBYg
 */
export const deepCopy = <T>(target: T): T => {
  if (target === null) {
    return target;
  }
  if (target instanceof Date) {
    return new Date(target.getTime()) as any;
  }
  if (target instanceof Array) {
    const cp = [] as any[];
    (target as any[]).forEach((v) => {
      cp.push(v);
    });
    return cp.map((n: any) => deepCopy<any>(n)) as any;
  }
  if (typeof target === 'object') {
    const cp = { ...(target as { [key: string]: any }) } as {
      [key: string]: any;
    };
    Object.keys(cp).forEach((k) => {
      cp[k] = deepCopy<any>(cp[k]);
    });
    return cp as T;
  }
  return target;
};

/** Compute a contrasting background color */
export const contrastingColor = (backgroundColor: string) => {
  const backgroundRgb = [
    parseInt(backgroundColor[1] + backgroundColor[2], 16),
    parseInt(backgroundColor[3] + backgroundColor[4], 16),
    parseInt(backgroundColor[5] + backgroundColor[6], 16),
  ];
  const luminance = 0.2126 * backgroundRgb[0] + 0.7152 * backgroundRgb[1] + 0.0722 * backgroundRgb[2];

  // If the background is dark, use white text.
  if (luminance < 20) {
    return '#ffffff';
  }

  // If the background is light, use black text.
  return '#000000';
};

export const scrollToSection = (e: MouseEvent, id: string): void => {
  e.preventDefault();
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  } else {
    console.warn(`Element with id ${id} not found.`);
  }
};

export const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};
