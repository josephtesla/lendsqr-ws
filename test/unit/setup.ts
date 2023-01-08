
/* eslint-env jest */
beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await new Promise(res => setTimeout(res, 500)); // avoid jest open handle error
})
