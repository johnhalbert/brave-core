/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "brave/browser/brave_rewards/rewards_panel_service.h"

#include <string>
#include <utility>

#include "base/feature_list.h"
#include "brave/browser/brave_rewards/rewards_extension_panel_handler.h"
#include "brave/components/brave_rewards/common/features.h"
#include "chrome/browser/profiles/profile.h"
#include "chrome/browser/ui/browser_finder.h"
#include "chrome/browser/ui/browser_window.h"

namespace brave_rewards {

RewardsPanelService::RewardsPanelService(Profile* profile) : profile_(profile) {
  if (base::FeatureList::IsEnabled(features::kUseExtensionFeature)) {
    extension_handler_ = std::make_unique<RewardsExtensionPanelHandler>();
    AddObserver(extension_handler_.get());
  }
}

RewardsPanelService::~RewardsPanelService() = default;

bool RewardsPanelService::OpenRewardsPanel() {
  return OpenPanelWithArgs(
      mojom::RewardsPanelArgs(mojom::RewardsPanelView::kDefault, ""));
}

bool RewardsPanelService::ShowRewardsTour() {
  return OpenPanelWithArgs(
      mojom::RewardsPanelArgs(mojom::RewardsPanelView::kRewardsTour, ""));
}

bool RewardsPanelService::ShowGrantCaptcha(const std::string& grant_id) {
  return OpenPanelWithArgs(mojom::RewardsPanelArgs(
      mojom::RewardsPanelView::kGrantCaptcha, grant_id));
}

bool RewardsPanelService::ShowAdaptiveCaptcha() {
  return OpenPanelWithArgs(
      mojom::RewardsPanelArgs(mojom::RewardsPanelView::kAdaptiveCaptcha, ""));
}

bool RewardsPanelService::ShowBraveTalkOptIn() {
  return OpenPanelWithArgs(
      mojom::RewardsPanelArgs(mojom::RewardsPanelView::kBraveTalkOptIn, ""));
}

void RewardsPanelService::AddObserver(Observer* observer) {
  observers_.AddObserver(observer);
}

void RewardsPanelService::RemoveObserver(Observer* observer) {
  observers_.RemoveObserver(observer);
}

void RewardsPanelService::NotifyPanelClosed(Browser* browser) {
  DCHECK(browser);
  for (auto& observer : observers_) {
    observer.OnRewardsPanelClosed(browser);
  }
}

bool RewardsPanelService::OpenPanelWithArgs(mojom::RewardsPanelArgs&& args) {
  auto* browser = chrome::FindTabbedBrowser(profile_, false);
  if (!browser) {
    return false;
  }

  if (browser->window()->IsMinimized()) {
    browser->window()->Restore();
  }

  panel_args_ = std::move(args);

  for (auto& observer : observers_) {
    observer.OnRewardsPanelRequested(browser, panel_args_);
  }

  return !observers_.empty();
}

}  // namespace brave_rewards
