import { ComponentPortal, ComponentType, DomPortalOutlet } from "@angular/cdk/portal";
import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  Injector
} from "@angular/core";

import { SlideOutElement } from "./slideout-element";
import { SlideOutStackOptions } from "./slideout-stack-options";
import {
  DEFAULT_ANIMATION_DURATION,
  DEFAULT_BACKDROP_DISMISS,
  DEFAULT_BACKDROP_OPACITY,
  DEFAULT_FROM_EDGE,
  DEFAULT_WIDTH,
  DOM_PORTAL_OUTLET_ID
} from "./slideout-stack.config";

/**
 * A service that controls a stack of slideout.
 * @author molinet
 */
@Injectable({
  providedIn: "root"
})
export class SlideOutStackController {
  /**
   * The DomPortalOutlet to attach the slideouts.
   */
  private _domPortalOutlet?: DomPortalOutlet;
  /**
   * A flag to prevent multiple pops at the same time.
   */
  private _popping = false;
  /**
   * The stack of slideouts with their options.
   */
  private _slideOutStack: {
    component?: ComponentRef<any>,
    options: SlideOutStackOptions
  }[] = [];
  /**
   * The global options for the slideouts.
   */
  private _globalOptions: SlideOutStackOptions = {
    animationDuration: DEFAULT_ANIMATION_DURATION,
    backdropDismiss: DEFAULT_BACKDROP_DISMISS,
    backdropOpacity: DEFAULT_BACKDROP_OPACITY,
    fromEdge: DEFAULT_FROM_EDGE,
    width: DEFAULT_WIDTH
  };

  public constructor(
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) { }

  /**
   * Configures the global options for the slideouts.
   * 
   * When a slideout is pushed without options, the global options will be used.
   * @param {SlideOutStackOptions} options The global options for the slideouts.
   */
  public config(options: SlideOutStackOptions): void {
    this._globalOptions = {
      ...this._globalOptions,
      ...options
    };
  }

  /**
   * Pushes and displays a new {@link SlideOutElement `SlideOutElement`} to the stack.
   * 
   * The `SlideOutElement` will be presented with the `options` passed.
   * If an option is not passed, the global option configured with the {@link config `config`} method will be used.
   * If no global option is configured, the default option will be used.
   * @param {ComponentType<any>} component The component to be presented into the slideout.
   * @param {SlideOutStackOptions} options The options for the slideout.
   * @returns {SlideOutElement} The `SlideOutElement` pushed to the stack.
   */
  public push(component: ComponentType<any>, options?: SlideOutStackOptions): SlideOutElement {
    if (!this._domPortalOutlet) this._createDomPortalOutlet();

    this._slideOutStack.push({
      options: {
        animationDuration: options?.animationDuration ?? this._globalOptions.animationDuration,
        backdropDismiss: options?.backdropDismiss ?? this._globalOptions.backdropDismiss,
        backdropOpacity: options?.backdropOpacity ?? this._globalOptions.backdropOpacity,
        fromEdge: options?.fromEdge ?? this._globalOptions.fromEdge,
        width: options?.width ?? this._globalOptions.width
      }
    });

    this._presentBackdrop();
    const slideOutElement = this._presentSlideOut(component);
    return slideOutElement;
  }

  /**
   * Pops the top {@link SlideOutElement `SlideOutElement`} from the stack.
   * 
   * The top `SlideOutElement` will be dismissed with the `options` passed
   * in the {@link push `push`} method.
   */
  public pop(): void {
    if (this._popping) return;
    this._popping = true;

    this._dismissTopBackdrop();
    this._dismissTopSlideOut();
  }

  /**
   * Creates a new `DomPortalOutlet`.
   *
   * The `DomPortalOutlet` will be created in the `app-root` element of the application
   * and will be used to attach the slideouts and its backdrops.
   */
  private _createDomPortalOutlet(): void {
    const outlet = document.createElement("div");
    outlet.id = DOM_PORTAL_OUTLET_ID;

    const appRoot = document.querySelector("app-root")!;
    appRoot.insertBefore(outlet, appRoot.firstChild);

    this._domPortalOutlet = new DomPortalOutlet(
      document.querySelector(`#${DOM_PORTAL_OUTLET_ID}`)!,
      this.componentFactoryResolver,
      this.appRef,
      this.injector
    );
  }

