import main from '../src/main';

test('main launched', ()=>{
  expect(main()).toBe("main");
})