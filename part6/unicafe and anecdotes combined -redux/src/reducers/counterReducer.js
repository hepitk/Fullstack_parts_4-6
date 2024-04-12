import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        good: 0,
        ok: 0,
        bad: 0
    },
    reducers: {
        good(state) {
            state.good += 1;
        },
        ok(state) {
            state.ok += 1;
        },
        bad(state) {
            state.bad += 1;
        },
        zero(state) {
            state.good = 0;
            state.ok = 0;
            state.bad = 0;
        }
    }
});

export const { good, ok, bad, zero } = counterSlice.actions;
export default counterSlice.reducer;
