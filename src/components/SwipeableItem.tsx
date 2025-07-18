import React, { useState, useRef, useEffect } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startTime = useRef(0);

  const SWIPE_THRESHOLD = 80;
  const DELETE_BUTTON_WIDTH = 100;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startTime.current = Date.now();
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;

    const currentX = e.touches[0].clientX;
    const diffX = startX.current - currentX;

    // Only allow left swipe (positive diffX)
    if (diffX > 0) {
      const newTranslateX = Math.min(diffX, DELETE_BUTTON_WIDTH);
      setTranslateX(newTranslateX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const swipeDistance = translateX;
    const swipeTime = Date.now() - startTime.current;
    const swipeVelocity = swipeDistance / swipeTime;

    // Show delete if swiped past threshold or fast swipe
    if (swipeDistance > SWIPE_THRESHOLD || swipeVelocity > 0.3) {
      setTranslateX(DELETE_BUTTON_WIDTH);
      setShowDelete(true);
    } else {
      // Snap back
      setTranslateX(0);
      setShowDelete(false);
    }

    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    startTime.current = Date.now();
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const diffX = startX.current - currentX;

    if (diffX > 0) {
      const newTranslateX = Math.min(diffX, DELETE_BUTTON_WIDTH);
      setTranslateX(newTranslateX);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const swipeDistance = translateX;
    const swipeTime = Date.now() - startTime.current;
    const swipeVelocity = swipeDistance / swipeTime;

    if (swipeDistance > SWIPE_THRESHOLD || swipeVelocity > 0.3) {
      setTranslateX(DELETE_BUTTON_WIDTH);
      setShowDelete(true);
    } else {
      setTranslateX(0);
      setShowDelete(false);
    }

    setIsDragging(false);
  };

  const handleDelete = () => {
    onDelete();
    setTranslateX(0);
    setShowDelete(false);
  };

  const handleClickOutside = () => {
    if (showDelete) {
      setTranslateX(0);
      setShowDelete(false);
    }
  };

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (itemRef.current && !itemRef.current.contains(e.target as Node)) {
        handleClickOutside();
      }
    };

    if (showDelete) {
      document.addEventListener("click", handleGlobalClick);
      return () => document.removeEventListener("click", handleGlobalClick);
    }
  }, [showDelete]);

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Delete Button Background */}
      <div
        className="absolute inset-0 bg-red-500 flex items-center justify-end pr-4 transition-opacity duration-200"
        style={{
          opacity: showDelete ? 1 : 0,
        }}
      >
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg transition-colors duration-200 flex items-center space-x-2 shadow-lg"
        >
          <Trash2 className="w-5 h-5" />
          <span className="font-medium text-sm">{deleteText}</span>
        </button>
      </div>

      {/* Main Content */}
      <div
        ref={itemRef}
        className={`relative bg-slate-800 transition-transform duration-200 ${
          isDragging ? "transition-none" : ""
        }`}
        style={{
          transform: `translateX(-${translateX}px)`,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {children}
      </div>

      {/* Swipe Hint */}
      {!showDelete && translateX === 0 && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/30 text-xs pointer-events-none">
          ← Swipe to delete
        </div>
      )}
    </div>
  );
};

export default SwipeableItem;
