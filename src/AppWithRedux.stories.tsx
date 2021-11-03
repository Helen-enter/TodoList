import React from "react";
// @ts-ignore
import {action} from '@storybook/addon-actions';
// @ts-ignore
import {ComponentStory, ComponentMeta} from '@storybook/react';
import AppWithRedux from "./AppWithRedux";
import {ReduxStoreProviderDecorator} from "./stories/assets/ReduxStoreProviderDecorator";


export default {
    title: 'TodoLists/AppWithRedux',
    component: AppWithRedux,
    decorators: [ReduxStoreProviderDecorator]
} as ComponentMeta<typeof AppWithRedux>

const Template: ComponentStory<typeof AppWithRedux> = () => <AppWithRedux />


export const AppWithReduxStories = Template.bind({});

