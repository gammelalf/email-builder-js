import React, { useMemo } from 'react';
import ReactDOM from 'react-dom/server';

import { useDocument } from '../../documents/editor/EditorContext';
import Reader, { TReaderDocument } from '../../documents/reader/core';

import HighlightedCodePanel from './helper/HighlightedCodePanel';

export default function HtmlPanel() {
  const document = useDocument();
  const code = useMemo(() => renderToStaticMarkup(document, { rootBlockId: 'root' }), [document]);
  return <HighlightedCodePanel type="html" value={code} />;
}

function renderToStaticMarkup(document: TReaderDocument, { rootBlockId }: { rootBlockId: string }) {
  return (
    '<!DOCTYPE html>' +
    ReactDOM.renderToStaticMarkup(
      <html>
        <body>
          <Reader document={document} rootBlockId={rootBlockId} />
        </body>
      </html>
    )
  );
}