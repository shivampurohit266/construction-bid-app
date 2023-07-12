import 'dayjs/locale/en';
import 'dayjs/locale/fi';
import 'dayjs/locale/es';
var dayjs = require('dayjs');
//require('dayjs/min/locales.min');

const months = [
  'Tammi',
  'Helmi',
  'Maalis',
  'Huhti',
  'Touko',
  'Kesä',
  'Heinä',
  'Elo',
  'Syys',
  'Loka',
  'Marras',
  'Joulu',
];

const monthsInEnglish = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const monthsInSpanish = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export const dateFunc = (date, lang) => {
  const language = dayjs.locale(lang);
  const dateConfig = dayjs(date);

  if (language === 'en') {
    return dateConfig.format('MMM DD');
  } else if (language === 'fi') {
    return dateConfig.format('MMM DD');
  } else if (language === 'es') {
    return dateConfig.format('MMM DD');
  }
};
export const dateFuncExp = (date, lang) => {
  const language = dayjs.locale(lang);
  const dateConfig = dayjs(date);

  if (language === 'en') {
    return dateConfig.format('MMM DD YYYY');
  } else if (language === 'fi') {
    return dateConfig.format('MMM DD YYYY');
  } else if (language === 'es') {
    return dateConfig.format('MMM DD YYYY');
  }
  // const dayNum = dateConfig?.getDate();
  // const month =
  //   lang === 'fi'
  //     ? months[dateConfig?.getMonth()]
  //     : lang === 'es'
  //     ? monthsInSpanish[dateConfig?.getMonth()]
  //     : lang === 'en'
  //     ? monthsInEnglish[dateConfig?.getMonth()]
  //     : null;

  // if (dayNum && month) {
  //   return `${dayNum} ${month} `;
  // }
};
