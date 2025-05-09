import { useState, useEffect } from 'react';
import Head from 'next/head';
import SEO from '@/components/SEO';
import Header from '@/components/Header';

// TV Show interface
interface TVShow {
  title: string;
  genre: string;
  startYear: number | string;
  endYear: number | string;
  seasons: number;
  network: string;
}

// Game state interface
interface GameState {
  mysteryShow: TVShow | null;
  guesses: TVShow[];
  gameOver: boolean;
  won: boolean;
  gaveUp: boolean;
  loading: boolean;
  maxGuesses: number;
}

export default function Home() {
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredShows, setFilteredShows] = useState<TVShow[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    mysteryShow: null,
    guesses: [],
    gameOver: false,
    won: false,
    gaveUp: false,
    loading: true,
    maxGuesses: 8
  });

  // Fetch CSV data and initialize game
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/tvwordle.csv');
        const csvData = await response.text();
        
        // Parse CSV data manually
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        
        const parsedShows: TVShow[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',');
          const show: TVShow = {
            title: values[0],
            genre: values[1],
            startYear: parseInt(values[2]),
            endYear: values[3] === 'Running' ? 'Running' : parseInt(values[3]),
            seasons: parseInt(values[4]),
            network: values[5]
          };
          
          parsedShows.push(show);
        }
        
        setTvShows(parsedShows);
        
        // Select a random show as the mystery show
        const randomIndex = Math.floor(Math.random() * parsedShows.length);
        setGameState(prev => ({
          ...prev,
          mysteryShow: parsedShows[randomIndex],
          loading: false
        }));
        
        // Check if user has played before
        const hasPlayed = localStorage.getItem('tvWordleHasPlayed');
        if (hasPlayed) {
          setShowInstructions(false);
        } else {
          localStorage.setItem('tvWordleHasPlayed', 'true');
        }
      } catch (error) {
        console.error('Error fetching CSV data:', error);
      }
    };
    
    fetchData();
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 0) {
      const filtered = tvShows.filter(show => 
        show.title.toLowerCase().includes(term.toLowerCase()) &&
        !gameState.guesses.some(guess => guess.title === show.title)
      );
      setFilteredShows(filtered);
    } else {
      setFilteredShows([]);
    }
  };

  // Handle show selection
  const selectShow = (show: TVShow) => {
    setSearchTerm('');
    setFilteredShows([]);
    
    // Check if show is already guessed
    if (gameState.guesses.some(guess => guess.title === show.title)) {
      return;
    }
    
    // Check if show is the mystery show
    const isCorrect = show.title === gameState.mysteryShow?.title;
    
    const newGuesses = [...gameState.guesses, show];
    
    setGameState(prev => ({
      ...prev,
      guesses: newGuesses,
      gameOver: isCorrect || newGuesses.length >= prev.maxGuesses,
      won: isCorrect
    }));
  };

  // Handle give up
  const handleGiveUp = () => {
    setGameState(prev => ({
      ...prev,
      gameOver: true,
      gaveUp: true
    }));
  };

  // Handle new game
  const handleNewGame = () => {
    const randomIndex = Math.floor(Math.random() * tvShows.length);
    setGameState({
      mysteryShow: tvShows[randomIndex],
      guesses: [],
      gameOver: false,
      won: false,
      gaveUp: false,
      loading: false,
      maxGuesses: 8
    });
  };

  // Check if a property matches the mystery show
  const isMatch = (guess: TVShow, property: keyof TVShow) => {
    if (!gameState.mysteryShow) return false;
    return guess[property] === gameState.mysteryShow[property];
  };

  // Get directional hint for numeric values
  const getDirectionalHint = (guess: TVShow, property: 'startYear' | 'endYear' | 'seasons') => {
    if (!gameState.mysteryShow) return null;
    
    // Handle "Running" endYear special case
    if (property === 'endYear' && (guess[property] === 'Running' || gameState.mysteryShow[property] === 'Running')) {
      return null;
    }
    
    if (guess[property] === gameState.mysteryShow[property]) {
      return null;
    }
    
    if (guess[property] < gameState.mysteryShow[property]) {
      return <span className={`directionalHint higher`}>↑</span>;
    } else {
      return <span className={`directionalHint lower`}>↓</span>;
    }
  };

  // Share results
  const shareResults = () => {
    if (!gameState.mysteryShow) return;
    
    let shareText = `TV Wordle - ${gameState.mysteryShow.title}\n`;
    shareText += gameState.won ? `I got it in ${gameState.guesses.length}/${gameState.maxGuesses} guesses!` : 'I gave up!';
    shareText += '\n\n';
    
    // Add emoji grid representation of guesses
    gameState.guesses.forEach(guess => {
      const genreMatch = isMatch(guess, 'genre') ? '🟩' : '⬜';
      const startYearMatch = isMatch(guess, 'startYear') ? '🟩' : '⬜';
      const endYearMatch = isMatch(guess, 'endYear') ? '🟩' : '⬜';
      const seasonsMatch = isMatch(guess, 'seasons') ? '🟩' : '⬜';
      const networkMatch = isMatch(guess, 'network') ? '🟩' : '⬜';
      
      shareText += `${genreMatch}${startYearMatch}${endYearMatch}${seasonsMatch}${networkMatch}\n`;
    });
    
    shareText += '\nPlay at: https://tvwordle.me';
    
    navigator.clipboard.writeText(shareText)
      .then(() => alert('Results copied to clipboard!'))
      .catch(() => alert('Failed to copy results. Please try again.'));
  };

  if (gameState.loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="w-full">
        <Header/>
           <SEO
        title="Home - TV Wordle"
        description="Welcome to TV Wordle, the ultimate guessing game for TV enthusiasts. Test your knowledge of popular TV shows by guessing the mystery show in a limited number of tries."
        url="https://yourwebsite.com"
        image="/path-to-image.png"
        type="website"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "url": "https://yourwebsite.com",
          "name": "TV Wordle",
          "description": "Dive into TV Wordle, the ultimate guessing game for TV enthusiasts."
        }}
      />

      <main className="main">
        <h1 className="title">TV Wordle</h1>
        
        {showInstructions && (
          <div className="instructions">
            <p>Guess the mystery TV show in {gameState.maxGuesses} tries or less!</p>
            <p>Green cells indicate a match with the mystery show.</p>
            <p>For numeric values, arrows indicate if the mystery show's value is higher (↑) or lower (↓).</p>
            <button 
              className="newGameButton" 
              onClick={() => setShowInstructions(false)}
            >
              Got it!
            </button>
          </div>
        )}
        
        {!gameState.gameOver ? (
          <>
            <div className="gameControls">
              <div className="searchContainer">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Start typing to guess a TV show..."
                  className="searchInput"
                />
                {filteredShows.length > 0 && (
                  <div className="dropdown">
                    {filteredShows.map((show) => (
                      <div 
                        key={show.title} 
                        className="dropdownItem"
                        onClick={() => selectShow(show)}
                      >
                        {show.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="buttonContainer">
                <button 
                  className="guessButton"
                  onClick={() => {
                    if (filteredShows.length > 0) {
                      selectShow(filteredShows[0]);
                    }
                  }}
                  disabled={filteredShows.length === 0}
                >
                  Guess
                </button>
                <button 
                  className="giveUpButton"
                  onClick={handleGiveUp}
                  disabled={gameState.guesses.length === 0}
                >
                  Give up
                </button>
              </div>
            </div>

            <div className="guessCount">
              Guesses: {gameState.guesses.length}/{gameState.maxGuesses}
            </div>

            <div className="guessesContainer">
              {gameState.guesses.length > 0 && (
                <table className="guessTable">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Genre</th>
                      <th>Start Year</th>
                      <th>End Year</th>
                      <th>Seasons</th>
                      <th>Network</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameState.guesses.map((guess, index) => (
                      <tr key={index}>
                        <td>{guess.title}</td>
                        <td className={isMatch(guess, 'genre') ? "match" : ''}>
                          {guess.genre}
                        </td>
                        <td className={isMatch(guess, 'startYear') ? "match" : ''}>
                          {guess.startYear}
                          {!isMatch(guess, 'startYear') && getDirectionalHint(guess, 'startYear')}
                        </td>
                        <td className={isMatch(guess, 'endYear') ? "match" : ''}>
                          {guess.endYear}
                          {!isMatch(guess, 'endYear') && guess.endYear !== 'Running' && gameState.mysteryShow?.endYear !== 'Running' && getDirectionalHint(guess, 'endYear')}
                        </td>
                        <td className={isMatch(guess, 'seasons') ? "match" : ''}>
                          {guess.seasons}
                          {!isMatch(guess, 'seasons') && getDirectionalHint(guess, 'seasons')}
                        </td>
                        <td className={isMatch(guess, 'network') ? "match" : ''}>
                          {guess.network}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <div className="gameOverContainer">
            <h2>The mystery show was:</h2>
            <h1 className="mysteryPlayerReveal">
              {gameState.mysteryShow?.title}
            </h1>
            
            {gameState.won ? (
              <p>You got it in {gameState.guesses.length} tries!</p>
            ) : (
              <p>You {gameState.gaveUp ? 'gave up' : 'ran out of guesses'} after {gameState.guesses.length} guesses.</p>
            )}
            
            <button 
              className="shareButton"
              onClick={shareResults}
            >
              Share Results
            </button>
            
            <button 
              className="newGameButton"
              onClick={handleNewGame}
            >
              New Game
            </button>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Created by Diz</p>
        <p>This site is not affiliated with any TV networks or production companies.</p>
      </footer>
    </div>
  );
}