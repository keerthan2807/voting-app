import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [votes, setVotes] = useState({ option1: 0, option2: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch initial vote counts
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const response = await axios.get('/api/votes');
      setVotes(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch votes');
      console.error(err);
    }
  };

  const submitVote = async (option) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/vote', { option });
      setVotes(response.data.votes);
      setError('');
    } catch (err) {
      setError('Failed to submit vote');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate percentages
  const total = votes.option1 + votes.option2;
  const option1Percent = total > 0 ? Math.round((votes.option1 / total) * 100) : 0;
  const option2Percent = total > 0 ? Math.round((votes.option2 / total) * 100) : 0;

  return (
    <div className="container">
      <h1>Voting App</h1>
      
      <div className="voting-container">
        <h2>Make your choice:</h2>
        
        {error && <div className="error">{error}</div>}
        
        <div className="options">
          <div className="option">
            <h3>Option 1</h3>
            <button 
              onClick={() => submitVote('option1')} 
              disabled={loading}
              className="vote-btn"
            >
              Vote
            </button>
            <div className="result">
              <div className="bar">
                <div 
                  className="fill" 
                  style={{ width: `${option1Percent}%` }}
                ></div>
              </div>
              <div className="count">
                {votes.option1} votes ({option1Percent}%)
              </div>
            </div>
          </div>
          
          <div className="option">
            <h3>Option 2</h3>
            <button 
              onClick={() => submitVote('option2')} 
              disabled={loading}
              className="vote-btn"
            >
              Vote
            </button>
            <div className="result">
              <div className="bar">
                <div 
                  className="fill" 
                  style={{ width: `${option2Percent}%` }}
                ></div>
              </div>
              <div className="count">
                {votes.option2} votes ({option2Percent}%)
              </div>
            </div>
          </div>
        </div>
        
        <div className="total">
          <p>Total votes: {total}</p>
        </div>
      </div>
    </div>
  );
}

export default App; 