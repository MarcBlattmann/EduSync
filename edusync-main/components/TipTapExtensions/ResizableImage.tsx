import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React, { useCallback, useState, useEffect } from 'react';

const ImageResizeComponent = ({ node, updateAttributes }: any) => {
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(node.attrs.width || 'auto');
  const imageRef = React.useRef<HTMLDivElement>(null);

  const onResize = useCallback((e: MouseEvent) => {
    if (!isResizing || !imageRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    const container = imageRef.current;
    const containerRect = container.getBoundingClientRect();
    const parentWidth = container.parentElement?.clientWidth || containerRect.width;
    const minWidth = 100;
    const maxWidth = parentWidth;

    let newWidth = Math.max(minWidth, Math.min(maxWidth, e.pageX - containerRect.left));
    
    // Convert to percentage
    const widthPercentage = (newWidth / parentWidth) * 100;
    setWidth(`${widthPercentage}%`);
    updateAttributes({ width: `${widthPercentage}%` });
  }, [isResizing, updateAttributes]);

  const stopResizing = useCallback((e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(false);
  }, []);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    window.addEventListener('mousemove', onResize);
    window.addEventListener('mouseup', stopResizing);
  }, [onResize, stopResizing]);

  return (
    <NodeViewWrapper className="image-wrapper">
      <div 
        ref={imageRef}
        className="image-container" 
        style={{ width: width }}
        contentEditable={false}
      >
        <img 
          src={node.attrs.src} 
          alt={node.attrs.alt || ''} 
          style={{ width: '100%', height: 'auto' }}
          draggable={false}
        />
        <div 
          className="resize-handle"
          onMouseDown={startResizing}
          contentEditable={false}
        />
      </div>
    </NodeViewWrapper>
  );
};

export const ResizableImage = Node.create({
  name: 'resizableImage',
  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,
  
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      width: { default: '100%' },
    };
  },

  parseHTML() {
    return [{
      tag: 'img[src]',
      getAttrs: dom => {
        if (!(dom instanceof HTMLElement)) return false;
        return {
          src: dom.getAttribute('src'),
          alt: dom.getAttribute('alt'),
          width: dom.style.width,
        };
      },
    }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageResizeComponent);
  },
});
