import React, { useState, useEffect } from 'react';

interface TypewriterButtonProps {
  sequences: string[];
  onClick?: (currentSequence: string) => void;
  typingSpeed?: number;
  erasingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  isRedBoldAlert?: boolean; // For Health Check Warnings (紅色粗體字)
  icon?: React.ReactNode;
  badgeText?: string;
  fixedWidthClass?: string; // Fixed width class to prevent dimension shifting
}

export const TypewriterButton: React.FC<TypewriterButtonProps> = ({
  sequences,
  onClick,
  typingSpeed = 65,
  erasingSpeed = 30,
  pauseDuration = 2200,
  className = '',
  isRedBoldAlert = true,
  icon,
  badgeText,
  fixedWidthClass = 'w-[280px] sm:w-[340px] md:w-[380px]',
}) => {
  const [currentText, setCurrentText] = useState('');
  const [seqIndex, setSeqIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!sequences || sequences.length === 0) return;

    const fullText = sequences[seqIndex % sequences.length];

    if (isPaused) {
      const timer = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
      return () => clearTimeout(timer);
    }

    if (!isDeleting) {
      // Typing mode
      if (currentText.length < fullText.length) {
        const timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Completed typing full string, pause before deleting
        setIsPaused(true);
      }
    } else {
      // Deleting mode
      if (currentText.length > 0) {
        const timer = setTimeout(() => {
          setCurrentText(fullText.slice(0, currentText.length - 1));
        }, erasingSpeed);
        return () => clearTimeout(timer);
      } else {
        // Finished deleting, move to next sequence
        setIsDeleting(false);
        setSeqIndex((prev) => (prev + 1) % sequences.length);
      }
    }
  }, [currentText, isDeleting, isPaused, seqIndex, sequences, typingSpeed, erasingSpeed, pauseDuration]);

  // Red bold alert styling logic
  const alertStyles = isRedBoldAlert
    ? 'bg-red-50 hover:bg-red-100 text-red-600 border-2 border-red-500 shadow-md shadow-red-500/20 font-extrabold focus:ring-2 focus:ring-red-400'
    : 'bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 shadow-md font-bold focus:ring-2 focus:ring-slate-500';

  return (
    <button
      onClick={() => onClick && onClick(sequences[seqIndex % sequences.length])}
      className={`relative inline-flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer overflow-hidden flex-shrink-0 h-[40px] select-none ${alertStyles} ${fixedWidthClass} ${className}`}
      title="點擊處置健檢警示"
    >
      {badgeText && (
        <span
          className={`text-[11px] px-2 py-0.5 rounded-md uppercase tracking-wider flex-shrink-0 whitespace-nowrap ${
            isRedBoldAlert
              ? 'bg-red-600 text-white font-black animate-pulse'
              : 'bg-indigo-600 text-white font-bold'
          }`}
        >
          {badgeText}
        </span>
      )}

      {icon && <span className="flex-shrink-0 animate-bounce">{icon}</span>}

      {/* Fixed text container with overflow-hidden & truncate to lock dimensions completely */}
      <div className="flex-1 min-w-0 h-full flex items-center overflow-hidden whitespace-nowrap">
        <span
          className={`text-xs sm:text-sm tracking-tight inline-flex items-center truncate ${
            isRedBoldAlert ? 'font-black text-red-600' : 'font-bold'
          }`}
        >
          <span className="truncate">{currentText}</span>
          {/* Blinking Cursor */}
          <span
            className={`ml-0.5 flex-shrink-0 inline-block w-1.5 h-3.5 ${
              isRedBoldAlert ? 'bg-red-600' : 'bg-slate-300'
            } animate-pulse`}
          />
        </span>
      </div>
    </button>
  );
};

