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

import { ElementNode, setActiveElement } from '@lightningjs/solid';
import { assertTruthy } from './utils.js';
import type { KeyHandler } from './useFocusManager.js';

export function handleNavigation(direction: 'up' | 'right' | 'down' | 'left'): KeyHandler {
  return function() {
    const numChildren = this.children.length;
    const wrap = this.wrap;
    const lastSelected = this.selected;

    if (direction === 'right' || direction === 'down') {
      do {
        this.selected = ((this.selected || 0) % numChildren) + 1;
        if (this.selected >= numChildren) {
          if (!wrap) {
            this.selected = null;
            break;
          }
          this.selected = 0;
        }
      } while (this.children[this.selected]?.skipFocus);
    } else if (direction === 'left' || direction === 'up') {
      do {
        this.selected = ((this.selected || 0) % numChildren) - 1;
        if (this.selected < 0) {
          if (!wrap) {
            this.selected = null;
            break;
          }
          this.selected = numChildren - 1;
        }
      } while (this.children[this.selected]?.skipFocus);
    }

    if (this.selected === null) {
      this.selected = lastSelected;
      return false;
    }
    const active = this.children[this.selected];
    assertTruthy(active instanceof ElementNode);
    this.onSelectedChanged &&
      this.onSelectedChanged.call(
        this,
        this,
        active,
        this.selected,
        lastSelected,
      );

    if (this.plinko && lastSelected !== null) {
      // Set the next item to have the same selected index
      // so we move up / down directly
      const lastSelectedChild = this.children[lastSelected];
      assertTruthy(lastSelectedChild instanceof ElementNode);
      const num = lastSelectedChild.selected;
      active.selected = num;
    }
    setActiveElement(active);
    return true;
  };
}
