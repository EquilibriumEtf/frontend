import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import Fieldset from './Fieldset'
import Input from './Input'
import Select from './Select'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Primitives/Fieldset',
  component: Fieldset,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Fieldset>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Fieldset> = (args) => (
  <Fieldset {...args}>
    <Input id="input-1" label="Input 1" />
    <Input id="input-2" label="Input 2" />
    <Input id="input-3" label="Input 3" />
    <Select id="select-1">
      <option value="">Select...</option>
      <option value="a">Option A</option>
      <option value="b">Option B</option>
    </Select>
  </Fieldset>
)

export const WithLabel = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
WithLabel.args = {
  id: 'fieldset',
  label: 'Fieldset Label',
}
