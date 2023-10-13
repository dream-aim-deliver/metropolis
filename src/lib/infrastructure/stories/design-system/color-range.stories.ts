import { Meta, StoryObj } from '@storybook/react'
import { Shades } from '../../component-library/design-system/shades'

const meta = {
  title: 'Design System/Shades',
  component: Shades,
} satisfies Meta<typeof Shades>

export default meta

type Story = StoryObj<typeof meta>

export const ColorPicker: Story = {}
