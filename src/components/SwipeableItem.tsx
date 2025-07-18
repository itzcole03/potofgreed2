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

  const SWIPE_THRESHOLD = 50;
  const MAX_TRANSLATE = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    console.log("Touch start detected");
    startX.current = e.touches[0].clientX;
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    console.log("Touch move detected");
    const currentX = e.touches[0].clientX;
    const diff = startX.current - currentX;

    console.log("Swipe distance:", diff);

    if (diff > 0 && diff <= MAX_TRANSLATE) {
      setTranslateX(diff);
    }
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    console.log("Touch end detected");
    const endX = e.changedTouches[0].clientX;
    const totalSwipe = startX.current - endX;

    console.log("Total swipe distance:", totalSwipe);

    if (totalSwipe > SWIPE_THRESHOLD) {
      console.log("Swipe threshold reached - showing delete");
      setTranslateX(MAX_TRANSLATE);
      setSwiped(true);
    } else {
      console.log("Swipe threshold not reached - resetting");
      setTranslateX(0);
      setSwiped(false);
    }
    e.preventDefault();
  };

  const handleDelete = () => {
    console.log("Delete button clicked");
    onDelete();
    setTranslateX(0);
    setSwiped(false);
  };

  const handleReset = () => {
    console.log("Reset clicked");
    setTranslateX(0);
    setSwiped(false);
  };

  // Also add click handlers for desktop testing
  const handleMouseDown = (e: React.MouseEvent) => {
    console.log("Mouse down detected");
    startX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      // Left mouse button is down
      console.log("Mouse drag detected");
      const diff = startX.current - e.clientX;

      if (diff > 0 && diff <= MAX_TRANSLATE) {
        setTranslateX(diff);
      }
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    console.log("Mouse up detected");
    const totalSwipe = startX.current - e.clientX;

    if (totalSwipe > SWIPE_THRESHOLD) {
      setTranslateX(MAX_TRANSLATE);
      setSwiped(true);
    } else {
      setTranslateX(0);
      setSwiped(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Red background with delete button */}
      <div className="absolute inset-0 bg-red-500 flex items-center justify-end pr-4">
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          <span className="text-sm font-medium">{deleteText}</span>
        </button>
      </div>

      {/* Main content that slides */}
      <div
        className="bg-slate-800 transition-transform duration-200 ease-out relative select-none"
        style={{
          transform: `translateX(-${translateX}px)`,
          touchAction: "pan-y",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {children}
      </div>

      {/* Reset overlay when swiped */}
      {swiped && (
        <div
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={handleReset}
        />
      )}

      {/* Hint text */}
      {!swiped && translateX === 0 && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 text-xs pointer-events-none animate-pulse">
          ← Swipe left
        </div>
      )}

      {/* Debug info */}
      {translateX > 0 && (
        <div className="absolute top-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
          Swipe: {Math.round(translateX)}px
        </div>
      )}
    </div>
  );
};

export default SwipeableItem;
