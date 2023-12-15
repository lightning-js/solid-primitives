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

import { ElementNode, type IntrinsicNodeProps, type IntrinsicNodeStyleProps } from "@lightningjs/solid";
import { handleNavigation } from "./navigation.js";

export function Column(props: Partial<IntrinsicNodeProps>) {
  const up = handleNavigation('up');
  const down = handleNavigation('down');
  const defaultStyle : IntrinsicNodeStyleProps = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flexStart',
  };


  return <node
    onUp={up}
    onDown={down}
    onFocus={props.onFocus || (elm => {
      if (!elm || elm.selected === null) return;
      let child = elm.children[elm.selected];
      while (child?.skipFocus) {
        elm.selected++;
        child = elm.children[elm.selected];
      }
      if (!(child instanceof ElementNode)) return;
      child.setFocus();
    })}
    selected={props.selected || 0}
    style={props.style || defaultStyle}
    {...props}>{props.children}</node>
}
