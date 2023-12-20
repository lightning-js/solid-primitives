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

import { createEffect, on, createSignal, untrack } from 'solid-js';
import { useKeyDownEvent } from '@solid-primitives/keyboard';
import { activeElement, ElementNode } from '@lightningjs/solid';
import { isFunc } from './utils.js';

export interface DefaultKeyMap {
  Left: string;
  Right: string;
  Up: string;
  Down: string;
  Enter: string;
  Last: string;
}

export interface KeyMap extends DefaultKeyMap {}

export type KeyHandlerReturn = boolean | void;

export type KeyHandler = (
  this: ElementNode,
  e: KeyboardEvent,
  target: ElementNode,
) => KeyHandlerReturn;

/**
 * Generates a map of event handlers for each key in the KeyMap
 */
type KeyMapEventHandlers = {
  [K in keyof KeyMap as `on${Capitalize<K>}`]?: KeyHandler;
};

declare module '@lightningjs/solid' {
  /**
   * Augment the existing IntrinsicCommonProps interface with our own
   * FocusManager-specific properties.
   */
  interface IntrinsicCommonProps extends KeyMapEventHandlers {
    onFocus?: (
      currentFocusedElm: ElementNode | null,
      prevFocusedElm: ElementNode | null,
    ) => void;
    onBlur?: (
      currentFocusedElm: ElementNode | null,
      prevFocusedElm: ElementNode | null,
    ) => void;
    onKeyPress?: (
      this: ElementNode,
      e: KeyboardEvent,
      mappedKeyEvent: string | undefined,
      currentFocusedElm: ElementNode,
    ) => KeyHandlerReturn;
    onSelectedChanged?: (
      container: ElementNode,
      activeElm: ElementNode,
      selectedIndex: number | null,
      lastSelectedIndex: number | null,
    ) => void;
    skipFocus?: boolean;
    wrap?: boolean;
    plinko?: boolean;
  }

  interface IntrinsicNodeStyleProps {
    // TODO: Refactor states to use a $ prefix
    focus?: IntrinsicNodeStyleProps;
  }

  interface IntrinsicTextNodeStyleProps {
    // TODO: Refactor states to use a $ prefix
    focus?: IntrinsicTextNodeStyleProps;
  }

  interface TextNode {
    skipFocus?: undefined;
  }
}

let keyMap: Partial<KeyMap> = {
  Left: 'ArrowLeft',
  Right: 'ArrowRight',
  Up: 'ArrowUp',
  Down: 'ArrowDown',
  Enter: 'Enter',
  Last: 'l',
} satisfies DefaultKeyMap;

const [focusPath, setFocusPath] = createSignal<ElementNode[]>([]);
export { focusPath };
export const useFocusManager = (userKeyMap: Partial<KeyMap> = {}) => {
  const keypressEvent = useKeyDownEvent();
  keyMap = {
    ...keyMap,
    ...userKeyMap,
  };
  const keyMapEntries = Object.entries(keyMap);
  createEffect(
    on(
      activeElement,
      (
        currentFocusedElm: ElementNode | null,
        prevFocusedElm: ElementNode | null | undefined,
        prevFocusPath: ElementNode[] = [],
      ) => {
        const newFocusedElms = [];
        let current: ElementNode | null = currentFocusedElm;

        const fp: ElementNode[] = [];
        while (current) {
          if (!current.states.has('focus')) {
            current.states.add('focus');
            isFunc(current.onFocus) &&
              current.onFocus.call(
                current,
                currentFocusedElm,
                prevFocusedElm ?? null,
              );

            newFocusedElms.push(current);
          }
          fp.push(current);
          current = current.parent ?? null;
        }

        prevFocusPath.forEach((elm) => {
          if (!fp.includes(elm)) {
            elm.states.remove('focus');
            isFunc(elm.onBlur) &&
              elm.onBlur.call(elm, currentFocusedElm, prevFocusedElm ?? null);
          }
        });

        setFocusPath(fp);
        return fp;
      },
      { defer: true },
    ),
  );

  createEffect(() => {
    const e = keypressEvent();

    if (e) {
      // Search keyMap for the value of the pressed key
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const foundKeyEntry = keyMapEntries.find(([key, value]) => {
        return value === e.key;
      });
      untrack(() => {
        const fp = focusPath();
        for (const elm of fp) {
          const mappedKeyEvent = foundKeyEntry ? foundKeyEntry[0] : undefined;
          if (mappedKeyEvent) {
            const onKeyHandler =
              elm[`on${mappedKeyEvent}` as keyof KeyMapEventHandlers];
            if (isFunc(onKeyHandler)) {
              if (onKeyHandler.call(elm, e, elm) === true) {
                break;
              }
            }
          } else {
            console.log(`Unhandled key event: ${e.key}`);
          }

          if (isFunc(elm.onKeyPress)) {
            if (elm.onKeyPress.call(elm, e, mappedKeyEvent, elm) === true) {
              break;
            }
          }
        }
        return false;
      });
    }
  });

  return focusPath;
};
