/* Copyright (c) 2021 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "bat/ads/internal/serving/permission_rules/user_activity_permission_rule_unittest_util.h"

#include "bat/ads/internal/user_interaction/browsing/user_activity_manager.h"

namespace ads {

void ForceUserActivityPermissionRule() {
  UserActivityManager::Get()->RecordEvent(UserActivityEventType::kOpenedNewTab);
  UserActivityManager::Get()->RecordEvent(UserActivityEventType::kClosedTab);
}

}  // namespace ads
