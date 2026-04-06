import { useState, useEffect, useCallback, useLayoutEffect } from 'react';

const NO_DRAG_SELECTOR = 'button, input, select, textarea, a, [data-no-drag]';

/**
 * 极简弹窗拖拽 Hook
 * @param {Object} ref - 弹窗元素的 ref
 * @param {Object} handleRef - 拖拽句柄（通常是 header）的 ref
 * @param {boolean} isOpen - 弹窗是否打开，用于重置位置
 */
export function useDraggable(ref, handleRef, isOpen = true) {
  const [position, setPosition] = useState({ left: 0, top: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const clampPosition = useCallback((nextPosition) => {
    const element = ref.current;
    if (!element || typeof window === 'undefined') {
      return nextPosition;
    }

    const rect = element.getBoundingClientRect();
    const maxLeft = Math.max(16, window.innerWidth - rect.width - 16);
    const maxTop = Math.max(16, window.innerHeight - rect.height - 16);

    return {
      left: Math.min(maxLeft, Math.max(16, nextPosition.left)),
      top: Math.min(maxTop, Math.max(16, nextPosition.top))
    };
  }, [ref]);

  const centerPosition = useCallback(() => {
    const element = ref.current;
    if (!element || typeof window === 'undefined') {
      return { left: 16, top: 16 };
    }

    const rect = element.getBoundingClientRect();
    return clampPosition({
      left: (window.innerWidth - rect.width) / 2,
      top: (window.innerHeight - rect.height) / 2
    });
  }, [ref, clampPosition]);

  const onMouseDown = useCallback((e) => {
    if (!handleRef.current || !handleRef.current.contains(e.target)) {
      return;
    }

    if (e.target instanceof Element && e.target.closest(NO_DRAG_SELECTOR)) {
      return;
    }

    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.left,
      y: e.clientY - position.top
    });
    e.preventDefault();
  }, [handleRef, position]);

  const onMouseMove = useCallback((e) => {
    if (isDragging) {
      setPosition(clampPosition({
        left: e.clientX - dragStart.x,
        top: e.clientY - dragStart.y
      }));
    }
  }, [isDragging, dragStart, clampPosition]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setPosition(centerPosition());
      setIsDragging(false);
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen, centerPosition]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleResize = () => {
      setPosition((current) => clampPosition(current));
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, clampPosition]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  return {
    position,
    handleProps: { onMouseDown },
    style: {
      position: 'fixed',
      left: `${position.left}px`,
      top: `${position.top}px`,
      cursor: isDragging ? 'grabbing' : 'default'
    }
  };
}
