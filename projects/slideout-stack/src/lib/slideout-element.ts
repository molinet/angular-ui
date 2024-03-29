import { ComponentRef } from "@angular/core";

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
   * Returns a promise that resolves when the slideout dismisses.
   */
  onDismissed: Promise<void>;
}
