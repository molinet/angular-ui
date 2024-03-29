# SlideOutStack

A service that controls a stack of slideout elements.

## Overview

The `SlideOutStackController` provides methods to manage a stack of slideout elements in an Angular application. slideout elements are components that can be presented and dismissed with animations.

## Installation

```bash
npm install @molinet/slideout-stack --save
```

### Package dependencies

This package uses [`@angular/cdk`](https://www.npmjs.com/package/@angular/cdk) as a dependency. Run this command to install `@angular/cdk` if you haven't already:

```bash
npm install @angular/cdk
```

### Import styles

Add the styles in your `angular.json` file:

```json
"styles": [
  "./node_modules/@molinet/slideout-stack/styles/styles.scss"
]
```

## Usage

Inject `SlideOutStackController` into your component or service:

```typescript
import { SlideOutStackController } from "@molinet/slideout-stack";

constructor(private slideOutStackController: SlideOutStackController) { }
```

## API

### Methods

#### `config(options: SlideOutStackOptions): void`

Configures the global options for the slideouts. When a slideout is pushed without options, the global options will be used.

- `options`: The default [`SlideOutStackOptions`](#slideoutstackoptions) for all the slideouts.

#### `push(component: ComponentType<any>, options?: SlideOutStackOptions): SlideOutElement`

Pushes and displays a new [`SlideOutElement`](#slideoutelement) to the stack.

The [`SlideOutElement`](#slideoutelement) will be presented with the `options` passed.

If an option is not passed, the global option configured with the `config` method will be used.

If no global option is configured, the default option will be used.

- `component`: The component to be presented into the slideout.
- `options` (optional): Options for the slideout.

Returns a [`SlideOutElement`](#slideoutelement) representing the pushed slideout.

#### `pop(): void`

Pops the top [`SlideOutElement`](#slideoutelement) from the stack. It will be dismissed with the `options` passed in the `push` method.

### Interfaces

#### `SlideOutStackOptions`

Options for the slideout element.

- `animationDuration` (optional): Duration of the animation in milliseconds. Default is `400`.
- `backdropDismiss` (optional): Boolean indicating whether clicking on the backdrop should dismiss the slideout. Default is `false`.
- `backdropOpacity` (optional): Opacity of the backdrop. Default is `0.3` (backdrop color is black).
- `fromEdge` (optional): The edge from which the slideout should appear. Default is `right`.
- `width` (optional): Width of the top slideout. Default is `80%` of the window total width. It can also be set in pixels.

#### `SlideOutElement`

Represents a slideout element.

- `component`: The component reference of the slideout.
- `onDismissed`: Returns a promise that resolves when the slideout dismisses.

## Example

```typescript
import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';

import { SlideOutStackController } from '@molinet/slideout-stack';

@Component({
  selector: 'app-example',
  template: `
    <button (click)="pushSlideOut()">Open slideout</button>
  `
})
export class ExampleComponent implements OnInit {

  public constructor(
    private slideOutStackController: SlideOutStackController
  ) { }

  public ngOnInit(): void {
    // Configure some global options
    this.slideOutStackCtrl.config({
      animationDuration: 1500,
      backdropDismiss: true
    });
  }

  public pushSlideOut(): void {
    // Push a new slideout onto the stack
    this.slideOutStackController.push(MyComponent, {
      animationDuration: 500, // Will override the global option
      backdropOpacity: 0.5,
      fromEdge: 'right',
      width: '70%'
    }).onDismissed.then(() => {
      // Occurs when the component has been popped
      console.log('MyComponent dismissed');
    });
  }

  popSlideOut() {
    // Pop the top slideout from the stack
    this.slideOutStackController.pop();
  }
}
```

### License

This library is licensed under the MIT License. See the LICENSE file for details.
