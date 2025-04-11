import { useState, useEffect, useCallback } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS, $convertToMarkdownString, $convertFromMarkdownString } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { CodeNode } from '@lexical/code';
import { ListItemNode, ListNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';

const MarkdownTogglePlugin = ({ setMarkdown, editing }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        setMarkdown($convertToMarkdownString(TRANSFORMERS));
      });
    });
  }, [editor, setMarkdown]);

  useEffect(() => {
    if (!editing) {
      editor.update(() => {
        $convertFromMarkdownString(editor.getEditorState(), TRANSFORMERS);
      });
    }
  }, [editing, editor]);

  return null;
};

export const useMarkdownEditor = (initialMarkdown = "ываыва") => {
  const [markdown, setMarkdown] = useState(initialMarkdown);

  const getMarkdown = useCallback(() => markdown, [markdown]);
  const setMarkdownContent = useCallback((newMarkdown) => setMarkdown(newMarkdown), []);

  const EditorComponent = useCallback(() => {
    const editorConfig = {
      namespace: "MarkdownEditor",
      theme: {},
      nodes: [
        HeadingNode,
        QuoteNode,
        CodeNode,
        ListNode,
        ListItemNode,
        LinkNode,
      ],
      editable: true,
      onError: (error) => console.error(error),

    };

    return (
      <div
        // onBlur={() => setEditing(false)}
        className="border p-2 rounded-md"
      >
        <LexicalComposer initialConfig={editorConfig}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400" />
              }
              placeholder={<>
                <p className="text-gray-400">• What I liked about this card</p>
                <p className="text-gray-400">• What I didn't like about this card.</p>
                <p className="text-gray-400">• Who is this card perfect for?</p>
              </>}
            />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <MarkdownTogglePlugin setMarkdown={setMarkdown} editing={true} />
        </LexicalComposer>
      </div>
    );
  }, []);

  return { EditorComponent, getMarkdown, setMarkdownContent };
};