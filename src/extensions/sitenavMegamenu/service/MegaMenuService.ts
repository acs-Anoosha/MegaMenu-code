import pnp from 'sp-pnp-js';
import { Web } from 'sp-pnp-js/lib/sharepoint/webs';

import { TopLevelMenu } from '../model/TopLevelMenu';
import { FlyoutColumn } from '../model/FlyoutColumn';
import { Link } from '../model/Link';
import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';

import { sampleData } from './MegaMenuSampleData';
import { SiteUser,CurrentUser } from 'sp-pnp-js/lib/sharepoint/siteusers';

export class MegaMenuService {

    private static readonly useSampleData: boolean = false;

    private static readonly level1ListName: string = "MegaMenuLevel1";
    private static readonly level2ListName: string = "MegaMenuLevel2";
  //  private static readonly level3ListName: string = "Mega Menu - Level 3";

    private static readonly cacheKey: string = "MegaMenuTopLevelItems";


    // Get items for the menu and cache the result in session cache.
    public static getMenuItems(siteCollectionUrl: string): Promise<TopLevelMenu[]> {
  debugger;
        if (!MegaMenuService.useSampleData) {

            return new Promise<TopLevelMenu[]>((resolve, reject) => {

                // See if we've cached the result previously.
                var topLevelItems: TopLevelMenu[] = pnp.storage.session.get(MegaMenuService.cacheKey);

                if (topLevelItems) {
                    console.log("Found mega menu items in cache.");
                    resolve(topLevelItems);
                }
                else {
                    
                    this.getUserGroups().then((uid)=>{
                        debugger;
                        let UIDlen=uid.length;
                        console.log("Didn't find mega menu items in cache, getting from list.");

                        var level1ItemsPromise = MegaMenuService.getMenuItemsFromSp(MegaMenuService.level1ListName, siteCollectionUrl,UIDlen);
                        var level2ItemsPromise = MegaMenuService.getMenuItemsFromSp(MegaMenuService.level2ListName, siteCollectionUrl,UIDlen);
                //        var level3ItemsPromise = MegaMenuService.getMenuItemsFromSp(MegaMenuService.level3ListName, siteCollectionUrl);
    
                       // Promise.all([level1ItemsPromise, level2ItemsPromise, level3ItemsPromise])
                       Promise.all([level1ItemsPromise, level2ItemsPromise])
                            .then((results: any[][]) => {
                                debugger;
                                topLevelItems = MegaMenuService.convertItemsFromSp(results[0], results[1]);
                              //   topLevelItems = MegaMenuService.convertItemsFromSp(results[0], results[1], results[2]);
                                // Store in session cache.
                                pnp.storage.session.put(MegaMenuService.cacheKey, topLevelItems);
                                resolve(topLevelItems);
                            });

                    });

                   
                }
            });
        }
        else {
            return new Promise<TopLevelMenu[]>((resolve, reject) => {
                resolve(sampleData);
            });
        }

    }
    private static  getUserGroups(): Promise<any[]>{
        debugger;
        return new Promise<any[]>((resolve, reject) => {
                let UserIDs=[] ;let uid='';
            // let web = new Web('https://sbifm.sharepoint.com/sites/EasyApproval');
             let web = new Web('https://advcomp.sharepoint.com/sites/hub/ModernSite/ModernChild/');                  
  web.currentUser.get().then((r:CurrentUser) => {
             uid=r['Id'];
             console.log(uid);
                   web.siteGroups.getByName("ModernUsers").users.get().then((u: any) => {
           
            u.forEach((user: SiteUser) =>{
                
                if(uid==user["Id"]){ UserIDs.push(user["Id"]);}
               
                resolve(UserIDs);
            });    
            
        }); 
          
          });
      
        
      });
      }
    // Get raw results from SP.
    private static getMenuItemsFromSp(listName: string, siteCollectionUrl: string,UIDlen:number): Promise<any[]> {
        
debugger;


        return new Promise<TopLevelMenu[]>((resolve, reject) => {
            let filterOption ="Admin eq 'No'";
// this.getUserGroups().then((uid)=>{
    if(UIDlen>0){filterOption="Admin eq 'Yes' or Admin eq 'No'";}
    
         //   let web = new Web(siteCollectionUrl);
let web = new Web("https://advcomp.sharepoint.com/sites/hub/ModernSite/ModernChild/")
            // TODO : Note that passing in url and using this approach is a workaround. I would have liked to just
            // call pnp.sp.site.rootWeb.lists, however when running this code on SPO modern pages, the REST call ended
            // up with a corrupt URL. However it was OK on View All Site content pages, etc.
            // Added by Amar - .filter("substringof('"+filterOption+"',Admin)")
            web.lists
                .getByTitle(listName)
                .items
               // .orderBy("SortOrder")
                .filter(filterOption)
                .get()
                  .then((items: any[]) => {
                    console.log(items.length);
                    resolve(items);
                })
                .catch((error: any) => {
                    debugger;
                    reject(error);
                });
        });

  //  });

    }


    // Convert results from SP into actual entities with correct relationships.
    private static convertItemsFromSp(level1: any[], level2: any[]): TopLevelMenu[] {

        var level1Dictionary: { [id: number]: TopLevelMenu; } = {};
        var level2Dictionary: { [id: number]: FlyoutColumn; } = {};

        // Convert level 1 items and store in dictionary.
        var level1Items: TopLevelMenu[] = level1.map((item: any) => {
            var newItem = {
                key: item.ID,
                id: item.Id,
                text: item.Title,
                columns: []
            };

            level1Dictionary[newItem.id] = newItem;

            return newItem;
        });

        // Convert level 2 items and store in dictionary.
        var level2Items: FlyoutColumn[] = level2.map((item: any) => {
            debugger
            var newItem = {
                id: item.Id,
                heading: {
                    key: item.ID,
                    text: item.Title,
                    columns: [],
                  //  url: item.Url ? item.Url.Url : "",
                    //openInNewTab: item.OpenInNewTab
                },
                links: [],
                level1ParentId: item.Level1ItemId
            };

            level2Dictionary[newItem.id] = newItem;

            return newItem;
        });

     

        // Now link the entities into the desired structure.
        

        for (let l2 of level2Items) {
            level1Dictionary[l2.level1ParentId].columns.push(l2);
        }

        var retVal: TopLevelMenu[] = [];

        for (let l1 of level1Items) {
            retVal.push(l1);
        }

        return retVal;

    }
}