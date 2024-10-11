import React, { createContext, useContext } from 'react';
import { z } from 'zod';

import { Avatar, AvatarPropsSchema } from '@usewaypoint/block-avatar';
import { Button, ButtonPropsSchema } from '@usewaypoint/block-button';
import { ColumnsContainer } from '@usewaypoint/block-columns-container';
import { Container } from '@usewaypoint/block-container';
import { Divider, DividerPropsSchema } from '@usewaypoint/block-divider';
import { Heading, HeadingPropsSchema } from '@usewaypoint/block-heading';
import { Html, HtmlPropsSchema } from '@usewaypoint/block-html';
import { Image, ImagePropsSchema } from '@usewaypoint/block-image';
import { Spacer, SpacerPropsSchema } from '@usewaypoint/block-spacer';
import { Text, TextPropsSchema } from '@usewaypoint/block-text';
import {
  buildBlockComponent,
  buildBlockConfigurationDictionary,
  buildBlockConfigurationSchema,
} from '@usewaypoint/document-core';

import ColumnsContainerPropsSchema, {
  ColumnsContainerProps,
} from '../blocks/ColumnsContainer/ColumnsContainerPropsSchema';
import ContainerPropsSchema, { ContainerProps } from '../blocks/Container/ContainerPropsSchema';
import EmailLayoutPropsSchema, { EmailLayoutProps } from '../blocks/EmailLayout/EmailLayoutPropsSchema';
import IfContainerPropsSchema, { IfContainerProps } from '../blocks/IfContainer/IfContainerPropsSchema';

const ReaderContext = createContext<TReaderDocument>({});

function useReaderDocument() {
  return useContext(ReaderContext);
}

const READER_DICTIONARY = buildBlockConfigurationDictionary({
  ColumnsContainer: {
    schema: ColumnsContainerPropsSchema,
    Component: ({ style, props }: ColumnsContainerProps) => {
      const { columns, ...restProps } = props ?? {};
      let cols = undefined;
      if (columns) {
        cols = columns.map((col) => col.childrenIds.map((childId) => <ReaderBlock key={childId} id={childId} />));
      }

      return <ColumnsContainer props={restProps} columns={cols} style={style} />;
    },
  },
  Container: {
    schema: ContainerPropsSchema,
    Component: ({ style, props }: ContainerProps) => {
      const childrenIds = props?.childrenIds ?? [];
      return (
        <Container style={style}>
          {childrenIds.map((childId) => (
            <ReaderBlock key={childId} id={childId} />
          ))}
        </Container>
      );
    },
  },
  EmailLayout: {
    schema: EmailLayoutPropsSchema,
    Component: (props: EmailLayoutProps) => {
      function getFontFamily(fontFamily: EmailLayoutProps['fontFamily']) {
        const f = fontFamily ?? 'MODERN_SANS';
        switch (f) {
          case 'MODERN_SANS':
            return '"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif';
          case 'BOOK_SANS':
            return 'Optima, Candara, "Noto Sans", source-sans-pro, sans-serif';
          case 'ORGANIC_SANS':
            return 'Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif';
          case 'GEOMETRIC_SANS':
            return 'Avenir, "Avenir Next LT Pro", Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif';
          case 'HEAVY_SANS':
            return 'Bahnschrift, "DIN Alternate", "Franklin Gothic Medium", "Nimbus Sans Narrow", sans-serif-condensed, sans-serif';
          case 'ROUNDED_SANS':
            return 'ui-rounded, "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, Manjari, "Arial Rounded MT Bold", Calibri, source-sans-pro, sans-serif';
          case 'MODERN_SERIF':
            return 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif';
          case 'BOOK_SERIF':
            return '"Iowan Old Style", "Palatino Linotype", "URW Palladio L", P052, serif';
          case 'MONOSPACE':
            return '"Nimbus Mono PS", "Courier New", "Cutive Mono", monospace';
        }
      }

      function getBorder({ borderColor }: EmailLayoutProps) {
        if (!borderColor) {
          return undefined;
        }
        return `1px solid ${borderColor}`;
      }

      const childrenIds = props.childrenIds ?? [];
      return (
        <div
          style={{
            backgroundColor: props.backdropColor ?? '#F5F5F5',
            color: props.textColor ?? '#262626',
            fontFamily: getFontFamily(props.fontFamily),
            fontSize: '16px',
            fontWeight: '400',
            letterSpacing: '0.15008px',
            lineHeight: '1.5',
            margin: '0',
            padding: '32px 0',
            minHeight: '100%',
            width: '100%',
          }}
        >
          <table
            align="center"
            width="100%"
            style={{
              margin: '0 auto',
              maxWidth: '600px',
              backgroundColor: props.canvasColor ?? '#FFFFFF',
              borderRadius: props.borderRadius ?? undefined,
              border: getBorder(props),
            }}
            role="presentation"
            cellSpacing="0"
            cellPadding="0"
            border={0}
          >
            <tbody>
              <tr style={{ width: '100%' }}>
                <td>
                  {childrenIds.map((childId) => (
                    <ReaderBlock key={childId} id={childId} />
                  ))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    },
  },
  //
  Avatar: {
    schema: AvatarPropsSchema,
    Component: Avatar,
  },
  Button: {
    schema: ButtonPropsSchema,
    Component: Button,
  },
  Divider: {
    schema: DividerPropsSchema,
    Component: Divider,
  },
  Heading: {
    schema: HeadingPropsSchema,
    Component: Heading,
  },
  Html: {
    schema: HtmlPropsSchema,
    Component: Html,
  },
  Image: {
    schema: ImagePropsSchema,
    Component: Image,
  },
  Spacer: {
    schema: SpacerPropsSchema,
    Component: Spacer,
  },
  Text: {
    schema: TextPropsSchema,
    Component: Text,
  },
  IfContainer: {
    schema: IfContainerPropsSchema,
    Component: ({ props }: IfContainerProps) => (
      <>
        {`{% if ${props.if} %}`}
        {props.then.map((childId) => <ReaderBlock key={childId} id={childId} />)}
        {props.elif.map((props) => (
          <>
            {`{% elif ${props.if} %}`}
            {props.then.map((childId) => <ReaderBlock key={childId} id={childId} />)}
          </>
        ))}
        {props.else !== null && (
          <>
            {'{% else %}'}
            {props.else.map((childId) => <ReaderBlock key={childId} id={childId} />)}
          </>
        )}
        {`{% endif %}`}
      </>
    ),
  },
});

export const ReaderBlockSchema = buildBlockConfigurationSchema(READER_DICTIONARY);
export type TReaderBlock = z.infer<typeof ReaderBlockSchema>;

export const ReaderDocumentSchema = z.record(z.string(), ReaderBlockSchema);
export type TReaderDocument = Record<string, TReaderBlock>;

const BaseReaderBlock = buildBlockComponent(READER_DICTIONARY);

export type TReaderBlockProps = { id: string };

export function ReaderBlock({ id }: TReaderBlockProps) {
  const document = useReaderDocument();
  return <BaseReaderBlock {...document[id]} />;
}

export type TReaderProps = {
  document: Record<string, z.infer<typeof ReaderBlockSchema>>;
  rootBlockId: string;
};
export default function Reader({ document, rootBlockId }: TReaderProps) {
  return (
    <ReaderContext.Provider value={document}>
      <ReaderBlock id={rootBlockId} />
    </ReaderContext.Provider>
  );
}