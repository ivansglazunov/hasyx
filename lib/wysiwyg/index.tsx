"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createEditor, Descendant, Editor, Element as SlateElement, Transforms, Range } from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import { deserializeMd, serializeMd } from "@udecode/plate-serializer-md";

type MarkdownEditorProps = {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  minHeight?: number;
  className?: string;
};

type CustomElement = {
  type: string;
  url?: string;
  children: Descendant[];
};

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: Editor;
    Element: CustomElement;
    Text: CustomText;
  }
}

function isMarkActive(editor: Editor, mark: keyof Omit<CustomText, "text">) {
  const marks = Editor.marks(editor) as any;
  return marks ? marks[mark] === true : false;
}

function toggleMark(editor: Editor, mark: keyof Omit<CustomText, "text">) {
  const active = isMarkActive(editor, mark);
  if (active) Editor.removeMark(editor, mark);
  else Editor.addMark(editor, mark, true);
}

function isBlockActive(editor: Editor, type: string) {
  const [match] = Array.from(
    Editor.nodes(editor, {
      match: (n) => SlateElement.isElement(n) && n.type === type,
    })
  );
  return !!match;
}

function setBlockType(editor: Editor, type: string) {
  Transforms.setNodes(editor, { type });
}

function toggleList(editor: Editor, listType: "ul" | "ol") {
  const isActive = isBlockActive(editor, listType);
  Transforms.unwrapNodes(editor, {
    match: (n) => SlateElement.isElement(n) && (n.type === "ul" || n.type === "ol"),
    split: true,
  });
  const newType = isActive ? "p" : "li";
  Transforms.setNodes(editor, { type: newType });
  if (!isActive) {
    const block: CustomElement = { type: listType, children: [] } as any;
    Transforms.wrapNodes(editor, block);
  }
}

function insertLink(editor: Editor, url?: string) {
  if (!url) return;
  if (editor.selection && Range.isCollapsed(editor.selection)) {
    // Insert the URL text and make it a link
    Transforms.insertText(editor, url);
  }
  const link: CustomElement = {
    type: "a",
    url,
    children: [] as any,
  };
  Transforms.wrapNodes(editor, link, { split: true });
}

const Element = ({ attributes, children, element }: any) => {
  switch (element.type) {
    case "h1":
      return <h1 {...attributes} className="text-2xl font-bold my-2">{children}</h1>;
    case "h2":
      return <h2 {...attributes} className="text-xl font-semibold my-2">{children}</h2>;
    case "blockquote":
      return <blockquote {...attributes} className="border-l-4 pl-3 italic my-2">{children}</blockquote>;
    case "code_block":
      return (
        <pre {...attributes} className="bg-muted p-2 rounded font-mono text-sm overflow-auto">
          <code>{children}</code>
        </pre>
      );
    case "ul":
      return <ul {...attributes} className="list-disc pl-6 my-2">{children}</ul>;
    case "ol":
      return <ol {...attributes} className="list-decimal pl-6 my-2">{children}</ol>;
    case "li":
      return <li {...attributes}>{children}</li>;
    case "a":
      return (
        <a {...attributes} href={element.url} className="text-blue-500 underline" target="_blank" rel="noreferrer">
          {children}
        </a>
      );
    case "p":
    default:
      return <p {...attributes} className="my-2 leading-6">{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.code) children = <code className="bg-muted px-1 rounded font-mono text-sm">{children}</code>;
  return <span {...attributes}>{children}</span>;
};

export function MarkdownEditor({ value, onChange, placeholder, minHeight = 160, className }: MarkdownEditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), []);

  const initialValue = useMemo<Descendant[]>(() => {
    try {
      const slateValue = deserializeMd(value || "");
      if (Array.isArray(slateValue) && slateValue.length > 0) return slateValue as Descendant[];
    } catch {}
    return [
      {
        type: "p",
        children: [{ text: "" }],
      },
    ] as Descendant[];
  }, []);

  const [slateValue, setSlateValue] = useState<Descendant[]>(initialValue);
  const [internalMd, setInternalMd] = useState<string>(value || "");

  useEffect(() => {
    if (value !== internalMd) {
      try {
        const next = deserializeMd(value || "");
        setSlateValue(Array.isArray(next) && next.length > 0 ? (next as Descendant[]) : initialValue);
        setInternalMd(value || "");
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = useCallback(
    (val: Descendant[]) => {
      setSlateValue(val);
      try {
        const md = serializeMd(val as any);
        setInternalMd(md);
        onChange(md);
      } catch {
        // ignore serialization errors
      }
    },
    [onChange]
  );

  return (
    <div className={className}>
      <div className="flex items-center gap-1 border rounded-t px-2 py-1 bg-background">
        <ToolbarButton onMouseDown={(e) => { e.preventDefault(); toggleMark(editor, "bold"); }} label="B" title="Bold (Ctrl+B)" className="font-bold" />
        <ToolbarButton onMouseDown={(e) => { e.preventDefault(); toggleMark(editor, "italic"); }} label="I" title="Italic (Ctrl+I)" className="italic" />
        <ToolbarButton onMouseDown={(e) => { e.preventDefault(); toggleMark(editor, "code"); }} label="<>" title="Code" />
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton onMouseDown={(e) => { e.preventDefault(); setBlockType(editor, isBlockActive(editor, "h1") ? "p" : "h1"); }} label="H1" title="Heading 1" />
        <ToolbarButton onMouseDown={(e) => { e.preventDefault(); setBlockType(editor, isBlockActive(editor, "h2") ? "p" : "h2"); }} label="H2" title="Heading 2" />
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton onMouseDown={(e) => { e.preventDefault(); toggleList(editor, "ul"); }} label="• List" title="Bulleted list" />
        <ToolbarButton onMouseDown={(e) => { e.preventDefault(); toggleList(editor, "ol"); }} label="1. List" title="Numbered list" />
        <div className="w-px h-5 bg-border mx-1" />
        <ToolbarButton
          onMouseDown={(e) => {
            e.preventDefault();
            const url = window.prompt("Enter URL");
            if (url) insertLink(editor, url);
          }}
          label="Link"
          title="Insert link"
        />
      </div>
      <Slate editor={editor} value={slateValue} onChange={handleChange}>
        <Editable
          placeholder={placeholder}
          className="border rounded-b px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
          style={{ minHeight }}
          renderElement={(props) => <Element {...props} />}
          renderLeaf={(props) => <Leaf {...props} />}
          spellCheck
          autoFocus={false}
          onKeyDown={(event) => {
            if (!event.ctrlKey) return;
            if (event.key.toLowerCase() === "b") {
              event.preventDefault();
              toggleMark(editor, "bold");
            }
            if (event.key.toLowerCase() === "i") {
              event.preventDefault();
              toggleMark(editor, "italic");
            }
          }}
        />
      </Slate>
    </div>
  );
}

function ToolbarButton({ label, title, onMouseDown, className }: { label: string; title?: string; onMouseDown: (e: React.MouseEvent) => void; className?: string }) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={onMouseDown}
      className={"text-xs px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground " + (className || "")}
    >
      {label}
    </button>
  );
}

export default MarkdownEditor;


