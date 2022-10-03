import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Address } from './Address'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Vaults/Address',
  component: Address,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Address>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Address> = (args) => <Address {...args} />

export const Default = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  address: 'juno1cdzspjq58ggdfxp3cjm9ggmdynkxrsvzs3t0w4',
  copy: true,
}

export const Long = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Long.args = {
  address: 'juno1cdzspjq58ggdfxp3cjm9ggmdynkxrsvzs3t0w4',
  extLink: 'https://google.com',
  copy: true,
  truncate: false,
}
