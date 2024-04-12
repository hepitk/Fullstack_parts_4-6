const getId = () => (100000 * Math.random()).toFixed(0);

const anecdoteReducer = (state = [], action) => {
    switch (action.type) {
        case 'VOTE':
            return state.map(anecdote =>
                anecdote.id === action.id ? { ...anecdote, votes: anecdote.votes + 1 } : anecdote
            ).sort((a, b) => b.votes - a.votes);
        case 'NEW_ANECDOTE':
            return [...state, { id: getId(), content: action.content, votes: 0 }];
        default:
            return state;
    }
};

export const voteAnecdote = (id) => {
    return { type: 'VOTE', id };
};

export const addAnecdote = (content) => {
    return { type: 'NEW_ANECDOTE', content };
};

export default anecdoteReducer;
