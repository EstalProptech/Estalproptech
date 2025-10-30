import { useEffect, useRef, useState } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // minimum distance for a swipe
  preventDefaultTouchMove?: boolean;
}

export function useSwipeGesture<T extends HTMLElement = HTMLDivElement>(
  options: SwipeGestureOptions
) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefaultTouchMove = false,
  } = options;

  const ref = useRef<T>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      setTouchEnd(null);
      setTouchStart({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
      setIsSwiping(true);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (preventDefaultTouchMove) {
        e.preventDefault();
      }
      setTouchEnd({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    };

    const handleTouchEnd = () => {
      if (!touchStart || !touchEnd) {
        setIsSwiping(false);
        return;
      }

      const distanceX = touchStart.x - touchEnd.x;
      const distanceY = touchStart.y - touchEnd.y;
      const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
      const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

      if (isHorizontalSwipe) {
        if (distanceX > threshold) {
          // Swipe left
          onSwipeLeft?.();
          // Haptic feedback
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(10);
          }
        } else if (distanceX < -threshold) {
          // Swipe right
          onSwipeRight?.();
          // Haptic feedback
          if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
            navigator.vibrate(10);
          }
        }
      }

      if (isVerticalSwipe) {
        if (distanceY > threshold) {
          // Swipe up
          onSwipeUp?.();
        } else if (distanceY < -threshold) {
          // Swipe down
          onSwipeDown?.();
        }
      }

      setIsSwiping(false);
      setTouchStart(null);
      setTouchEnd(null);
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchmove', handleTouchMove);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [touchStart, touchEnd, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, preventDefaultTouchMove]);

  return { ref, isSwiping };
}
