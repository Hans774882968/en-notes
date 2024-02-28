import randomstring from 'randomstring';

export default function genFileNameAtFrontend() {
  const datetime = new Date();
  const year = datetime.getFullYear().toString().replace('20', '');
  const month = datetime.getMonth().toString().padStart(2, '0');
  const day = datetime.getDate().toString().padStart(2, '0');
  const random = randomstring.generate(4);
  return [year, month, day, random].join('-');
}
