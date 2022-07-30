import { Extension } from '@tiptap/core';
import { PluginKey } from 'prosemirror-state';
import { BubbleMenuLinkFormComponent } from './components/bubble-menu-link-form/bubble-menu-link-form.component';
import { ViewContainerRef } from '@angular/core';
import { bubbleLinkFormPlugin } from '../plugins/bubble-link-form.plugin';
import { Props } from 'tippy.js';

export interface BubbleLinkFormOptions {
    pluginKey: PluginKey;
    tippyOptions?: Partial<Props>;
    element: HTMLElement | null;
}
export interface PluginStorage {
    show: boolean;
}

declare module '@tiptap/core' {
    interface Storage {
        bubbleLinkForm: PluginStorage;
    }
}
export const LINK_FORM_PLUGIN_KEY = new PluginKey('addLink');

export const BubbleLinkFormExtension = (viewContainerRef: ViewContainerRef) => {
    return Extension.create<BubbleLinkFormOptions>({
        name: 'bubbleLinkForm',
        defaultOptions: {
            element: null,
            tippyOptions: {},
            pluginKey: LINK_FORM_PLUGIN_KEY
        },

        addStorage() {
            return {
                show: true
            };
        },

        addProseMirrorPlugins() {
            const component = viewContainerRef.createComponent(BubbleMenuLinkFormComponent);
            component.changeDetectorRef.detectChanges();

            return [
                bubbleLinkFormPlugin({
                    pluginKey: this.options.pluginKey,
                    editor: this.editor,
                    element: component.location.nativeElement,
                    tippyOptions: this.options.tippyOptions,
                    storage: this.storage,
                    component: component
                })
            ];
        }
    });
};
