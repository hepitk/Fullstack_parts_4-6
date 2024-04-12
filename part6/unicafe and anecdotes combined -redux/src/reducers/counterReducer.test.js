import deepFreeze from 'deep-freeze';
import counterReducer, { good, ok, bad, zero } from './counterReducer';

describe('counterReducer', () => {
    test('should return the initial state', () => {
        expect(counterReducer(undefined, {})).toEqual({
            good: 0,
            ok: 0,
            bad: 0
        });
    });

    test('GOOD increases good by 1', () => {
        const state = { good: 0, ok: 0, bad: 0 };
        deepFreeze(state);
        const newState = counterReducer(state, good());
        expect(newState).toEqual({ good: 1, ok: 0, bad: 0 });
    });

    test('OK increases ok by 1', () => {
        const state = { good: 0, ok: 0, bad: 0 };
        deepFreeze(state);
        const newState = counterReducer(state, ok());
        expect(newState).toEqual({ good: 0, ok: 1, bad: 0 });
    });

    test('BAD increases bad by 1', () => {
        const state = { good: 0, ok: 0, bad: 0 };
        deepFreeze(state);
        const newState = counterReducer(state, bad());
        expect(newState).toEqual({ good: 0, ok: 0, bad: 1 });
    });

    test('ZERO resets the state to initial', () => {
        const state = { good: 10, ok: 5, bad: 2 };
        deepFreeze(state);
        const newState = counterReducer(state, zero());
        expect(newState).toEqual({ good: 0, ok: 0, bad: 0 });
    });
});

