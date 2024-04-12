import { createSlice } from '@reduxjs/toolkit';

const getId = () => (100000 * Math.random()).toFixed(0);

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        voteAnecdote(state, action) {
            const id = action.payload;
            const anecdoteToVote = state.find(anecdote => anecdote.id === id);
            if (anecdoteToVote) {
                anecdoteToVote.votes++;
            }
            return [...state].sort((a, b) => b.votes - a.votes);
        },
        addAnecdote(state, action) {
            state.push({
                id: getId(),
                content: action.payload,
                votes: 0
            });
        }
    }
});

export const { voteAnecdote, addAnecdote } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;