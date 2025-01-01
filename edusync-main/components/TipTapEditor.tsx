'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Image from '@tiptap/extension-image';

import { useCallback } from 'react';

interface TipTapEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading,
      Bold,
      Italic,
      Strike,
      BulletList,
      OrderedList,
      ListItem,
      Code,
      CodeBlock,
      Image.configure({
        inline: true,
        HTMLAttributes: {
          class: 'resizable-image',
        },
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="tiptap-container">
      <div className="tiptap-toolbar">
        <div className="toolbar-group">
          <select
            className="heading-select"
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'paragraph') {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level: parseInt(value) }).run();
              }
            }}
            value={
              editor.isActive('heading', { level: 1 })
                ? '1'
                : editor.isActive('heading', { level: 2 })
                ? '2'
                : editor.isActive('heading', { level: 3 })
                ? '3'
                : editor.isActive('heading', { level: 4 })
                ? '4'
                : 'paragraph'
            }
          >
            <option value="paragraph">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
          </select>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`toolbar-button ${editor.isActive('bold') ? 'is-active' : ''}`}
          >
            B
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`toolbar-button ${editor.isActive('italic') ? 'is-active' : ''}`}
          >
            I
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`toolbar-button ${editor.isActive('strike') ? 'is-active' : ''}`}
          >
            S
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`toolbar-button ${editor.isActive('bulletList') ? 'is-active' : ''}`}
          >
            •
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`toolbar-button ${editor.isActive('orderedList') ? 'is-active' : ''}`}
          >
            1.
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`toolbar-button ${editor.isActive('code') ? 'is-active' : ''}`}
          >
            {'</>'}
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={addImage}
            className="toolbar-button"
          >
            🖼️
          </button>
        </div>
      </div>
      <EditorContent editor={editor} className="tiptap-editor" />
    </div>
  );
}
