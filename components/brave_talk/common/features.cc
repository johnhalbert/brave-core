/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "brave/components/brave_talk/common/features.h"

#include "base/feature_list.h"

namespace brave_talk {
namespace features {

const base::Feature kBraveTalkJSAPI{"BraveTalkJSAPI",
                                    base::FEATURE_ENABLED_BY_DEFAULT};

}  // namespace features
}  // namespace brave_talk
