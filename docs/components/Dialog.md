# Dialog

<!--- MDL: https://material.io/design/components/dialogs.html -->

<!--- MWC: https://github.com/material-components/material-components-web-components/tree/master/packages/dialog -->

## MoDeL

### Usage
- Dialogs shall not be obscured by other elements, with the exception of "context menu" and "snackbar"
- If possible, the verbal actions shall be formulated in the buttons, especially in [confirming actions](https://material.io/components/dialogs#actions). These, in most cases, build a sentence or a statement with the header, e.g.
	- Header: "Product 1" + Primary Button: "Delete" => "Delete the Product 1"
	- Header: "Positions Unavailable" + Primary Button: "Proceed Anyway" => "Proceed Anyway despite positions are unavailable"
- Dialogs with [acknowledgement actions](https://material.io/components/dialogs#actions) can be converted to a Snackbar, unless the message is very important.
- Dialogs with [acknowledgement actions](https://material.io/components/dialogs#actions) with only expect the multiple or single selection of one list, shall be ignored and outsourced to the FieldSelect component which also supports multiple selection.

## API
- The min-width, max-width and min-height of the Dialog can be overwritten via the CSS properties `--mdc-dialog-max-width`, `--mdc-dialog-min-width`, `--mdc-dialog-min-height`
The `size` (`small` | `medium`| `large`) property act as **presets** for these CSS properties

| Type | min-width | max-width | min-height |
|-|-|-|-|
| Small | 320px | 480px | auto |
| Medium | calc(100% - 32px) | 1024px | 768px |
| Large | 1680px | calc(100% - 32px) | calc(100% - 32px) |

### Design
- The new X icon-button handled the "cancel" action, therefore a "cancel" button is not necessary. This icon-button also reacts to the case in which the dialog is marked as a "blocking" dialog.
- To distinguish the primary button, this shall be a "raised" button by default.
- The Padding of the actions footer has been overwritten to 16px as the convention for the primary-action-button in 3MO is "raised"
- There are 3 presets of  and `large` with overwrite the CSS variables
- The min-width of the small variant has been overwritten

### [TBD]
- Scroll-Linie in Large?
- wegen des neuen Elements "Footer" verschwindet der Dialog-Footer nicht mehr, wenn keine Buttons vorhanden sind
- Default `primaryButtonText` -> "OK" | undefined
- Clicked vs Handler