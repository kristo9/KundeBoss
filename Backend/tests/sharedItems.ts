import { closeConnections } from '../SharedFiles/dataBase';

export function prepareContext() {
  let context = {
    res: { status: null, body: null },
    log: (txt) => console.log(txt),
    done: null,
  };

  context = {
    res: { status: null, body: null },
    log: (txt) => null,
    done: () => (context.done = true),
  };
  return context;
}

export let httpRequest = {
  headers: { authorization: '' },
};

export async function timeout(context) {
  let i = 0;
  for (; i < 100 && context.done !== true; ++i) {
    await new Promise((r) => setTimeout(r, 100));
  }
  closeConnections();
}

export function expectStuff(context, statusCode: number, data: string, body = null) {
  expect(context.res.status).toEqual(statusCode);
  if (body != null) {
    expect(context.res.body).toEqual(data);
  }
  expect(context.done).toEqual(true);
}
