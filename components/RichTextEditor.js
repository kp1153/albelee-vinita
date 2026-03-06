'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';

export default function RichTextEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false }),
      Youtube.configure({ controls: true }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const btn = (action, label, active) => (
    <button
      type="button"
      onClick={action}
      className={`px-2 py-1 rounded text-sm font-medium ${active ? 'bg-amber-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
    >
      {label}
    </button>
  );

  const addLink = () => {
    const url = prompt('Enter URL');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const addYoutube = () => {
    const url = prompt('Enter YouTube URL');
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const colors = ['#000000', '#dc2626', '#2563eb', '#16a34a', '#d97706', '#9333ea'];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-300">
        {btn(() => editor.chain().focus().toggleBold().run(), 'B', editor.isActive('bold'))}
        {btn(() => editor.chain().focus().toggleItalic().run(), 'I', editor.isActive('italic'))}
        {btn(() => editor.chain().focus().toggleStrike().run(), 'S', editor.isActive('strike'))}
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2', editor.isActive('heading', { level: 2 }))}
        {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3', editor.isActive('heading', { level: 3 }))}
        {btn(() => editor.chain().focus().toggleBulletList().run(), '• List', editor.isActive('bulletList'))}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), '1. List', editor.isActive('orderedList'))}
        {btn(() => editor.chain().focus().toggleBlockquote().run(), '❝', editor.isActive('blockquote'))}
        {btn(addLink, '🔗 Link', editor.isActive('link'))}
        {btn(addYoutube, '▶ YouTube', false)}
        <div className="flex gap-1 items-center ml-1">
          {colors.map(color => (
            <button
              key={color}
              type="button"
              onClick={() => editor.chain().focus().setColor(color).run()}
              className="w-5 h-5 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
      <EditorContent
        editor={editor}
        className="p-3 min-h-[200px] prose max-w-none focus:outline-none"
      />
    </div>
  );
}