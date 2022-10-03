import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import ButtonLink from './ButtonLink'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Primitives/ButtonLink',
  component: ButtonLink,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    // backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof ButtonLink>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof ButtonLink> = (args) => (
  <ButtonLink {...args}>ButtonLink Text</ButtonLink>
)

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  variant: 'primary',
  href: '#',
}

export const Secondary = Template.bind({})
Secondary.args = {
  variant: 'secondary',
  href: '#',
}

export const Outline = Template.bind({})
Outline.args = {
  variant: 'outline',
  href: '#',
}

export const Danger = Template.bind({})
Danger.args = {
  variant: 'danger',
  href: '#',
}
