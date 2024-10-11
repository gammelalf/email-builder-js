import React from 'react';

import {
  Button,
  ButtonGroup,
   FormControl, Input,
  InputLabel,
  Stack,
  Switch, TextField,
} from '@mui/material';

import { IfContainerProps } from '../../../../documents/blocks/IfContainer/IfContainerPropsSchema';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';

type IfContainerSidebarPanelProps = {
  data: IfContainerProps;
  setData: (v: IfContainerProps) => void;
};

export default function IfContainerSidebarPanel({ data, setData }: IfContainerSidebarPanelProps) {
  const updateProps = (newProps: Partial<IfContainerProps['props']>) => setData({ ...data, props: { ...data.props, ...newProps } });

  return (
    <BaseSidebarPanel title="If container block">
      <FormControl>
        <InputLabel>If</InputLabel>
        <Input value={data.props.if} onChange={(event) => updateProps({ if: event.target.value })}/>
      </FormControl>

      <FormControl>
        <InputLabel>Else</InputLabel>
        <Switch checked={data.props.else !== null} onChange={(event) => updateProps({else: event.target.checked ? [] : null})} />
      </FormControl>

      <ButtonGroup>
        <Button onClick={() => updateProps({elif: [...data.props.elif, {if: 'true', then: []}]})}>+</Button>
        <Button onClick={() => updateProps({elif: data.props.elif.slice(0, -1)})}>-</Button>
      </ButtonGroup>
      <Stack>
        {data.props.elif.map((elifProps, index) => <TextField value={elifProps.if} onChange={(event) => {
          const newElif = [...data.props.elif];
          newElif[index].if = event.target.value;
          updateProps({elif: newElif});
        }} />)}
      </Stack>
    </BaseSidebarPanel>
  );
}
