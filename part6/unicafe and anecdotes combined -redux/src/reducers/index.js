import { combineReducers } from 'redux';
import counterReducer from './counterReducer';
import anecdoteReducer from './anecdoteReducer';

export default combineReducers({
    counter: counterReducer,
    anecdotes: anecdoteReducer
});
