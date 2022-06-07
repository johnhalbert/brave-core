import styled from 'styled-components';

export const GridPagesContainer = styled('div') <{}>`
  display: flex;
  flex-direction: row;

  max-width: 596px;
  overflow-x: auto;

  scroll-snap-type: x mandatory;

  ::-webkit-scrollbar {
    display: none;
  }
`;
