import Color from 'color'

export enum Mode {
  LIGHT = 'light',
  DARK = 'dark',
}

export class BaseColor {
  constructor(
    public name: string,
    public h: number,
    public s: number,
    public b: number,
  ) {
    this.name = name
    this.h = h
    this.s = s
    this.b = b
  }

  toHex(): string {
    const h = Math.max(0, Math.min(360, this.h)) // Ensure hue is between 0 and 360
    const s = Math.max(0, Math.min(100, this.s)) // Ensure saturation is between 0 and 100
    const b = Math.max(0, Math.min(100, this.b)) // Ensure brightness is between 0 and 100

    return Color.hsl(h, s, b).hex()
  }
}

export interface ColorPalette {
  // primary brand color
  brand: Record<string, Color>
  // Errors, Confirmations, Alerts, Dialogs
  // used less often than brand colors to draw attention or communicate sth to the user.
  accents: Record<string, Color>
  // Backgrounds, Borders, Dividers, Text, Icons, Disabled elements
  neutrals: Record<string, Color>
}

export interface Shade {
  name: string
  base: Color
  range: Record<number, Color>
}
