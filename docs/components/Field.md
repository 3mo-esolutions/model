# Field

<!--- MDL: https://material.io/components/text-fields -->

## MoDeL
> ⚠ The MoDeL field does not directly inherit from Material Field, and is implemented as an abstract class, which means that the concrete fields shall be implemented via extending this class. Also, validation is not implemented yet.

### Usage
- "Helper text" has been removed
- "Counter" has been moved to the `trailing` slot.
- "Trailing" and "Leading" icons are not explicitly defined as icons. Use `trailing` and `leading` slots which can accept all HTML elements, instead.

### Design
- Non-dense fields shall not be used without labels.

### TBD
- Dark mode and light theme
- Designs for bottom line
- Font size in Field
- Padding
- Designs for readonly (inactive), disabled, hover
- Document differences to Material
- Document derived field components: FieldAmount, FieldDate, FieldNumber, FieldPassword, FieldPercentage, FieldSearch, FieldText, FieldTime
- Minimum width
- Select tooltip in readonly fields (Lösung besonders für das Multiselectfeld)
- Animations
- The field in Dark mode goes darker, despite the Material Design's specs.
- Selection on focus

### Color TBD
- Guides zur Generierung neuer Farben besonders Grautöne >> rgba(var(--mo-color-foreground-base), 0.04)