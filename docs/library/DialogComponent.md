# Dialog Components

Dialog Components are defined as components which extend the provided `DialogComponent` class.

## Create a Dialog
Creating dialog are just like [creating components](./component-creation.md) with the difference that you should extend the `DialogComponent` class.

> ✔ Conventionally, the name of a dialog component class starts with `Dialog` e.g. `DialogMember`

## Differences to Component
Dialog components have 3 differences to a regular component.

### 1. Root Element
It must contain a `mo-dialog` element in its root. It has relevant properties for a dialog such as `header`, `size`, `..primaryButtonClicked`, etc.

### 2. Parameters

Provide the generic parameter to shape the `parameters` property of the `DialogComponent` class. It is then required for creating every instance of that dialog component. A record is allowed.

### 3. Authorizations
It can check for the authorizations and fallback to a 403 error message if authorizations are denied/

```ts
@authorize('authorization1', 'authorization2')
@component('app-dialog-name')
export class DialogMember extends DialogComponent<{ member: Member }> {
	protected render = () => html`
		<mo-dialog header='Header'>
			The name of the member is: ${this.parameters.member.name}
		</mo-dialog>
	`
}
```