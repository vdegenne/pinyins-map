const accentsMap = {
  'a': /[àáǎā]/g,
  'e': /[èéěē]/g,
  'i': /[ìíǐī]/g,
  'o': /[òóǒō]/g,
  'u': /[ùúǔūǜ]/g
}

const accentsString = 'àáǎāèéěēìíǐīòóǒōùúǔūǜ';
const accentsStringRegExp = /[àáǎāèéěēìíǐīòóǒōùúǔūǜ]/;

export function barePinyin (pinyin: string) {
  if (accentsStringRegExp.test(pinyin)) {
    for (const [letter, accents] of Object.entries(accentsMap)) {
      pinyin = pinyin.replace(accents, letter);
    }
  }
  return pinyin;
}