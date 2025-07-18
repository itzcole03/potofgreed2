import React, { useState } from "react";
import { Trash2, MoreVertical, X, Check } from "lucide-react";

interface Bet {
  id: number;
  amount: number;
  status: "pending" | "win" | "loss";
}

interface BetItemProps {
  bet: Bet;
  onDelete: (id: number) => void;
  onUpdateStatus: (id: number, status: "win" | "loss") => void;
  formatCurrency: (amount: number) => string;
}

const BetItem: React.FC<BetItemProps> = ({
  bet,
  onDelete,
  onUpdateStatus,
  formatCurrency,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
    setShowMenu(false);
  };

  const handleConfirmDelete = () => {
    onDelete(bet.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
    setShowDeleteConfirm(false);
  };

  // Long press functionality for mobile
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null,
  );

  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      setShowDeleteConfirm(true);
    }, 800); // 800ms long press
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  if (showDeleteConfirm) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 md:p-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-red-800 font-medium text-sm">
                Delete this bet?
              </p>
              <p className="text-red-600 text-xs">
                {formatCurrency(bet.amount)}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleCancelDelete}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-slate-800 rounded-lg p-3 md:p-4 relative group"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {/* Main content */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-4">
          <span className="text-white text-base md:text-lg font-medium">
            {formatCurrency(bet.amount)}
          </span>
          {bet.status !== "pending" && (
            <span
              className={`px-2 py-1 rounded text-xs md:text-sm font-medium ${
                bet.status === "win"
                  ? "bg-green-600/20 text-green-300"
                  : "bg-red-600/20 text-red-300"
              }`}
            >
              {bet.status === "win" ? "Won" : "Lost"}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-1 md:space-x-2">
          {/* Win/Loss buttons for pending bets */}
          {bet.status === "pending" && (
            <>
              <button
                onClick={() => onUpdateStatus(bet.id, "loss")}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-red-600 hover:bg-red-700 text-white font-medium text-sm md:text-base rounded transition-all duration-200"
              >
                Loss
              </button>
              <button
                onClick={() => onUpdateStatus(bet.id, "win")}
                className="px-3 md:px-4 py-1.5 md:py-2 bg-green-600 hover:bg-green-700 text-white font-medium text-sm md:text-base rounded transition-all duration-200"
              >
                Win
              </button>
            </>
          )}

          {/* Menu button - always visible but subtle */}
          <div className="relative">
            <button
              onClick={handleMenuToggle}
              className="p-2 text-white/60 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200 group-hover:text-white/80"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-slate-700 rounded-lg shadow-lg border border-slate-600 min-w-[120px] z-10">
                <button
                  onClick={handleDeleteClick}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-600 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Long press hint */}
      <div className="absolute bottom-1 right-3 text-white/20 text-xs pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        Hold to delete
      </div>

      {/* Click outside overlay to close menu */}
      {showMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />
      )}
    </div>
  );
};

export default BetItem;
