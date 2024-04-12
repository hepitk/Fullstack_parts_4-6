import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './reducers/counterReducer';
import anecdoteReducer from './reducers/anecdoteReducer';
import notificationReducer from './reducers/notificationReducer';

const store = configureStore({
    reducer: {
        counter: counterReducer,
        anecdotes: anecdoteReducer,
        notification: notificationReducer
    },
    devTools: true
});

export default store;