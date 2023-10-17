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

export function isFunc<T = (...args: unknown[]) => unknown>(item: T): item is NonNullable<T> {
  return typeof item === 'function';
}

export function isObject(
  item: unknown,
): item is Record<string | number | symbol, unknown> {
  return typeof item === 'object';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isArray(item: unknown): item is any[] {
  return Array.isArray(item);
}

export function isString(item: unknown): item is string {
  return typeof item === 'string';
}

export function isNumber(item: unknown): item is number {
  return typeof item === 'number';
}

export function isInteger(item: unknown): item is number {
  return Number.isInteger(item);
}

export function keyExists(
  obj: Record<string | number | symbol, unknown>,
  keys: (string | number | symbol)[],
) {
  for (const key of keys) {
    if (key in obj) {
      return true;
    }
  }
  return false;
}

/**
 * Asserts a condition is truthy, otherwise throws an error
 *
 * @remarks
 * Useful at the top of functions to ensure certain conditions, arguments and
 * properties are set/met before continuing. When using this function,
 * TypeScript will narrow away falsy types from the condition.
 *
 * @param condition
 * @param message
 * @returns
 */
export function assertTruthy(
  condition: unknown,
  message?: string,
): asserts condition {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}