  /**
   * Creates a new backdrop into the `DomPortalOutlet`.
   */
  private _presentBackdrop(): void {
    const backdrop = document.createElement("div");
    backdrop.classList.add("backdrop");

    const options = this._slideOutStack[this._slideOutStack.length - 1].options;

    if (options.backdropDismiss) {
      backdrop.addEventListener("click", () => {
        this.pop();
      });
    }

    setTimeout(() => {
      const animationDuration = options.animationDuration!;
      const backdropOpacity = options.backdropOpacity!;

      backdrop.style.transitionDuration = `${animationDuration / 1000}s`;
      backdrop.style.opacity = backdropOpacity.toString();
    }, 0);

    this._domPortalOutlet!.outletElement.appendChild(backdrop);
  }

  /**
   * Creates, shows and returns a new `SlideOutElement`.
   * @param {ComponentType<any>} component The component to be presented into the slideout.
   * @returns {SlideOutElement} The `SlideOutElement` element.
   */
  private _presentSlideOut(component: ComponentType<any>): SlideOutElement {
    const portal = new ComponentPortal(component);
    const componentRef = this._domPortalOutlet!.attachComponentPortal(portal);
    componentRef.location.nativeElement.classList.add("slideout");

    const topSlideOut = this._slideOutStack[this._slideOutStack.length - 1];
    topSlideOut.component = componentRef;

    const element = componentRef.location.nativeElement as HTMLElement;
    const options = topSlideOut.options;
    element.style.width = options.width!;
    element.style[options.fromEdge!] = `-${options.width!}`;
    element.style.transitionDuration = `${options.animationDuration! / 1000}s`;

    setTimeout(() => {
      (componentRef.location.nativeElement as HTMLElement).style[options.fromEdge!] = "0";
    }, 0);

    for (let i = 0; i < this._domPortalOutlet!.outletElement.children.length; i++) {
      if (i < this._domPortalOutlet!.outletElement.children.length - 1) {
        this._domPortalOutlet!.outletElement.children[i].classList.add("expanded");
      }
    }

    const slideOut: SlideOutElement = {
      component: componentRef,
      onDismissed: new Promise<void>((resolve) => {
        componentRef.onDestroy(() => {
          resolve();
        });
      })
    };

    return slideOut;
  }

  /**
   * Dismisses the top backdrop.
   */
  private _dismissTopBackdrop(): void {
    const backdropElems = document.getElementsByClassName("backdrop");
    const topBackdrop = backdropElems[backdropElems.length - 1] as HTMLElement;

    if (topBackdrop) topBackdrop.style.opacity = "0";

    const animationDuration =
      this._slideOutStack[this._slideOutStack.length - 1].options.animationDuration!;

    setTimeout(() => {
      topBackdrop?.remove();
    }, animationDuration);
  }

  /**
   * Dismisses the top slideout.
   */
  private _dismissTopSlideOut(): void {
    const slideOutElems = document.getElementsByClassName("slideout");
    const topSlideout = slideOutElems[slideOutElems.length - 1] as HTMLElement;

    const options = this._slideOutStack[this._slideOutStack.length - 1].options;

    if (topSlideout) {
      const duration = `${options.animationDuration! / 1000}s`;
      topSlideout.style.transitionDuration = duration;
      topSlideout.style[options.fromEdge!] = `-${options.width!}`;
    }

    setTimeout(() => {
      this._slideOutStack[this._slideOutStack.length - 1].component?.destroy();
      this._slideOutStack.pop();

      if (this._slideOutStack.length === 0) {
        this._domPortalOutlet?.dispose();
        this._domPortalOutlet = undefined;
      }

      this._popping = false;
    }, options.animationDuration);

    slideOutElems[slideOutElems.length - 2]?.classList.remove("expanded");
  }
}
