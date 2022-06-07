import * as React from 'react';
import styled from 'styled-components';

const ForwardRefDiv = React.forwardRef<HTMLDivElement | undefined, Omit<JSX.IntrinsicElements['div'], 'ref'>>((props, ref) => {
  console.log(props, ref);
  return <div {...props} ref={ref as any} />
})

export const GridPagesContainer = styled(ForwardRefDiv) <{}>`
  display: flex;
  flex-direction: row;

  max-width: 596px;
  overflow-x: auto;

  scroll-snap-type: x mandatory;

  ::-webkit-scrollbar {
    display: none;
  }
`;
