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

import { handleNavigation } from "./navigation.js";
import { ElementNode, type IntrinsicNodeProps } from '@lightningjs/solid';

export function Row(props: Partial<IntrinsicNodeProps>) {
  const left = handleNavigation('left');
  const right = handleNavigation('right');

  return <node
    onLeft={left}
    onRight={right}
    selected={0}
    onFocus={props.onFocus || (elm => {
      if (!elm || !elm.selected) return;
      const child = elm.children[elm.selected];
      if (!(child instanceof ElementNode)) return;
      child.setFocus();
    })}
    {...props}>{props.children}</node>
}
