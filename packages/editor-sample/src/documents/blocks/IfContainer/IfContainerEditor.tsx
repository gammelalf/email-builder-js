import React from 'react';


import { useCurrentBlockId } from '../../editor/EditorBlock';
import { setDocument, setSelectedBlockId, useDocument } from '../../editor/EditorContext';
import EditorChildrenIds, { EditorChildrenChange } from '../helpers/EditorChildrenIds';

import { IfContainerProps } from './IfContainerPropsSchema';

export default function IfContainerEditor({ props }: IfContainerProps) {
  const document = useDocument();
  const currentBlockId = useCurrentBlockId();

  const update = (place: 'then' | 'else' | number, { block, blockId, childrenIds }: EditorChildrenChange) => {
    console.log('Update', { place, childrenIds });

    const newProps = {...props};
    if (place === 'then') {
      newProps.then = childrenIds;
    } else if (place === 'else') {
      newProps.else = childrenIds;
    } else {
      newProps.elif[place].then = childrenIds;
    }

    setDocument({
      [blockId]: block,
      [currentBlockId]: {
        type: 'IfContainer',
        data: {
          ...document[currentBlockId].data,
          props: newProps,
        },
      },
    });
    setSelectedBlockId(blockId);
  };

  console.log("Render", props);

  return (
    <div>
      <p>{`{% if ${props.if} %}`}</p>
      <EditorChildrenIds childrenIds={props.then} onChange={(change) => update('then', change)} />
      {props.elif.map((props, index) => (
        <>
          <p>{`{% elif ${props.if} %}`}</p>
          <EditorChildrenIds childrenIds={props.then} onChange={(change) => update(index, change)} />
        </>
      ))}
      {props.else !== null && (
        <>
          <p>{'{% else %}'}</p>
          <EditorChildrenIds childrenIds={props.else} onChange={(change) => update('else', change)} />
        </>
      )}
      <p>{`{% endif %}`}</p>
    </div>
  );
}