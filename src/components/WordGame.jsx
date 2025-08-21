import { useState, useCallback } from 'react';
import words from '../data/words';

const WordGame = () => {
  const [currentWords, setCurrentWords] = useState([]);
  const [targetWord, setTargetWord] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Function to get 4 random words
  const getRandomWords = useCallback(() => {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, []);

  // Function to set up new round
  const setupNewRound = useCallback(() => {
    const selectedWords = getRandomWords();
    setCurrentWords(selectedWords);
    const randomTarget = selectedWords[Math.floor(Math.random() * selectedWords.length)];
    setTargetWord(randomTarget);
    setShowFeedback(false);

    if (gameStarted) {
      // Play audio only if game has started (user has interacted)
      setTimeout(() => {
        const audio = new Audio(`/audio/${randomTarget}.mp3`);
        audio.play().catch((error) => console.log('Audio play failed:', error));
      }, 500);
    }
  }, [getRandomWords, gameStarted]);

  // Start game function
  const startGame = () => {
    const selectedWords = getRandomWords();
    const randomTarget = selectedWords[Math.floor(Math.random() * selectedWords.length)];
    setCurrentWords(selectedWords);
    setTargetWord(randomTarget);
    setShowFeedback(false);
    setGameStarted(true);

    // Play the first word after user interaction
    setTimeout(() => {
      const audio = new Audio(`/audio/${randomTarget}.mp3`);
      audio.play().catch((error) => console.log('Audio play failed:', error));
    }, 500);
  };

  // Handle image selection
  const handleImageClick = (selectedWord) => {
    const correct = selectedWord === targetWord;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    // Set up next round after a delay
    setTimeout(() => {
      setupNewRound();
    }, 1500);
  };

  // Function to replay audio
  const replayAudio = () => {
    if (targetWord) {
      const audio = new Audio(`audio/${targetWord}.mp3`);
      audio.play();
    }
  };

  if (!gameStarted)
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <button onClick={startGame} className="bg-green-500 text-white px-8 py-4 rounded-full text-2xl font-semibold hover:bg-green-600 transition-colors">
            Start Game
          </button>
        </div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-600">Score: {score}</h2>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-2 gap-5 md:gap-10 mb-8">
          {currentWords.map((word, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(word)}
              className={`relative aspect-square rounded-xl max-w-50 border-2 border-gray-200 p-3 cursor-pointer bg-white overflow-hidden transform transition-transform hover:scale-105 ${
                showFeedback && word === targetWord ? (isCorrect ? 'ring-4 ring-green-500' : 'ring-4 ring-red-500') : 'hover:ring-4 hover:ring-blue-500'
              }`}
              disabled={showFeedback}>
              <img src={`/images/${word}.png`} alt={word} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={replayAudio}
          className='px-6 py-3 rounded-full text-xl font-semibold transition-colors bg-blue-500 text-white hover:bg-blue-600'>
          🔊 Listen Again
        </button>
      </div>

      {showFeedback && (
        <div className={`fixed inset-x-0 top-4 mx-auto w-64 p-4 rounded-lg text-center text-white text-2xl font-bold ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
          {isCorrect ? '✨ Correct! ✨' : '❌ Try Again! ❌'}
        </div>
      )}
    </div>
  );
};

export default WordGame;
