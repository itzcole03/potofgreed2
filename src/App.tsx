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

  const updateBetStatus = (id: number, status: "win" | "loss") => {
    setBets((prev) =>
      prev.map((bet) => (bet.id === id ? { ...bet, status } : bet)),
    );

    // Show GIF animation for losses
    if (status === "loss") {
      setShowLossGif(true);
      // Return to original image after 3 seconds
      setTimeout(() => {
        setShowLossGif(false);
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
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full space-y-8">
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
          <p className="text-white/60 text-sm font-medium mb-2">Net Result</p>
          <p
            className={`text-3xl font-bold ${
              totalProfit - totalLosses >= 0 ? "text-green-300" : "text-red-300"
            }`}
          >
            {formatCurrency(totalProfit - totalLosses)}
          </p>
        </div>

        {/* Stats Row with Image in Center */}
        <div className="flex justify-between items-center">
          {/* Losses */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-red-600/20 rounded-full flex items-center justify-center border-2 border-red-500">
                <TrendingDown className="w-6 h-6 text-red-400 animate-pulse" />
              </div>
            </div>
            <div>
              <p className="text-red-400 text-sm font-medium">Losses</p>
              <p className="text-red-300 text-2xl font-bold">
                {formatCurrency(totalLosses)}
              </p>
            </div>
          </div>

          {/* Image - Extra Large and Centered */}
          <div className="flex justify-center">
            <img
              src={
                showLossGif
                  ? "/Untitled video - Made with Clipchamp.gif"
                  : "/potofgreed-removebg-preview.png"
              }
              alt={showLossGif ? "Loss Animation" : "Pot of Greed"}
              className="w-80 h-80 object-contain"
            />
          </div>

          {/* Profit */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center border-2 border-green-500">
                <TrendingUp className="w-6 h-6 text-green-400 animate-bounce" />
              </div>
            </div>
            <div>
              <p className="text-green-400 text-sm font-medium">Profit</p>
              <p className="text-green-300 text-2xl font-bold">
                {formatCurrency(totalProfit)}
              </p>
            </div>
          </div>
        </div>

        {/* Current Bet Input */}
        <div className="space-y-6">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 text-lg">
                $
              </span>
              <input
                type="number"
                value={currentBet}
                onChange={(e) => setCurrentBet(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter bet amount"
                className="w-full pl-10 pr-4 py-4 bg-slate-800 border border-slate-600 rounded-lg text-white text-lg placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                step="0.01"
                min="0"
              />
            </div>
            <button
              onClick={addBet}
              disabled={!currentBet || parseFloat(currentBet) <= 0}
              className="px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/30 disabled:cursor-not-allowed text-white font-semibold text-lg rounded-lg transition-all duration-200"
            >
              Add Bet
            </button>
          </div>

          {/* Stored Bets */}
          {bets.length > 0 && (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {bets.map((bet) => (
                <div
                  key={bet.id}
                  className="flex items-center justify-between bg-slate-800 rounded-lg p-4"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-white text-lg font-medium">
                      {formatCurrency(bet.amount)}
                    </span>
                    {bet.status !== "pending" && (
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${
                          bet.status === "win"
                            ? "bg-green-600/20 text-green-300"
                            : "bg-red-600/20 text-red-300"
                        }`}
                      >
                        {bet.status === "win" ? "Won" : "Lost"}
                      </span>
                    )}
                  </div>

                  {bet.status === "pending" && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateBetStatus(bet.id, "loss")}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded transition-all duration-200"
                      >
                        Loss
                      </button>
                      <button
                        onClick={() => updateBetStatus(bet.id, "win")}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded transition-all duration-200"
                      >
                        Win
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
