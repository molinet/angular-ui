# SlideOutStack

A service that controls a stack of slideout elements.

**Table of Contents**

- [Overview](#overview)
- [Installation](#installation)
  - [Package dependencies](#package-dependencies)
  - [Import styles](#import-styles)
  - [Injection](#injection)
- [API Reference](#api-reference)
  - [Methods](#methods)
    - [config(options: SlideOutStackOptions): void](#configoptions-slideoutstackoptions-void)
    - [push(params: SlideOutStackParams): SlideOutElement](#pushparams-slideoutstackparams-slideoutelement)
    - [pop(result?: SlideOutStackResult): void](#popresult-slideoutstackresult-void)
  - [Interfaces](#interfaces)
    - [SlideOutStackOptions](#slideoutstackoptions)
    - [SlideOutStackParams](#slideoutstackparams)
    - [SlideOutElement](#slideoutelement)
    - [SlideOutStackResult](#slideoutstackresult)
- [Full example](#full-example)

## Overview

The `SlideOutStackController` provides methods to manage a stack of slideout elements in an Angular application. Slideout elements are components that can be presented and dismissed with animations.

![slideout-stack-example](https://raw.githubusercontent.com/molinet/angular-ui/main/projects/slideout-stack/src/assets/examples/slideout-stack-example.gif)

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

### Injection

Inject `SlideOutStackController` into your component or service:

```typescript
import { SlideOutStackController } from '@molinet/slideout-stack';

public constructor(private slideOutStackCtrl: SlideOutStackController) { }
```

## API Reference

### Methods

#### `config(options: SlideOutStackOptions): void`

> Configures the global options for the slideouts. When a slideout is pushed without options, the global options will be used.

| Parameter | Type | Description |
| -- | -- | -- |
| `options` | [`SlideOutStackOptions`](#slideoutstackoptions) | Default options for all the slideouts. |

**Example:**

```typescript
this.slideOutStackCtrl.config({
  animationDuration: 800,
  backdropDismiss: true,
  backdropOpacity: 0.6,
  fromEdge: 'left',
  width: '75%'
});
```

#### `push(params: SlideOutStackParams): SlideOutElement`

> Pushes and displays a new `SlideOutElement` to the stack.

- Custom data can be passed to the component with the `params.properties` parameter.
- The `SlideOutElement` will be presented according to the `params.options` passed.
- If an option is not passed, the global option configured with the `config` method will be used.
- If no global option is configured, the default option will be used.

**Returns:** [`SlideOutElement`](#slideoutelement)

| Parameter | Type | Description |
| -- | -- | -- |
| `params` | [`SlideOutStackParams`](#slideoutstackparams) | The parameters for the slideout. |

**Example:**

```typescript
const slideOutEl: SlideOutElement = this.slideOutStackCtrl.push({
  component: MyComponent
});

slideOutEl.onDismissed.then(() => {
  console.log('MyComponent dismissed');
});
```

#### `pop(result?: SlideOutStackResult): void`

> Pops the top `SlideOutElement` from the stack if exists. It will be dismissed according the `params.options` passed in the `push` method.

| Parameter | Type | Description |
| -- | -- | -- |
| `result` | [`SlideOutStackResult`](#slideoutstackresult) | (optional) Result returned by the slideout when popped. |

**Example:**

```typescript
this.slideOutStackCtrl.pop({
  data: 'Custom output data',
  role: 'accept'
});
```

### Interfaces

#### `SlideOutStackOptions`

| Property | Type | Default | Description |
| -- | -- | -- | -- |
| `animationDuration` | `number` | `400` | (optional) Duration of the animation in milliseconds. |
| `backdropDismiss` | `boolean` | `false` | (optional) Indicates whether clicking on the backdrop should close the slideout. If set to `true`, it will return `{role: 'backdrop'}` as a `SlideOutStackResult` when backdrop is clicked. |
| `backdropOpacity` | `number` | `0.3` | (optional) Opacity of the backdrop between `0` and `1`. Note: backdrop color is black. |
| `fromEdge` | `type` | `right` | (optional) The edge from which the slideout should appear. Possible values are `left` and `right`. |
| `width` | `string` | `80%` | (optional) Width of the top slideout. It can also be set in pixels (e.g. `250px`). |

#### `SlideOutStackParams`

| Property | Type | Description |
| -- | -- | -- |
| `component` | `ComponentType<any>` | The component to be presented into the slideout. |
| `properties` | `{[key: string]: any}` | (optional) Custom data to pass to the component. |
| `options` | [`SlideOutStackOptions`](#slideoutstackoptions) | (optional) Options for the slideout. |

#### `SlideOutElement`

| Property | Type | Description |
| -- | -- | -- |
| `component` | `ComponentRef<any>` | The component reference of the slideout. |
| `onDismissed` | `Promise<SlideOutStackResult>` | Promise resolved when the slideout dismisses. Contains the result of the slideout. |

#### `SlideOutStackResult`

| Property | Type | Description |
| -- | -- | -- |
| `data` | `any` | (optional) Data returned by the slideout when popped. |
| `role` | `string` | (optional) Role returned by the slideout when popped. |

## Full example

`app-example.component.ts`

```typescript
import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { SlideOutStackController } from '@molinet/slideout-stack';
import { MyComponent } from './my-component';

@Component({
  selector: 'app-example',
  template: `
    <h1>App example</h1>
    <button (click)="pushSlideOut()">Open slideout</button>
  `
})
export class ExampleComponent implements OnInit {

  public constructor(
    private slideOutStackCtrl: SlideOutStackController
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
    this.slideOutStackCtrl.push({
      component: MyComponent,
      properties: {
        data: 'Custom input data'
      },
      options: {
        animationDuration: 500, // Overrides the global option
        backdropOpacity: 0.5,
        fromEdge: 'right',
        width: '70%'
      }
    }).onDismissed.then((result) => {
      // Occurs when the slideout has been popped
      if (result.role === 'accept') {
        console.log(result); // Outputs 'Custom output data'
      }
    });
  }
}
```

`my-component.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'my-component',
  template: `
    <h1>My component</h1>
    <button (click)="popSlideOut()">Close slideout</button>
  `
})
export class MyComponent implements OnInit {

  public data!: string;

  public constructor(
    private slideOutStackCtrl: SlideOutStackController
  ) { }

  public ngOnInit(): void {
    console.log(this.data); // Outputs 'Custom input data'
  }

  public popSlideOut() {
    // Pop the top slideout from the stack
    this.slideOutStackCtrl.pop({
      data: 'Custom output data',
      role: 'accept'
    });
  }
}
```

### License

This library is licensed under the MIT License. See the LICENSE file for details.
