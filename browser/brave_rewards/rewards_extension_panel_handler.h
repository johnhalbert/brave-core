/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef BRAVE_BROWSER_BRAVE_REWARDS_REWARDS_EXTENSION_PANEL_HANDLER_H_
#define BRAVE_BROWSER_BRAVE_REWARDS_REWARDS_EXTENSION_PANEL_HANDLER_H_

#include "brave/browser/brave_rewards/rewards_panel_service.h"

namespace brave_rewards {

class RewardsExtensionPanelHandler : public RewardsPanelService::Observer {
 public:
  ~RewardsExtensionPanelHandler() override;

  void OnRewardsPanelRequested(Browser* browser,
                               const mojom::RewardsPanelArgs& args) override;
};

}  // namespace brave_rewards

#endif  // BRAVE_BROWSER_BRAVE_REWARDS_REWARDS_EXTENSION_PANEL_HANDLER_H_
