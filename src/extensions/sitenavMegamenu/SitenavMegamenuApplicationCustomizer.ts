import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';

import { Dialog } from '@microsoft/sp-dialog';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';

import * as React from 'react';
import * as ReactDom from 'react-dom';
import { MegaMenu, IMegaMenuProps } from './components/MegaMenu';
import { MegaMenuService } from './service/MegaMenuService';
import { TopLevelMenu } from './model/TopLevelMenu';

import * as strings from 'SitenavMegamenuApplicationCustomizerStrings';

const LOG_SOURCE: string = 'SitenavMegamenuApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISitenavMegamenuApplicationCustomizerProperties {
  // This is an example; replace with your own property
  testMessage: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SitenavMegamenuApplicationCustomizer
  extends BaseApplicationCustomizer<ISitenavMegamenuApplicationCustomizerProperties> {

    private _topPlaceholder: PlaceholderContent | undefined;
    @override
    public onInit(): Promise<void> {
      debugger;
      MegaMenuService.getMenuItems(this.context.pageContext.site.absoluteUrl)
        .then((topLevelMenus: TopLevelMenu[]) => {
          console.log("menu items called")
          this._renderPlaceHolders(topLevelMenus);
  
  
        }).catch((error) => { console.log("Error in loading the Mega Menu" + error); });
      return Promise.resolve();
    }
  
    private _renderPlaceHolders(menuItems: any): void {
      // Handling the top placeholder
      if (!this._topPlaceholder) {
        this._topPlaceholder =
          this.context.placeholderProvider.tryCreateContent(
            PlaceholderName.Top,
            { onDispose: this._onDispose });
  
        if (!this._topPlaceholder) {
          console.error('The expected placeholder (Top) was not found.');
          return;
        }
        const element: React.ReactElement<IMegaMenuProps> = React.createElement(
          MegaMenu,
          {
            topLevelMenuItems: menuItems
          });
  
        ReactDom.render(element, this._topPlaceholder.domElement);
      }
    }
  
    private _onDispose(): void {
      console.log('[MegaMenuApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
    }

}
