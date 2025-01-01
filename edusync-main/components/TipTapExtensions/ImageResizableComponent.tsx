import React, { useCallback, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

export const ImageResizableComponent = ({ node, updateAttributes }: any) => {
  const [resizing, setResizing] = useState(false);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    const startX = event.clientX;
    const startWidth = node.attrs.width ? parseInt(node.attrs.width) : 100;

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const diffX = currentX - startX;
      const newWidth = Math.max(50, Math.min(100, startWidth + (diffX / 5)));
      updateAttributes({ width: `${newWidth}%` });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      setResizing(false);
    };

    setResizing(true);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [node.attrs.width, updateAttributes]);

  return (
    <NodeViewWrapper className="image-wrapper">
      <div className={`resizable-image-container ${resizing ? 'is-resizing' : ''}`}>
        <img
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          style={{ width: node.attrs.width || '100%' }}
          draggable={false}
        />
        <div className="resize-handle-left" onMouseDown={handleMouseDown} />
        <div className="resize-handle-right" onMouseDown={handleMouseDown} />
      </div>
    </NodeViewWrapper>
  );
};
