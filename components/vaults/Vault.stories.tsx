import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Vault } from './Vault'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Vaults/Vault',
  component: Vault,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Vault>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Vault> = (args) => <Vault {...args} />

export const Default = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  name: 'My Vault',
  price: 24.59,
  change: 0.21,
}

export const Large = Template.bind({})
Large.args = {
  name: 'My Vault',
  price: 24.59,
  change: 0.21,
  large: true,
}
