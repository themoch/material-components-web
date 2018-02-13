/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {strings, cssClasses} from './constants';
import MDCFoundation from '@material/base/foundation';

/**
 * @extends {MDCFoundation<!MDCTopAppBarFoundation>}
 * @final
 */
export default class MDCTopAppBarFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /**
   * {@see MDCTopAppBarAdapter} for typing information on parameters and return
   * types.
   * @return {!MDCTopAppBarAdapter}
   */
  static get defaultAdapter() {
    return /** @type {!MDCTopAppBarAdapter} */ {
      hasClass: (/* className: string */) => /* boolean */ false,
      addClass: (/* className: string */) => {},
      removeClass: (/* className: string */) => {},
      registerScrollHandler: (/* handler: EventListener */) => {},
      deregisterScrollHandler: (/* handler: EventListener */) => {},
      getViewportScrollY: () => /* number */ 0,
      totalActionIcons: () => /* number */ 0,
    };
  }

  /**
   * @param {!MDCTopAppBarAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCTopAppBarFoundation.defaultAdapter, adapter));

    this.isCollapsed = false;

    this.scrollHandler_ = this.shortAppBarScrollHandler.bind(this);
  }

  init() {
    if (this.isShortAppBar()) {
      this.adapter_.registerScrollHandler(this.scrollHandler_);
      this.styleShortAppBar();
    }
  }

  destroy() {
    this.adapter_.deregisterScrollHandler(this.scrollHandler_);
  }

  /** @return {boolean} */
  isShortAppBar() {
    return this.adapter_.hasClass(cssClasses.SHORT_CLASS);
  }

  /**
   * Class used to set the initial style of the short top app bar
   */
  styleShortAppBar() {
    if (this.adapter_.totalActionIcons() > 0) {
      this.adapter_.addClass(cssClasses.RIGHT_ICON_CLASS);
    }
  }

  /**
   * Scroll handler for the applying/removing the closed modifier class
   * on the short top app bar.
   */
  shortAppBarScrollHandler() {
    const currentScroll = this.adapter_.getViewportScrollY();

    if (currentScroll === 0) {
      if (this.isCollapsed) {
        this.adapter_.removeClass(cssClasses.SHORT_CLOSED_CLASS);
        this.isCollapsed = false;
      }
    } else {
      if (!this.isCollapsed) {
        this.adapter_.addClass(cssClasses.SHORT_CLOSED_CLASS);
        this.isCollapsed = true;
      }
    }
  }
}
