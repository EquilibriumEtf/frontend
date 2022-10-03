import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { PriceChange } from './PriceChange'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Vaults/PriceChange',
  component: PriceChange,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof PriceChange>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof PriceChange> = (args) => (
  <PriceChange {...args} />
)

export const Up = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Up.args = {
  change: 2.56,
}

export const Down = Template.bind({})
Down.args = {
  change: -12.59,
}

export const Neutral = Template.bind({})
Neutral.args = {
  change: 0,
}
