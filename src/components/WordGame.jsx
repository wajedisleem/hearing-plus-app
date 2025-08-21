import { useState, useEffect, useCallback } from 'react';
import words from '../data/words';

const WordGame = () => {
  const [currentWords, setCurrentWords] = useState([]);
  const [targetWord, setTargetWord] = useState(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [replayAvailable, setReplayAvailable] = useState(true);

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
    setReplayAvailable(true); // Reset replay availability for new round

    // Play audio automatically
    const audio = new Audio(`audio/${randomTarget}.mp3`);
    audio.play();
  }, [getRandomWords]);

  // Initialize game
  useEffect(() => {
    setupNewRound();
  }, [setupNewRound]);

  // Handle image selection
  const handleImageClick = (selectedWord) => {
    setReplayAvailable(false);
    const correct = selectedWord === targetWord;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    // Set up next round after a delay
    setTimeout(() => {
      setupNewRound();
    }, 2500);
  };

  // Function to replay audio
  const replayAudio = () => {
    if (targetWord && replayAvailable) {
      const audio = new Audio(`audio/${targetWord}.mp3`);
      audio.play();
      setReplayAvailable(false); // Use up the replay
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Score Display */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-600">Score: {score}</h2>
      </div>

      {/* Game Grid */}
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
      {/* Replay Button */}
      <div className="text-center">
        <button
          onClick={replayAudio}
          disabled={!replayAvailable}
          className={`px-6 py-3 rounded-full text-xl font-semibold transition-colors ${replayAvailable ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
          🔊 Listen Again
        </button>
      </div>

      {/* Feedback Message */}
      {showFeedback && (
        <div className={`fixed inset-x-0 top-4 mx-auto w-64 p-4 rounded-lg text-center text-white text-2xl font-bold ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
          {isCorrect ? '✨ Correct! ✨' : '❌ Try Again! ❌'}
        </div>
      )}
    </div>
  );
};

export default WordGame;
