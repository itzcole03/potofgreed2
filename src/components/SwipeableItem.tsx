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
  const lastX = useRef(0);

  const SWIPE_THRESHOLD = 60;
  const DELETE_BUTTON_WIDTH = 80;

  // Touch event handlers
  const handleStart = (clientX: number) => {
    startX.current = clientX;
    lastX.current = clientX;
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;

    const diffX = startX.current - clientX;
    const deltaX = lastX.current - clientX;
    lastX.current = clientX;

    // Only allow left swipe (positive diffX)
    if (diffX > 0) {
      const newTranslateX = Math.min(diffX, DELETE_BUTTON_WIDTH);
      setTranslateX(newTranslateX);
    } else {
      setTranslateX(0);
    }
  };

  const handleEnd = () => {
    if (!isDragging) return;

    const swipeDistance = translateX;

    // Show delete if swiped past threshold
    if (swipeDistance > SWIPE_THRESHOLD) {
      setTranslateX(DELETE_BUTTON_WIDTH);
      setShowDelete(true);
    } else {
      // Snap back
      setTranslateX(0);
      setShowDelete(false);
    }

    setIsDragging(false);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (isDragging) {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    handleEnd();
  };

  // Mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX);
    };

    const handleMouseUp = () => {
      handleEnd();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
    setTranslateX(0);
    setShowDelete(false);
  };

  const resetSwipe = () => {
    setTranslateX(0);
    setShowDelete(false);
  };

  // Click outside to close
  useEffect(() => {
    const handleGlobalTouch = (e: TouchEvent) => {
      if (
        itemRef.current &&
        !itemRef.current.contains(e.target as Node) &&
        showDelete
      ) {
        resetSwipe();
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      if (
        itemRef.current &&
        !itemRef.current.contains(e.target as Node) &&
        showDelete
      ) {
        resetSwipe();
      }
    };

    if (showDelete) {
      document.addEventListener("touchstart", handleGlobalTouch);
      document.addEventListener("click", handleGlobalClick);
      return () => {
        document.removeEventListener("touchstart", handleGlobalTouch);
        document.removeEventListener("click", handleGlobalClick);
      };
    }
  }, [showDelete]);

  return (
    <div className="relative overflow-hidden rounded-lg bg-slate-800">
      {/* Delete Button Background */}
      <div
        className={`absolute inset-0 bg-red-500 flex items-center justify-end pr-2 transition-all duration-200 ${
          showDelete ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-1 shadow-lg min-w-[70px] justify-center"
        >
          <Trash2 className="w-4 h-4" />
          <span className="font-medium text-xs">{deleteText}</span>
        </button>
      </div>

      {/* Main Content */}
      <div
        ref={itemRef}
        className={`relative transition-transform duration-200 ${
          isDragging ? "transition-none" : ""
        } ${showDelete ? "" : "bg-slate-800"}`}
        style={{
          transform: `translateX(-${translateX}px)`,
          touchAction: "pan-y",
          userSelect: "none",
          WebkitUserSelect: "none",
          msUserSelect: "none",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {children}
      </div>

      {/* Swipe Hint */}
      {!showDelete && translateX === 0 && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/30 text-xs pointer-events-none">
          ← Swipe
        </div>
      )}
    </div>
  );
};

export default SwipeableItem;
