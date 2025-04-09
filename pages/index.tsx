import { useState, useEffect } from 'react';
import Head from 'next/head';

// ... existing code ...

// Dummy data for TV shows based on tvwordle.csv
const dummyShows = [
  { title: "Breaking Bad", genre: "Drama", startYear: 2008, endYear: 2013, seasons: 5, network: "AMC" },
  { title: "Game of Thrones", genre: "Fantasy", startYear: 2011, endYear: 2019, seasons: 8, network: "HBO" },
  { title: "Friends", genre: "Comedy", startYear: 1994, endYear: 2004, seasons: 10, network: "NBC" },
  { title: "The Office", genre: "Comedy", startYear: 2005, endYear: 2013, seasons: 9, network: "NBC" },
  { title: "Stranger Things", genre: "Sci-Fi", startYear: 2016, endYear: "Running", seasons: 4, network: "Netflix" },
  { title: "The Sopranos", genre: "Drama", startYear: 1999, endYear: 2007, seasons: 6, network: "HBO" },
  { title: "The Simpsons", genre: "Animation", startYear: 1989, endYear: "Running", seasons: 35, network: "Fox" },
  { title: "The Crown", genre: "Drama", startYear: 2016, endYear: 2023, seasons: 6, network: "Netflix" },
  { title: "Lost", genre: "Drama", startYear: 2004, endYear: 2010, seasons: 6, network: "ABC" },
  { title: "The Mandalorian", genre: "Sci-Fi", startYear: 2019, endYear: "Running", seasons: 3, network: "Disney+" },
];

// Game state interface
interface GameState {
  mysteryShow: typeof dummyShows[0] | null;
  guesses: typeof dummyShows[0][];
  gameOver: boolean;
  won: boolean;
  gaveUp: boolean;
  loading: boolean;
  maxGuesses: number;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredShows, setFilteredShows] = useState<typeof dummyShows>([]);
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

  // Initialize game on component mount
  useEffect(() => {
    // Select a random show as the mystery show
    const randomIndex = Math.floor(Math.random() * dummyShows.length);
    setGameState(prev => ({
      ...prev,
      mysteryShow: dummyShows[randomIndex],
      loading: false
    }));
    
    // Check if user has played before
    const hasPlayed = localStorage.getItem('tvWordleHasPlayed');
    if (hasPlayed) {
      setShowInstructions(false);
    } else {
      localStorage.setItem('tvWordleHasPlayed', 'true');
    }
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.length > 0) {
      const filtered = dummyShows.filter(show => 
        show.title.toLowerCase().includes(term.toLowerCase()) &&
        !gameState.guesses.some(guess => guess.title === show.title)
      );
      setFilteredShows(filtered);
    } else {
      setFilteredShows([]);
    }
  };

  // Handle show selection
  const selectShow = (show: typeof dummyShows[0]) => {
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
    const randomIndex = Math.floor(Math.random() * dummyShows.length);
    setGameState({
      mysteryShow: dummyShows[randomIndex],
      guesses: [],
      gameOver: false,
      won: false,
      gaveUp: false,
      loading: false,
      maxGuesses: 8
    });
  };

  // Check if a property matches the mystery show
  const isMatch = (guess: typeof dummyShows[0], property: keyof typeof dummyShows[0]) => {
    if (!gameState.mysteryShow) return false;
    return guess[property] === gameState.mysteryShow[property];
  };

  // Get directional hint for numeric values
  const getDirectionalHint = (guess: typeof dummyShows[0], property: 'startYear' | 'endYear' | 'seasons') => {
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
    <div className="container">
      <Head>
        <title>TV Wordle</title>
        <meta name="description" content="Guess the TV show" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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