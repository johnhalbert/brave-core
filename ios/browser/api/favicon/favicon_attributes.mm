/* Copyright (c) 2022 The Brave Authors. All rights reserved.
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#import "brave/ios/browser/api/favicon/favicon_attributes.h"
#include "ios/chrome/common/ui/favicon/favicon_attributes.h"

#if !defined(__has_feature) || !__has_feature(objc_arc)
#error "This file requires ARC support."
#endif

// MARK: - Implementation

@implementation BraveFaviconAttributes
- (instancetype)initWithAttributes:(FaviconAttributes*)attributes {
  if (!attributes) {
    return nil;
  }
  
  if ((self = [super init])) {
    _faviconImage = attributes.faviconImage;
    _monogramString = attributes.monogramString;
    _textColor = attributes.textColor;
    _backgroundColor = attributes.backgroundColor;
    _defaultBackgroundColor = attributes.defaultBackgroundColor;
    _usesDefaultImage = attributes.usesDefaultImage;
  }
  return self;
}

+ (instancetype)attributesWithImage:(UIImage*)image {
  return [[BraveFaviconAttributes alloc]
      initWithAttributes:[FaviconAttributes attributesWithImage:image]];
}

+ (instancetype)attributesWithMonogram:(NSString*)monogram
                             textColor:(UIColor*)textColor
                       backgroundColor:(UIColor*)backgroundColor
                defaultBackgroundColor:(BOOL)defaultBackgroundColor {
  return [[BraveFaviconAttributes alloc]
      initWithAttributes:[FaviconAttributes
                             attributesWithMonogram:monogram
                                          textColor:textColor
                                    backgroundColor:backgroundColor
                             defaultBackgroundColor:defaultBackgroundColor]];
}

+ (instancetype)attributesWithDefaultImage {
  return [[BraveFaviconAttributes alloc]
      initWithAttributes:[FaviconAttributes attributesWithDefaultImage]];
}
@end
