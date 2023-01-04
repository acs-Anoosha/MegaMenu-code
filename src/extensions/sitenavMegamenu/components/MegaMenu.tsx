import * as React from 'react';
import { withResponsiveMode, ResponsiveMode } from 'office-ui-fabric-react/lib/utilities/decorators/withResponsiveMode';
import styles from './MegaMenu.module.scss';
import { TopLevelMenu as TopLevelMenuModel } from '../model/TopLevelMenu';
import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IContextualMenuItem, ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';

const logo: any = require('../Images/Logo.png');
const home: any = require('../Images/SBI-Home.jpg');
const logout: any = require('../Images/Logout.png');
const faq: any = require('../Images/FAQ.png');

export interface IMegaMenuProps {
    topLevelMenuItems: TopLevelMenuModel[];
}

export interface IMegaMenuState {
}

export interface IMegaMenuItems {
    identity: string;
    name: string;
    id: number;
    child: IMegaMenuItems[];
}

@withResponsiveMode
export class MegaMenu extends React.Component<IMegaMenuProps, IMegaMenuState> {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    public render(): React.ReactElement<IMegaMenuProps> {
        debugger;
        const commandBarItems: IContextualMenuItem[] = this.props.topLevelMenuItems.map((i) => {
            return (this.projectMenuItem(i, ContextualMenuItemType.Header));
        });
        debugger;
        return (
            <div className={`ms-bgColor-neutralLighter ms-fontColor-white ${styles.app}`}>
                <div className={` ${styles.divAtt}`}></div>
                <div className={`ms-bgColor-neutralLighter ms-fontColor-white ${styles.top}`}>
                  {/* <div className={styles.mobClass}> <a href="/sites/EasyApproval"> <img src={logo} style={{ width: "120px", height: "40px" }}></img></a></div> */}
                    <div style={{ display:"none", width: "120px", fontSize: "20px", color: "#0095DA", marginLeft: "10px", }} className={styles.mobClass}>EasyApproval</div>
                    {/*<div className={styles.mobClass}> <a href="/sites/EasyApproval"> <img src={home} style={{ width: "40px", height: "40px", marginLeft: "10px", borderRadius: "50%" }}></img></a></div>
                   */} 
                   <div className={styles.mobClass}> <a href="https://advancedhub.me"> <img src={home} style={{ width: "40px", height: "40px", marginLeft: "10px", borderRadius: "50%" }}></img></a></div>
                  
                    <CommandBar
                        className={styles.commandBar}
                        isSearchBoxVisible={false}
                        elipisisAriaLabel='More options'
                        items={commandBarItems}
                    />
                    {/*
                    <div className={styles.mobClass}> <a href="https://sbifm.sharepoint.com/:b:/s/EasyApproval/ETZE590B4iRFp1O-R4bn6Y4BQMES5-WMuLjznvnoXD7HSw?e=KHOACT" target="_blank"> <img src={faq} style={{ width: "40px", height: "40px", marginRight: "10px" }}></img></a></div>
                    <div className={styles.mobClass}> <a href="/sites/EasyApproval/_layouts/signout.aspx"> <img src={logout} style={{ width: "40px", height: "40px", marginRight: "10px", borderRadius: "50%" }}></img></a></div>
                      */}  <br />
                </div>
                <div className={` ${styles.divAtt}`}></div>
            </div>
        );
    }
    private projectMenuItem(menuItem: any, itemType: ContextualMenuItemType): IContextualMenuItem {
     debugger;   
        return ({
            key: menuItem.text,
            name: menuItem.text,
            href: menuItem.columns.length == 0 ?
                (menuItem["url"] != undefined ?
                    menuItem["url"]
                    : null)
                : null,
            subMenuProps: menuItem.columns.length > 0 ?
                {
                    items: menuItem.columns.map((i) => {
                        return (this.projectMenuHeading(i, ContextualMenuItemType.Normal));
                    })
                }
                : null
        });
    }

    private projectMenuHeading(menuItem: any, itemType: ContextualMenuItemType): IContextualMenuItem {
        return ({
            key: menuItem.heading.text,
            name: menuItem.heading.text,
            href: menuItem.links.length == 0 ?
                (menuItem.heading.url != undefined ?
                    menuItem.heading.url
                    : null)
                : null,
            subMenuProps: menuItem.links.length > 0 ?
                { items: menuItem.links.map((i) => { return (this.projectMenuThirdLevel(i, ContextualMenuItemType.Normal)); }) }
                : null
        });
    }

    private projectMenuThirdLevel(menuItem: any, itemType: ContextualMenuItemType): IContextualMenuItem {
        return ({
            key: menuItem.text,
            name: menuItem.text,
            href: menuItem["url"] != undefined ? menuItem["url"] : null
        });
    }
}
