import { mergeAttributes, Node } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React, { useState } from 'react';

const ImageResizeComponent = ({ node, updateAttributes }: any) => {
  const [width, setWidth] = useState(node.attrs.width || '100%');
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startWidth = parseInt(width as string);
    const startX = e.pageX;

    const handleResize = (e: MouseEvent) => {
      const currentX = e.pageX;
      const diff = currentX - startX;
      const newWidth = Math.max(100, startWidth + diff);
      const widthStr = `${newWidth}px`;
      setWidth(widthStr);
      updateAttributes({ width: widthStr });
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleResizeEnd);
    };

    window.addEventListener('mousemove', handleResize);
    window.addEventListener('mouseup', handleResizeEnd);
  };

  return (
    <NodeViewWrapper className="resizable-image-wrapper">
      <div contentEditable={false}>
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          style={{ width, display: 'block' }}
          draggable={false}
        />
        <div 
          className="resize-handle"
          onMouseDown={handleResizeStart}
          contentEditable={false}
        />
      </div>
    </NodeViewWrapper>
  );
};

export const ResizableImage = Node.create({
  name: 'resizableImage',
  group: 'block',
  inline: false,
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      width: {
        default: '100%',
        renderHTML: attributes => ({
          width: attributes.width,
        }),
      },
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
          width: dom.style.width || '100%',
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
