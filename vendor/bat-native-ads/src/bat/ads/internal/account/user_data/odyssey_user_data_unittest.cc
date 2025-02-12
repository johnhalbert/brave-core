/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "bat/ads/internal/account/user_data/odyssey_user_data.h"

#include <string>

#include "base/json/json_writer.h"
#include "base/values.h"
#include "bat/ads/ads.h"
#include "testing/gtest/include/gtest/gtest.h"

// npm run test -- brave_unit_tests --filter=BatAds*

namespace ads {
namespace user_data {

namespace {

std::string GetOdysseyAsJson() {
  const base::DictionaryValue user_data = GetOdyssey();

  std::string json;
  base::JSONWriter::Write(user_data, &json);

  return json;
}

}  // namespace

TEST(BatAdsOdysseyUserDataTest, GetOdysseyForGuest) {
  // Arrange
  SysInfo().is_uncertain_future = true;

  // Act
  const std::string json = GetOdysseyAsJson();

  // Assert
  const std::string expected_json = R"({"odyssey":"guest"})";

  EXPECT_EQ(expected_json, json);
}

TEST(BatAdsOdysseyUserDataTest, GetOdysseyForHost) {
  // Arrange
  SysInfo().is_uncertain_future = false;

  // Act
  const std::string json = GetOdysseyAsJson();

  // Assert
  const std::string expected_json = R"({"odyssey":"host"})";

  EXPECT_EQ(expected_json, json);
}

}  // namespace user_data
}  // namespace ads
