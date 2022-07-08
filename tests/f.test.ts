import { f } from '../src/f'
import { g } from '../src/g';

test('length of g', () => {
    expect(f(g)).toBe(g.length);
});

