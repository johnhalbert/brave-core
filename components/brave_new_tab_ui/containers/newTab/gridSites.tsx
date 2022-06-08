// Copyright (c) 2020 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.

import * as React from 'react'

// DnD Kit
import { AutoScrollOptions, DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, MouseSensor, PointerActivationConstraint, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';



// Feature-specific components
import { List, ListPageButtonContainer, PagesContainer } from '../../components/default/gridSites'
import createWidget from '../../components/default/widget'

// Component groups
import GridSiteTile, { SiteTile } from './gridTile'
import AddSiteTile from './addSiteTile'

// Constants
import { MAX_GRID_SIZE } from '../../constants/new_tab_ui'

// Types
import * as newTabActions from '../../actions/new_tab_actions'
import * as gridSitesActions from '../../actions/grid_sites_actions'
import { useCallback, useRef, useState } from 'react'
import { GridPagesContainer } from '../../components/default/gridSites/gridPagesContainer'
import GridPageButton, { GridPageIndicator } from '../../components/default/gridSites/gridPageButton'

const activationConstraint: PointerActivationConstraint = { distance: 2 };
const autoScrollOptions: AutoScrollOptions = { interval: 500 };

interface Props {
  actions: typeof newTabActions & typeof gridSitesActions
  customLinksEnabled: boolean
  gridSites: NewTab.Site[]
  onShowEditTopSite: (targetTopSiteForEditing?: NewTab.Site) => void
}

function TopSitesPage(props: Props & { maxGridSize: number, page: number }) {
  const start = props.page * props.maxGridSize;
  const items = props.gridSites.slice(start, start + props.maxGridSize);
  return <List blockNumber={props.maxGridSize}>
    {items.map((siteData) => (
      <GridSiteTile
        key={siteData.id}
        actions={props.actions}
        siteData={siteData}
        isDragging={false}
        onShowEditTopSite={props.onShowEditTopSite}
        // User can't change order in "Most Visited" mode
        // and they can't change position of super referral tiles
        disabled={siteData.defaultSRTopSite || !props.customLinksEnabled}
      />
    ))}
    {false &&
      <AddSiteTile
        isDragging={false}
        showEditTopSite={props.onShowEditTopSite}
      />}
  </List>
}

function TopSitesList(props: Props) {
  const { gridSites, customLinksEnabled } = props
  // const insertAddSiteTile = customLinksEnabled && gridSites.length < MAX_GRID_SIZE
  let maxGridSize = customLinksEnabled ? MAX_GRID_SIZE : (MAX_GRID_SIZE / 2)

  // In favorites mode, makes widget area fits to tops sites items count + 1 if
  // items is less than 6. If items are more than 6, we don't need to care about
  // empty space in second row.
  // Plus one is for addSite tile.
  if (customLinksEnabled && gridSites.length < 6) {
    maxGridSize = gridSites.length + 1
  }

  // In frecency mode, makes widget area fits to top sites items.
  if (!customLinksEnabled) {
    maxGridSize = Math.min(gridSites.length, maxGridSize)
  }

  const gridPagesContainerRef = useRef<HTMLDivElement>();
  // const [dragging, _] = useState(false);

  const pages = Math.floor(gridSites.length / maxGridSize) + 1;
  const iterator: number[] = [];
  for (let i = 0; i < pages; ++i)
    iterator.push(i);

  const indicatorRef = useRef<HTMLDivElement>();
  const scrollHandler = useCallback(() => {
    const el = gridPagesContainerRef.current;
    if (!el) return;

    const percent = 100 * (el.scrollLeft) / (el.scrollWidth - el.clientWidth);
    const translationX = percent * (pages - 1) * 2;
    indicatorRef.current?.setAttribute('style', `transform: translateX(${translationX}%)`)
  }, []);

  const onSortEnd = useCallback((e: DragEndEvent) => {
    e.activatorEvent.preventDefault();
    e.activatorEvent.stopPropagation();
    e.activatorEvent.stopImmediatePropagation();

    const draggingIndex = gridSites.findIndex(s => s.id == e.active.id);
    const droppedIndex = gridSites.findIndex(s => s.id === e.over?.id);
    console.log(e.activatorEvent.type, e, draggingIndex, droppedIndex);

    if (draggingIndex === undefined || droppedIndex === undefined) return;

    if (gridSites[droppedIndex].defaultSRTopSite || !props.customLinksEnabled)
      return;

    props.actions.tilesReordered(gridSites, draggingIndex, droppedIndex);
  }, [gridSites, props.actions.tilesReordered, props.customLinksEnabled]);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint });
  const touchSensor = useSensor(TouchSensor, { activationConstraint });
  const keyboardSensor = useSensor(KeyboardSensor, {});
  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  const [dragging, setDragging] = useState<NewTab.Site | undefined>(undefined);
  const onDragStart = useCallback((e: DragStartEvent) => {
    const site = gridSites.find(x => x.id === e.active.id);
    console.log(site);
    setDragging(site);
  }, [gridSites]);

  // Current theory:
  // Either:
  // 1. Sort the items how they're displayed, in a two row, infinite column
  // layout
  // 2. Multiple pages, use dndkit.
  return <PagesContainer>
    <GridPagesContainer ref={gridPagesContainerRef as any} onScroll={scrollHandler}>
      <DndContext onDragEnd={onSortEnd} autoScroll={autoScrollOptions} sensors={sensors} onDragStart={onDragStart}>
        <SortableContext items={gridSites}>
          {iterator.map(page => <TopSitesPage key={page} page={page} maxGridSize={maxGridSize} {...props} />)}
          <DragOverlay>
            {dragging && <SiteTile site={dragging} />}
          </DragOverlay>
        </SortableContext>
      </DndContext>
    </GridPagesContainer>
    <ListPageButtonContainer>
      {iterator.map(page => <GridPageButton
        key={page}
        page={page}
        pageContainerRef={gridPagesContainerRef} />)}
      <GridPageIndicator ref={indicatorRef as any} />
    </ListPageButtonContainer>
  </PagesContainer>;
}

export default createWidget(TopSitesList)
