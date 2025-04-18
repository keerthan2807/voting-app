import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [votes, setVotes] = useState({ option1: 0, option2: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [voted, setVoted] = useState(false);
  const [theme, setTheme] = useState('light');
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);

  useEffect(() => {
    // Fetch initial vote counts
    fetchVotes();
    
    // Check local storage for theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.body.className = savedTheme;
    
    // Check if user has voted before
    const hasVoted = localStorage.getItem('voted');
    if (hasVoted) {
      setVoted(true);
      setShowNameInput(false);
    }
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
    if (!userName && showNameInput) {
      setError('Please enter your name before voting');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/vote', { option });
      setVotes(response.data.votes);
      setError('');
      setVoted(true);
      setShowNameInput(false);
      
      // Save voted status in local storage
      localStorage.setItem('voted', 'true');
    } catch (err) {
      setError('Failed to submit vote');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetVote = () => {
    setVoted(false);
    localStorage.removeItem('voted');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;
    localStorage.setItem('theme', newTheme);
  };

  // Calculate percentages
  const total = votes.option1 + votes.option2;
  const option1Percent = total > 0 ? Math.round((votes.option1 / total) * 100) : 0;
  const option2Percent = total > 0 ? Math.round((votes.option2 / total) * 100) : 0;

  return (
    <div className={`app-container ${theme}`}>
      <header className="header">
        <h1>Interactive Voting App</h1>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>
      
      <div className="voting-container">
        {showNameInput && (
          <div className="user-form">
            <h3>Welcome to the Voting App!</h3>
            <input 
              type="text" 
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="name-input"
            />
          </div>
        )}
        
        <h2>Which do you prefer?</h2>
        
        {error && <div className="error">{error}</div>}
        
        <div className="options">
          <div className="option">
            <div className="option-header">
              <h3>Coffee</h3>
              <img src="https://cdn-icons-png.flaticon.com/512/751/751621.png" alt="Coffee" className="option-icon" />
            </div>
            <p className="option-description">Rich, aromatic, and perfect to start your day</p>
            <button 
              onClick={() => submitVote('option1')} 
              disabled={loading || voted}
              className="vote-btn"
            >
              {voted && option1Percent > option2Percent ? 'You Voted ✓' : 'Vote'}
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
            <div className="option-header">
              <h3>Tea</h3>
              <img src="https://cdn-icons-png.flaticon.com/512/751/751649.png" alt="Tea" className="option-icon" />
            </div>
            <p className="option-description">Soothing, diverse, and perfect for relaxation</p>
            <button 
              onClick={() => submitVote('option2')} 
              disabled={loading || voted}
              className="vote-btn"
            >
              {voted && option2Percent > option1Percent ? 'You Voted ✓' : 'Vote'}
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
        
        <div className="total-section">
          <p className="total">Total votes: {total}</p>
          {voted && (
            <button className="reset-btn" onClick={resetVote}>
              Vote Again
            </button>
          )}
        </div>
      </div>
      
      <footer className="footer">
        <p>Created with ❤️ | © 2023 Voting App</p>
      </footer>
    </div>
  );
}

export default App; 