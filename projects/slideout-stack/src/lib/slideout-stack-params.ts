import { ComponentType } from '@angular/cdk/portal';

import { SlideOutStackOptions } from './slideout-stack-options';

/**
 * Parameters for a slideout to display in the stack.
 * @author molinet
 */
export interface SlideOutStackParams {
  /**
   * The component to display in the slideout.
   */
  component: ComponentType<any>;
  /**
   * The custom properties to pass to the component.
   */
  properties?: { [key: string]: any };
  /**
   * The options for the slideout.
   */
  options?: SlideOutStackOptions;
}
