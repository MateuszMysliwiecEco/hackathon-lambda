import { handler } from '../../src/app';

describe.each([
    {
        name: 'handle method can be called'
    }
])('App.handle', (data) => {
    it(data.name, async () => {
        const result = await handler({});
        expect(result).toEqual(undefined);
    });
});
