/*
 * Copyright 2023 Comcast Cable Communications Management, LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { ElementNode } from "@lightningjs/solid";

export function withPadding(el: ElementNode, padding: () => number[]) {
  const pad = padding();
  let top: number, left: number, right: number, bottom: number;

  if (Array.isArray(pad)) {
    // top right bottom left
    if (pad.length === 2) {
      top = bottom = pad[0]!;
      left = right = pad[1]!;
    } else if (pad.length === 3) {
      top = pad[0]!;
      left = right = pad[1]!;
      bottom = pad[2]!;
    } else {
      [top, right, bottom, left] = pad as [number, number, number, number];
    }
  } else {
    top = right = bottom = left = pad;
  }

  el.onLayout = (node, size) => {
    if (size) {
      el.width = size.width + left + right;
      el.height = size.height + top + bottom;

      node.x = left;
      node.y = top;

      el.parent!.updateLayout(el, { width: el.width, height: el.height });
    }
  };
}
