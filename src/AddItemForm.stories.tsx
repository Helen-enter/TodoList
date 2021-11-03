import React from 'react';
// @ts-ignore
import { ComponentStory, ComponentMeta } from '@storybook/react';
import AddItemForm, { AddItemFormPropsType } from "./AddItemForm";
// @ts-ignore
import {action} from "@storybook/addon-actions";

export default {
  title: 'TodoLists/AddItemForm',
  component: AddItemForm,
  argTypes: {
    addItem: {
      description: 'Button clicked!'
    }
  },
} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof AddItemForm> = (args: AddItemFormPropsType) => <AddItemForm {...args} />;

export const AddItemFormStories = Template.bind({});
AddItemFormStories.args = {
    addItem: action('Button clicked!')
};

