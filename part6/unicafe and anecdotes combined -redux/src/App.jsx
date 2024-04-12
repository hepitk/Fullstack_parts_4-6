import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AnecdoteForm from './components/AnecdoteForm';
import AnecdoteList from './components/AnecdoteList';
import Notification from './components/Notification';
import Unicafe from './components/Unicafe';

const App = () => {
    return (
        <Router>
            <div>
                <h1>Redux Applications</h1>
                <nav>
                    <ul>
                        <li>
                            <Link to="/unicafe">Unicafe Feedback</Link>
                        </li>
                        <li>
                            <Link to="/anecdotes">Anecdote Voting</Link>
                        </li>
                    </ul>
                </nav>
                <Notification />
                <Routes>
                    <Route path="/unicafe" element={<Unicafe />} />
                    <Route path="/anecdotes" element={<Anecdotes />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;



const Anecdotes = () => {
    return (
        <div>
            <h2>Anecdotes</h2>
            <AnecdoteList />
            <AnecdoteForm />
        </div>
    );
};

