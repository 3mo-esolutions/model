# Debouncer

If some functions are heavy processes and should not be called frequently, decorate them with the `@debounce(duration?)` decorator factory, so it is not called more frequent that the specified duration in milliseconds.

```ts
@debounce()
function someHeavyFunction() {
    // Heavy lifting now
}
```