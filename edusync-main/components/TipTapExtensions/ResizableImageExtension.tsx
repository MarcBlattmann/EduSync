import { Node, mergeAttributes } from '@tiptap/core';
import { NodeViewWrapper } from '@tiptap/react';
import React, { useState } from 'react';

interface ImageAttributes {
  src: string;
  alt?: string;
  width?: string;
}

const ResizableImageComponent = ({ node, updateAttributes }: any) => {
  const [width, setWidth] = useState(node.attrs.width || '100%');
  const [isResizing, setIsResizing] = useState(false);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);

    const startWidth = parseInt(width);
    const startX = e.pageX;

    const handleResize = (e: MouseEvent) => {
      const currentX = e.pageX;
      const diff = currentX - startX;
      const newWidth = Math.max(100, startWidth + diff);
      setWidth(`${newWidth}px`);
      updateAttributes({ width: `${newWidth}px` });
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
    <NodeViewWrapper>
      <div className="resizable-image-wrapper" contentEditable={false}>
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          style={{ width, height: 'auto' }}
        />
        <div 
          className="resize-handle" 
          onMouseDown={handleResizeStart}
          style={{ opacity: isResizing ? 1 : undefined }}
        />
      </div>
    </NodeViewWrapper>
  );
};

export const ResizableImage = Node.create({
  name: 'resizableImage',
  group: 'block',
  inline: false,
  draggable: true,

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
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ({ node, updateAttributes }) => (
      <ResizableImageComponent node={node} updateAttributes={updateAttributes} />
    );
  },
});
