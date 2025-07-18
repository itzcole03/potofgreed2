import React, { useState, useRef } from "react";
import { Trash2 } from "lucide-react";

interface SwipeableItemProps {
  children: React.ReactNode;
  onDelete: () => void;
  deleteText?: string;
}

const SwipeableItem: React.FC<SwipeableItemProps> = ({
  children,
  onDelete,
  deleteText = "Delete",
}) => {
  const [translateX, setTranslateX] = useState(0);
  const [swiped, setSwiped] = useState(false);
  const startX = useRef<number>(0);
  const currentX = useRef<number>(0);

  const SWIPE_THRESHOLD = 50;
  const MAX_TRANSLATE = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    currentX.current = e.touches[0].clientX;
    const diff = startX.current - currentX.current;

    if (diff > 0 && diff <= MAX_TRANSLATE) {
      setTranslateX(diff);
    }
  };

  const handleTouchEnd = () => {
    const totalSwipe = startX.current - currentX.current;

    if (totalSwipe > SWIPE_THRESHOLD) {
      setTranslateX(MAX_TRANSLATE);
      setSwiped(true);
    } else {
      setTranslateX(0);
      setSwiped(false);
    }
  };

  const handleDelete = () => {
    onDelete();
    setTranslateX(0);
    setSwiped(false);
  };

  const handleReset = () => {
    setTranslateX(0);
    setSwiped(false);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Red background with delete button */}
      <div className="absolute inset-0 bg-red-500 flex items-center justify-end pr-4">
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>{deleteText}</span>
        </button>
      </div>

      {/* Main content that slides */}
      <div
        className="bg-slate-800 transition-transform duration-200 ease-out relative"
        style={{
          transform: `translateX(-${translateX}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>

      {/* Reset overlay when swiped */}
      {swiped && (
        <div className="absolute inset-0 z-10" onClick={handleReset} />
      )}

      {/* Hint text */}
      {!swiped && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 text-xs pointer-events-none">
          ← Swipe
        </div>
      )}
    </div>
  );
};

export default SwipeableItem;
