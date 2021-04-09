# Event Handlers

MoDeL uses the native [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent) web APIs, but with added tools to improve developer experience.

## @event() Decorator Factory
`@event` decorator factory is an abstraction for working with native CustomEvents. It exposes 3 functions to `dispatch`, `unsubscribe`, `subscribe` and to the events.

It accepts a generic parameters which describes the type of CustomEvent's `detail` property, which is used often to pass some data back to the subscriber.

Also notice the `@fires` JS-comment. This enables lit-analyzer to identify the event handlers.

```ts
	file:"model/samples/sample-client/components/CounterButton.ts"
```

```ts
	file:"model/samples/sample-client/pages/PageHome.ts"
```