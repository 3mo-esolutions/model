# Feature Flags

> ✔ Use feature flags to build optional functionalities which work on a per-demand basis

## Define Feature Flags
Feature flags are defined via `define` method of the `FeatureFlagHelper` and populated as switchable list items in global settings page.

## Decide based on Feature Flags
`FeatureFlagHelper` also provides `isActivated` method which checks if those flags are activated. Other methods are used in MoDeL itself to render the list in the settings page etc.

```ts
file:"/helpers/FeatureFlagHelper.ts"
```
