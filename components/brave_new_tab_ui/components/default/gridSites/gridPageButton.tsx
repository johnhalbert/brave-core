import * as React from "react";
import styled from "styled-components";

const StyledButton = styled('button')`
    all: unset;

    cursor: pointer;

    color: #ffffff;
    opacity: 0.5;

    :hover {
        opacity: 0.8
    }

    width: var(--list-page-button-size);
    height: var(--list-page-button-size);
`;

function PageIndicator() {
    return <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" />
    </svg>
}

export default function GridPageButton(props: { page: number, pageContainerRef: React.MutableRefObject<HTMLDivElement | undefined> }) {
    const updatePage = React.useCallback(() => {
        props.pageContainerRef.current?.children[props.page].scrollIntoView({ behavior: 'smooth' });
    }, [props.page, props.pageContainerRef]);

    return <StyledButton onClick={updatePage}>
        <PageIndicator />
    </StyledButton>
}



export const GridPageIndicatorContainer = styled('div') <{}>`
  position: absolute;
  color: #ffffff;

  width: var(--list-page-button-size);
  height: var(--list-page-button-size);
`;

export const GridPageIndicator = React.forwardRef<HTMLDivElement>((props, ref) =>
    <GridPageIndicatorContainer ref={ref}>
        <PageIndicator />
    </GridPageIndicatorContainer>);
