'use client';

import '@mdxeditor/editor/style.css';
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  frontmatterPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  markdownShortcutPlugin,
  CodeToggle,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertCodeBlock,
  ConditionalContents,
  ChangeCodeMirrorLanguage,
  ShowSandpackInfo,
  Separator,
  ListsToggle,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertSandpack,
  InsertAdmonition,
  InsertFrontmatter,
  BlockTypeSelect,
  type EditorInFocus,
  type DirectiveNode,
  ChangeAdmonitionType,
} from '@mdxeditor/editor';

function whenInAdmonition(editorInFocus: EditorInFocus | null) {
  const node = editorInFocus?.rootNode;
  if (!node || node.getType() !== 'directive') {
    return false;
  }

  return ['note', 'tip', 'danger', 'info', 'caution'].includes((node as DirectiveNode).getMdastNode().name);
}

const MyToolbar = () => {
  return (
    <DiffSourceToggleWrapper>
      <ConditionalContents
        options={[
          {
            when: editor => editor?.editorType === 'codeblock',
            contents: () => <ChangeCodeMirrorLanguage />,
          },
          {
            when: editor => editor?.editorType === 'sandpack',
            contents: () => <ShowSandpackInfo />,
          },
          {
            fallback: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />
                <ListsToggle />
                <Separator />

                <Separator />

                <CreateLink />
                <InsertImage />

                <Separator />

                <InsertTable />
                <InsertThematicBreak />

                <ConditionalContents
                  options={[
                    {
                      when: whenInAdmonition,
                      contents: () => <ChangeAdmonitionType />,
                    },
                    { fallback: () => <BlockTypeSelect /> },
                  ]}
                />

                <Separator />
                <InsertCodeBlock />
                <InsertSandpack />

                <ConditionalContents
                  options={[
                    {
                      when: editorInFocus => !whenInAdmonition(editorInFocus),
                      contents: () => (
                        <>
                          <Separator />
                          <InsertAdmonition />
                        </>
                      ),
                    },
                  ]}
                />

                <Separator />
                <InsertFrontmatter />
              </>
            ),
          },
        ]}
      />
    </DiffSourceToggleWrapper>
  );
};

const myPlugins = [
  toolbarPlugin({ toolbarContents: () => <MyToolbar /> }),
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  linkPlugin(),
  linkDialogPlugin(),
  imagePlugin({
    imageAutocompleteSuggestions: ['https://via.placeholder.com/150', 'https://via.placeholder.com/150'],
    imageUploadHandler: async () => Promise.resolve('https://picsum.photos/200/300'),
  }),
  tablePlugin(),
  thematicBreakPlugin(),
  frontmatterPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      js: 'JavaScript',
      css: 'CSS',
      txt: 'text',
      tsx: 'TypeScript',
    },
  }),
  diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
  markdownShortcutPlugin(),
];

export function Editor({ markdown, onChange }: { markdown: string; onChange: (markdown: string) => void }) {
  return <MDXEditor key={markdown} markdown={markdown} plugins={myPlugins} onChange={onChange} />;
}
