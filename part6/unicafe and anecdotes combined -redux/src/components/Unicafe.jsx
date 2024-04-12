import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { good, ok, bad, zero } from '../reducers/counterReducer';

const Unicafe = () => {
    const dispatch = useDispatch();
    const feedback = useSelector(state => state.counter);

    return (
        <div>
            <h2>Unicafe Feedback System</h2>
            <button onClick={() => dispatch(good())}>Good</button>
            <button onClick={() => dispatch(ok())}>Ok</button>
            <button onClick={() => dispatch(bad())}>Bad</button>
            <button onClick={() => dispatch(zero())}>Reset</button>
            <div>
                <p>Good: {feedback.good}</p>
                <p>Ok: {feedback.ok}</p>
                <p>Bad: {feedback.bad}</p>
            </div>
        </div>
    );
};

export default Unicafe;

