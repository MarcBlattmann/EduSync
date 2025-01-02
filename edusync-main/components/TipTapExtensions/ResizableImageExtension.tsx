import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface ImageResizeComponentProps {
  node: any;
  updateAttributes: (attrs: any) => void;
}

const ImageResizeComponent: React.FC<ImageResizeComponentProps> = ({ node, updateAttributes }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(node.attrs.width || 100);
  const [isResizing, setIsResizing] = useState(false);
  const startPosRef = useRef<{ x: number; width: number }>({ x: 0, width: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    startPosRef.current = {
      x: e.clientX,
      width: rect.width,
    };
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;

    const currentX = e.clientX;
    const initialX = startPosRef.current.x;
    const initialWidth = startPosRef.current.width;
    const parentWidth = containerRef.current.parentElement?.offsetWidth || initialWidth;
    
    const diffX = currentX - initialX;
    const newWidth = Math.min(100, Math.max(10, 
      ((initialWidth + diffX) / parentWidth) * 100
    ));

    // Snap to 100% when close
    const snappedWidth = Math.abs(newWidth - 100) < 5 ? 100 : newWidth;
    setWidth(snappedWidth);
    updateAttributes({ width: snappedWidth });
  }, [isResizing, updateAttributes]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <NodeViewWrapper className="image-wrapper">
      <div 
        ref={containerRef}
        className={`resizable-image-container ${isResizing ? 'is-resizing' : ''}`}
        style={{ width: `${width}%` }}
      >
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          style={{ width: '100%' }}
          draggable={false}
        />
        <div className="resize-handles">
          <div 
            className="resize-handle left" 
            onMouseDown={handleMouseDown}
            onTouchStart={() => {}} // Prevent touch events from interfering
          />
          <div 
            className="resize-handle right" 
            onMouseDown={handleMouseDown}
            onTouchStart={() => {}} // Prevent touch events from interfering
          />
        </div>
        {isResizing && (
          <div className="resize-info">{Math.round(width)}%</div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export const ResizableImageExtension = Image.extend({
  name: 'resizableImage',

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: 100,
        renderHTML: attributes => ({
          style: `width: ${attributes.width}%`,
        }),
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageResizeComponent);
  },
});
