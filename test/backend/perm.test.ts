import { loginAsTheGodOfTheGods } from '@/lib/backend/perm';

describe('loginAsTheGodOfTheGods', () => {
  it('nil or no user or no user.name attr', () => {
    expect(loginAsTheGodOfTheGods(null)).toBeFalsy();
    expect(loginAsTheGodOfTheGods(undefined)).toBeFalsy();
    expect(loginAsTheGodOfTheGods({ expires: '' })).toBeFalsy();
    expect(loginAsTheGodOfTheGods({ expires: '', user: {} })).toBeFalsy();
  });

  it('user.name tests', () => {
    expect(loginAsTheGodOfTheGods({ expires: '', user: { name: null } })).toBeFalsy();
    expect(loginAsTheGodOfTheGods({ expires: '', user: { name: undefined } })).toBeFalsy();
    expect(loginAsTheGodOfTheGods({ expires: '', user: { name: 'null' } })).toBeFalsy();
    expect(loginAsTheGodOfTheGods({ expires: '', user: { name: 'hans774882968' } })).toBeTruthy();
    expect(loginAsTheGodOfTheGods({ expires: '', user: { name: 'Hans774882968' } })).toBeTruthy();
    expect(loginAsTheGodOfTheGods({ expires: '', user: { name: 'foo_hans774882968_bar' } })).toBeFalsy();
  });
});
