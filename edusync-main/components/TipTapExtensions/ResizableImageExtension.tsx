import Image from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import React, { useCallback, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

const ResizableImageComponent = ({ node, updateAttributes }: any) => {
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(node.attrs.width);

  const onResize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const container = (e.target as HTMLElement).closest('.image-container');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const parentWidth = container.parentElement?.clientWidth || rect.width;
    const relativeX = e.pageX - rect.left;
    const newWidth = Math.max(10, Math.min(100, (relativeX / parentWidth) * 100));

    setWidth(`${newWidth}%`);
    updateAttributes({ width: `${newWidth}%` });
  }, [isResizing, updateAttributes]);

  const onResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.addEventListener('mousemove', onResize);
    document.addEventListener('mouseup', onResizeEnd);
  }, [onResize]);

  const onResizeEnd = useCallback(() => {
    setIsResizing(false);
    document.removeEventListener('mousemove', onResize);
    document.removeEventListener('mouseup', onResizeEnd);
  }, [onResize]);

  return (
    <NodeViewWrapper>
      <div className={`image-container ${isResizing ? 'is-resizing' : ''}`}>
        <img
          src={node.attrs.src}
          alt={node.attrs.alt}
          style={{ width: width }}
          draggable={false}
        />
        <div className="resize-handle" onMouseDown={onResizeStart} />
      </div>
    </NodeViewWrapper>
  );
};

export const ResizableImageExtension = Image.configure({
  inline: true,
}).extend({
  name: 'resizableImage',

  addAttributes() {
    return {
      ...Image.options.addAttributes(),
      width: {
        default: '100%',
        renderHTML: attributes => ({
          width: attributes.width,
        }),
      },
    };
  },

  addCommands() {
    return {
      setResizableImage: options => ({ commands }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]',
        getAttrs: dom => {
          if (!(dom instanceof HTMLElement)) return false;
          return {
            src: dom.getAttribute('src'),
            alt: dom.getAttribute('alt'),
            width: dom.style.width || '100%',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});

// Add type declaration for the new command
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    resizableImage: {
      setResizableImage: (options: { src: string; alt?: string; width?: string }) => ReturnType;
    };
  }
}
