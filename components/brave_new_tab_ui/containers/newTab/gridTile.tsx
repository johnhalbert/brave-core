// Copyright (c) 2020 The Brave Authors. All rights reserved.
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this file,
// you can obtain one at http://mozilla.org/MPL/2.0/.

import * as React from 'react'

// Feature-specific components
import {
  Tile,
  TileActionsContainer,
  TileAction,
  TileFavicon,
  TileMenu,
  TileMenuItem,
  TileTitle
} from '../../components/default'

// Icons
import EditIcon from '../../components/default/gridSites/assets/edit'
import EditMenuIcon from '../../components/default/gridSites/assets/edit-menu'
import TrashIcon from '../../components/default/gridSites/assets/trash'

// Types
import * as newTabActions from '../../actions/new_tab_actions'
import * as gridSitesActions from '../../actions/grid_sites_actions'

import { getLocale } from '../../../common/locale'
import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities';

interface Props {
  actions: typeof newTabActions & typeof gridSitesActions
  siteData: NewTab.Site
  disabled: boolean
  isDragging: boolean
  onShowEditTopSite: (targetTopSiteForEditing?: NewTab.Site) => void
}

function generateGridSiteFavicon(site: NewTab.Site): string {
  if (site.favicon === '') {
    return `chrome://favicon/size/64@1x/${site.url}`
  }
  return site.favicon
}

function TopSite(props: Props) {
  const { siteData, isDragging } = props;

  const tileMenuRef = useRef<any>();
  const { attributes,
    listeners,
    setNodeRef,
    transform,
    transition } = useSortable({ id: siteData.id });
  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
  }), [transform, transition]);

  const [showMenu, setShowMenu] = useState(false);

  const handleClickOutside = useCallback((e: Event) => {
    if (!tileMenuRef.current || tileMenuRef.current.contains(e.target))
      return;
    setShowMenu(false);
  }, []);

  const handleMoveOutside = useCallback((e: Event) => {
    if (!tileMenuRef.current || tileMenuRef.current.contains(e.target))
      return;
    setShowMenu(false);
  }, []);

  const onKeyPressSettings = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape')
      setShowMenu(false);
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('mouseMove', handleMoveOutside);
    document.addEventListener('keydown', onKeyPressSettings);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('mousemove', handleMoveOutside);
      document.removeEventListener('keydown', onKeyPressSettings);
    }
  }, [handleClickOutside, handleMoveOutside, onKeyPressSettings]);

  const onShowTileMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu(true);
  }, []);

  const onIgnoredTopSite = useCallback((site: NewTab.Site, e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu(false);
    props.actions.tileRemoved(site.url);
  }, [props.actions.tileRemoved]);

  const onEditTopSite = useCallback((site: NewTab.Site, e: React.MouseEvent) => {
    e.preventDefault();
    setShowMenu(false);
    props.onShowEditTopSite(site)
  }, [props.onShowEditTopSite]);

  return <Tile
    {...attributes}
    {...listeners}
    ref={setNodeRef}
    title={siteData.title}
    tabIndex={0}
    isDragging={isDragging}
    isMenuShowing={showMenu}
    href={siteData.url}
    style={style}
  >
    {
      !siteData.defaultSRTopSite
        ? <TileActionsContainer>
          <TileAction onClick={onShowTileMenu}>
            <EditIcon />
          </TileAction>
        </TileActionsContainer>
        : null
    }
    {showMenu &&
      <TileMenu ref={tileMenuRef}>
        <TileMenuItem onClick={e => onEditTopSite(siteData, e)}>
          <EditMenuIcon />
          {getLocale('editSiteTileMenuItem')}
        </TileMenuItem>
        <TileMenuItem onClick={e => onIgnoredTopSite(siteData, e)}>
          <TrashIcon />
          {getLocale('removeTileMenuItem')}
        </TileMenuItem>
      </TileMenu>
    }
    <TileFavicon
      draggable={false}
      src={generateGridSiteFavicon(siteData)}
    />
    <TileTitle> {siteData.title} </TileTitle>
  </Tile>;
}

export default TopSite

