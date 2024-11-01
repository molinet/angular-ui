import { EdgeType } from './edge-type';

/**
 * Options for the SlideOutStack.
 * @author molinet
 */
export interface SlideOutStackOptions {
  /**
   * The duration of the animation in milliseconds.
   * Default: 400.
   */
  animationDuration?: number;
  /**
   * Whether the slideout should be dismissed when backdrop is clicked.
   * Default: false.
   */
  backdropDismiss?: boolean;
  /**
   * The opacity of the backdrop.
   * Default: 0.3.
   */
  backdropOpacity?: number;
  /**
   * The edge from which the slideout should appear.
   * Default: "right".
   */
  fromEdge?: EdgeType;
  /**
   * The width of the top slide. Could be a percentage or a fixed value in pixels.
   * Default: 80%.
   */
  width?: string;
}
