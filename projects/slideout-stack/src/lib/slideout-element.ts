import { ComponentRef } from "@angular/core";

import { SlideOutStackResult } from "./slideout-stack-result";

/**
 * Represents a slideout element.
 * @author molinet
 */
export interface SlideOutElement {
  /**
   * The component reference of the slideout.
   */
  component: ComponentRef<any>;
  /**
   * Promise resolved when the slideout dismisses. Contains the result of the slideout.
   */
  onDismissed: Promise<SlideOutStackResult>;
}
