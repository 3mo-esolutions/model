# Components

Enabling component-based UI development is one of the most (if not the most) important requirements for large-scale applications, as it makes the code maintainable and enables code reusability throughout projects.

## Technology

MoDeL uses **Web Components** to achieve this goal. Web Components are native capabilities of the modern web and is the backbone of MoDeL's component model. Web Components is a suite of different technologies allowing you to create reusable custom elements with their functionality encapsulated away from the rest of your code and utilize them in your web apps:

### 1. Custom Elements

Custom Elements API provides the ability to create new HTML-tags against a JavaScript class.
> ⚠ The tag name must include a dash (`-`) as the names without a dash are reserved for global tags.

### 2. HTML Templates

HTML Templates are around a long time. Now they are used to generate dynamic templates for Web Components.

The `<template>` and `<slot>` elements enable you to write markup templates that are not displayed on the rendered page. These can then be reused multiple times as the basis of a custom element's structure.

### 3. Shadow DOM

APIs for attaching an encapsulated "shadow" DOM tree to an element, which is rendered separately from the main document DOM, and controlling associated functionality. In this way, you can keep an element's features private, so they can be scripted and styled without the fear of collision with other parts of the document, which enables component isolation.

Component encapsulation includes **styles** and **markup** isolation. As a result, you never have to worry about CSS selectors or HTML-element ids leaking out of the component, however, the cost of this is that you couldn't use CSS classes for styling UI, as global CSS classes do not leak into the components. In those situations, you should probably create a new component and encapsulate not only the styling but also the functionality.

> ✔ Simplify the naming of HTML-element ids and CSS classes as they do not leak out. Shadow DOM helps to simplify the naming a lot.

### Result

All results in a ECMAScript 2015 (ECMAScript 6) class module which can get imported and consumed very easily.
In the HTML-side of things, it is available via a new registered HTML-Tag which can be used as if it were a native element.

## Component Class

As you see, Web Components are a low-level set of APIs. Consuming it involves code boilerplate and ceremonies.

One of the Goals of MoDeL is to simplify creating Web Components using a declarative approach via the `Component` class, which itself build upon the [**LitElement**](https://github.com/lit/lit) base class of lit project.