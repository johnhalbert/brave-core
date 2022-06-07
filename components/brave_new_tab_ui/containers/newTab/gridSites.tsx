// Copyright (c) 2020 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.

import * as React from 'react'

// DnD utils
import {
  SortableContainer,
  SortEnd,
  SortableContainerProps
} from 'react-sortable-hoc'

// Feature-specific components
import { List, ListPageButton, ListPageButtonContainer, ListProps, PagesContainer } from '../../components/default/gridSites'
import createWidget from '../../components/default/widget'

// Component groups
import GridSiteTile from './gridTile'
import AddSiteTile from './addSiteTile'

// Constants
import { MAX_GRID_SIZE } from '../../constants/new_tab_ui'

// Types
import * as newTabActions from '../../actions/new_tab_actions'
import * as gridSitesActions from '../../actions/grid_sites_actions'
import { useState, useCallback, useRef } from 'react'
import { GridPagesContainer } from '../../components/default/gridSites/gridPagesContainer'

interface Props {
  actions: typeof newTabActions & typeof gridSitesActions
  customLinksEnabled: boolean
  gridSites: NewTab.Site[]
  onShowEditTopSite: (targetTopSiteForEditing?: NewTab.Site) => void
}

type DynamicListProps = SortableContainerProps & ListProps
const DynamicList = SortableContainer((props: DynamicListProps) => {
  return <List {...props} />
}, { withRef: true });

function TopSitesList(props: Props) {
  const { actions, gridSites, onShowEditTopSite, customLinksEnabled } = props
  const insertAddSiteTile = customLinksEnabled && gridSites.length < MAX_GRID_SIZE
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
  console.log(gridPagesContainerRef.current)
  const [dragging, setDragging] = useState(false);
  const updateBeforeSortStart = useCallback(() => setDragging(true), []);
  const onSortEnd = useCallback(({ oldIndex, newIndex }: SortEnd) => {
    setDragging(false);

    // User can't change order in "Most Visited" mode
    // and they can't change position of super referral tiles
    if (props.gridSites[newIndex].defaultSRTopSite ||
      !props.customLinksEnabled) {
      return
    }
    props.actions.tilesReordered(props.gridSites, oldIndex, newIndex)
  }, [props.gridSites, props.customLinksEnabled, props.actions.tilesReordered])

  const pages = Math.floor(gridSites.length / maxGridSize) + 1;
  console.log(`Pages: ${pages}, MaxGrid: ${maxGridSize}, Sites: ${gridSites.length}`);
  const iterator: number[] = [];
  for (let i = 0; i < pages; ++i)
    iterator.push(i);

  // Current theory:
  // Either:
  // 1. Sort the items how they're displayed, in a two row, infinite column
  // layout
  // 2. Multiple pages, use dndkit.
  return <PagesContainer>
    <GridPagesContainer ref={gridPagesContainerRef}>
      {iterator.map(page => <DynamicList
        key={page}
        blockNumber={maxGridSize}
        updateBeforeSortStart={updateBeforeSortStart}
        onSortEnd={onSortEnd}
        axis='xy'
        lockToContainerEdges={true}
        lockOffset={'15%'}
        // Ensure there is some movement from the user side before triggering the
        // draggable handler. Otherwise click events will be swallowed since
        // react-sortable-hoc works via mouseDown event.
        // See https://github.com/clauderic/react-sortable-hoc#click-events-being-swallowed
        distance={2}
      >

        {
          gridSites.slice(page, page + maxGridSize)
            .map((siteData: NewTab.Site, index: number) => (
              <GridSiteTile
                key={siteData.id}
                actions={actions}
                index={index}
                siteData={siteData}
                isDragging={dragging}
                onShowEditTopSite={onShowEditTopSite}
                // User can't change order in "Most Visited" mode
                // and they can't change position of super referral tiles
                disabled={siteData.defaultSRTopSite || !props.customLinksEnabled}
              />
            ))
        }
        {insertAddSiteTile}
        <AddSiteTile
          index={gridSites.length}
          disabled={true}
          isDragging={dragging}
          showEditTopSite={onShowEditTopSite}
        />

      </DynamicList>)}
    </GridPagesContainer>
    <ListPageButtonContainer>
      {iterator.map(page => <ListPageButton key={page} onClick={e => gridPagesContainerRef.current?.children[page].scrollIntoView({ behavior: 'smooth' })}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="50" />
        </svg>
      </ListPageButton>)}
    </ListPageButtonContainer>
  </PagesContainer>;
}

export default createWidget(TopSitesList)
