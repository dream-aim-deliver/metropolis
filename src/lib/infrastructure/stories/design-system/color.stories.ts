import { Meta, StoryObj } from '@storybook/react'
import { Color } from '../../component-library/design-system/color'
import { BrandColor, BrandSecondaryColor } from '@/lib/core/entities/theme/colors'
const meta = {
  title: 'Design System/Colors',
  component: Color,
} satisfies Meta<typeof Color>

export default meta

type Story = StoryObj<typeof meta>


export const Brand: Story = {
  args: {
    name: 'Brand Primary',
    h: BrandColor.h,
    s: BrandColor.s,
    b: BrandColor.b,
  },
}

export const BrandSecondary: Story = {
  args: {
    name: 'Brand Primary',
    h: BrandSecondaryColor.h,
    s: BrandSecondaryColor.s,
    b: BrandSecondaryColor.b,
  },
}

