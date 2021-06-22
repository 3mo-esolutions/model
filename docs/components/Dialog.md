# Dialog

<!--- MDL: https://material.io/design/components/dialogs.html -->

<!--- MWC: https://github.com/material-components/material-components-web-components/tree/master/packages/dialog -->

## MoDeL

### Usage
- Dialogs shall not be obscured by other elements, with the exception of "context menu" and "snackbar"
- The verbal actions shall be formulated in the action buttons. These, in most cases, build a sentence or a statement with the header. If not possible, especially in dialogs with [acknowledgement actions](https://material.io/components/dialogs#actions) try to formulate a more generic but context-related statement, or in extreme cases, default to the term "Notice" as removing the header is not allowed because of existance of the "X" icon-button.

| Dialog Actions Type | Header | Primary Button | Formulated Statement |
|-|-|-|-|
| Confirming | Product "Foo" | Save | Save the Product "Foo" |
| Confirming | Rebate "Bar" | Delete | Delete the rebate "Bar" |
| Acknowledgement | Positions Unavailable | Proceed Anyway | Proceed anyway despite some positions are unavailable |
| Acknowledgement | Non-finished Receipts | Continue Anyway | Continue anyway despite some non-finished receipts exist |
| Acknowledgement | Discard Payments? | Discard | Discard payments |
| Acknowledgement | Notice | Continue Anyway | Continue anyway |

- Dialogs with [acknowledgement actions](https://material.io/components/dialogs#actions) can be converted to a Snackbar, unless the message is very important.
- Dialogs with [acknowledgement actions](https://material.io/components/dialogs#actions) with the sole goal of multiple or single selection of a list, shall be ignored and outsourced to the FieldSelect component which also supports multiple selection.

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
- The padding of the actions footer has been overwritten to 16px as the convention for the primary-action-button in 3MO is "raised"
- There are 3 presets of and `large` with overwrite the CSS variables
- The min-width of the small variant has been overwritten
- The footer and header border which only appeared in scrolling dialogs is now extended, and is also always appeared in the large variant.