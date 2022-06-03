/* Copyright (c) 2020 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "brave/components/omnibox/browser/brave_fake_autocomplete_provider_client.h"
#include "base/memory/scoped_refptr.h"
#include "brave/components/constants/pref_names.h"
#include "components/omnibox/browser/shortcuts_backend.h"
#include "components/prefs/pref_registry_simple.h"

BraveFakeAutocompleteProviderClient::BraveFakeAutocompleteProviderClient() {
  pref_service_ = std::make_unique<TestingPrefServiceSimple>();
  auto* registry = pref_service_->registry();
  registry->RegisterBooleanPref(kTopSiteSuggestionsEnabled, true);
  registry->RegisterBooleanPref(kBraveSuggestedSiteSuggestionsEnabled,
                                true);
  registry->RegisterBooleanPref(kHistorySuggestionsEnabled, true);
  registry->RegisterBooleanPref(kBookmarkSuggestionsEnabled, true);
}

BraveFakeAutocompleteProviderClient::~BraveFakeAutocompleteProviderClient() =
    default;

PrefService* BraveFakeAutocompleteProviderClient::GetPrefs() const {
  return pref_service_.get();
}

scoped_refptr<ShortcutsBackend>
BraveFakeAutocompleteProviderClient::GetShortcutsBackend() {
  return shortcuts_backend_;
}

scoped_refptr<ShortcutsBackend>
BraveFakeAutocompleteProviderClient::GetShortcutsBackendIfExists() {
  return shortcuts_backend_;
}
