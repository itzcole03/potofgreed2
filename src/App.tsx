import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Coins,
  Flame,
  Zap,
  Target,
  Skull,
  Trophy,
  AlertTriangle,
} from "lucide-react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import InstallPrompt from "./components/InstallPrompt";
import NumpadKeyboard from "./components/NumpadKeyboard";
import BetItem from "./components/BetItem";

interface Bet {
  id: number;
  amount: number;
  status: "pending" | "win" | "loss";
}

function App() {
  const [currentBet, setCurrentBet] = useState("");
  const [bets, setBets] = useLocalStorage<Bet[]>("bet-tracker-bets", []);
  const [nextId, setNextId] = useLocalStorage<number>("bet-tracker-next-id", 1);
  const [showLossGif, setShowLossGif] = useState(false);
  const [showWinGif, setShowWinGif] = useState(false);
  const [showNumpad, setShowNumpad] = useState(false);

  const addBet = () => {
    const betAmount = parseFloat(currentBet);
    if (betAmount && betAmount > 0) {
      setBets((prev) => [
        ...prev,
        {
          id: nextId,
          amount: betAmount,
          status: "pending",
        },
      ]);
      setNextId((prev) => prev + 1);
      setCurrentBet("");
    }
  };

  const deleteBet = (id: number) => {
    setBets((prev) => prev.filter((bet) => bet.id !== id));
  };

  const updateBetStatus = (id: number, status: "win" | "loss") => {
    setBets((prev) =>
      prev.map((bet) => (bet.id === id ? { ...bet, status } : bet)),
    );

    // Show GIF animation for losses
    if (status === "loss") {
      setShowLossGif(true);

      // Hide after 2 seconds to restart the GIF
      setTimeout(() => {
        setShowLossGif(false);

        // Show again immediately to restart the animation
        setTimeout(() => {
          setShowLossGif(true);

          // Hide after another 2 seconds (total 4 seconds)
          setTimeout(() => {
            setShowLossGif(false);
          }, 2000);
        }, 50);
      }, 2000);
    }

    // Show GIF animation for wins
    if (status === "win") {
      setShowWinGif(true);

      // Hide after 3 seconds to restart the GIF (to capture end of animation)
      setTimeout(() => {
        setShowWinGif(false);

        // Show again immediately to restart the animation
        setTimeout(() => {
          setShowWinGif(true);

          // Hide after another 3 seconds (total 6 seconds)
          setTimeout(() => {
            setShowWinGif(false);
          }, 3000);
        }, 50);
      }, 3000);
    }
  };

  const totalLosses = bets
    .filter((bet) => bet.status === "loss")
    .reduce((sum, bet) => sum + bet.amount, 0);

  const totalProfit = bets
    .filter((bet) => bet.status === "win")
    .reduce((sum, bet) => sum + bet.amount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addBet();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start p-4 safe-area-top safe-area-bottom safe-area-left safe-area-right">
      <div className="max-w-2xl w-full space-y-4 md:space-y-8">
        {/* Net Result - Directly Above Image */}
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="relative">
              {/* Base pot shape */}
              <div
                className={`w-16 h-16 rounded-full border-4 transition-all duration-500 ${
                  totalProfit - totalLosses > 0
                    ? "bg-green-100 border-green-400"
                    : totalProfit - totalLosses < 0
                      ? "bg-red-100 border-red-400"
                      : "bg-yellow-100 border-yellow-400"
                }`}
              >
                {/* Split face based on net result */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {totalProfit - totalLosses > 0 ? (
                    // Trophy for profit
                    <Trophy className="w-8 h-8 text-green-600 animate-bounce" />
                  ) : totalProfit - totalLosses < 0 ? (
                    // Skull for loss
                    <Skull className="w-8 h-8 text-red-600 animate-pulse" />
                  ) : (
                    // Target for break-even
                    <Target className="w-8 h-8 text-yellow-600" />
                  )}
                </div>
              </div>

              {/* Floating effect indicators */}
              {totalProfit - totalLosses > 0 && (
                <div className="absolute -top-2 -right-2">
                  <Zap className="w-6 h-6 text-green-500 animate-pulse" />
                </div>
              )}
              {totalProfit - totalLosses < 0 && (
                <div className="absolute -top-2 -right-2">
                  <AlertTriangle className="w-6 h-6 text-red-500 animate-pulse" />
                </div>
              )}
            </div>
          </div>
          <p className="text-white/60 text-xs md:text-sm font-medium mb-2">
            Net Result
          </p>
          <p
            className={`text-2xl md:text-3xl font-bold ${
              totalProfit - totalLosses >= 0 ? "text-green-300" : "text-red-300"
            }`}
          >
            {formatCurrency(totalProfit - totalLosses)}
          </p>
        </div>

        {/* Image - Mobile Optimized */}
        <div className="flex justify-center mb-4">
          <img
            src={
              showLossGif
                ? "https://cdn.builder.io/o/assets%2F6f818f1145f44c66b26bf3701c0e4bb7%2Fa694ffa0ddef433cab03f6631c1615e9?alt=media&token=51d89a31-af35-4722-9840-6d9a2ac308d1&apiKey=6f818f1145f44c66b26bf3701c0e4bb7"
                : showWinGif
                  ? "https://cdn.builder.io/o/assets%2F6f818f1145f44c66b26bf3701c0e4bb7%2Fafda5189518b40a0b0daac5b21aed983?alt=media&token=15d4c55d-a753-49a5-8fc9-4c9d7d7078e9&apiKey=6f818f1145f44c66b26bf3701c0e4bb7"
                  : "/potofgreed-removebg-preview.png"
            }
            alt={
              showLossGif
                ? "Loss Animation"
                : showWinGif
                  ? "Win Animation"
                  : "Pot of Greed"
            }
            className="w-48 h-48 md:w-80 md:h-80 object-contain"
          />
        </div>

        {/* Stats Row - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-4 md:flex md:justify-between md:items-center">
          {/* Losses */}
          <div className="flex items-center space-x-2 md:space-x-3 bg-slate-800 p-3 rounded-lg">
            <div className="relative">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-red-600/20 rounded-full flex items-center justify-center border-2 border-red-500">
                <TrendingDown className="w-4 h-4 md:w-6 md:h-6 text-red-400 animate-pulse" />
              </div>
            </div>
            <div>
              <p className="text-red-400 text-xs md:text-sm font-medium">
                Losses
              </p>
              <p className="text-red-300 text-lg md:text-2xl font-bold">
                {formatCurrency(totalLosses)}
              </p>
            </div>
          </div>

          {/* Profit */}
          <div className="flex items-center space-x-2 md:space-x-3 bg-slate-800 p-3 rounded-lg">
            <div className="relative">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-green-600/20 rounded-full flex items-center justify-center border-2 border-green-500">
                <TrendingUp className="w-4 h-4 md:w-6 md:h-6 text-green-400 animate-bounce" />
              </div>
            </div>
            <div>
              <p className="text-green-400 text-xs md:text-sm font-medium">
                Profit
              </p>
              <p className="text-green-300 text-lg md:text-2xl font-bold">
                {formatCurrency(totalProfit)}
              </p>
            </div>
          </div>
        </div>

        {/* Current Bet Input */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <span className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-white/60 text-base md:text-lg">
                $
              </span>
              <input
                type="text"
                inputMode="none"
                value={currentBet}
                onChange={(e) => setCurrentBet(e.target.value)}
                onFocus={() => setShowNumpad(true)}
                onKeyPress={handleKeyPress}
                placeholder="Enter bet amount"
                className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-3 md:py-4 bg-slate-800 border border-slate-600 rounded-lg text-white text-base md:text-lg placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                readOnly
              />
            </div>
            <button
              onClick={addBet}
              disabled={!currentBet || parseFloat(currentBet) <= 0}
              className="px-4 md:px-6 py-3 md:py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/30 disabled:cursor-not-allowed text-white font-semibold text-base md:text-lg rounded-lg transition-all duration-200"
            >
              Add Bet
            </button>
          </div>

          {/* Stored Bets */}
          {bets.length > 0 && (
            <div className="space-y-2 md:space-y-3 max-h-64 md:max-h-80 overflow-y-auto">
              {[...bets].reverse().map((bet) => (
                <BetItem
                  key={bet.id}
                  bet={bet}
                  onDelete={deleteBet}
                  onUpdateStatus={updateBetStatus}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Numpad Keyboard */}
      {showNumpad && (
        <NumpadKeyboard
          value={currentBet}
          onChange={setCurrentBet}
          onClose={() => setShowNumpad(false)}
        />
      )}

      <InstallPrompt />
    </div>
  );
}

export default App;
