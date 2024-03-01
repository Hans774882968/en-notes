import randomstring from 'randomstring';

export default function genFileNameAtFrontend(meaningfulFileName?: string) {
  const now = new Date(Date.now());
  const year = now.getFullYear().toString().replace('20', '');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  if (meaningfulFileName) {
    return [meaningfulFileName, year, month, day].join('-');
  }
  const random = randomstring.generate(4);
  return [year, month, day, random].join('-');
}
