import './less/app-menu.less';

import { Module } from '../../../types/Module.ts';
import { Application } from '../../../types/Application.ts';
import { MenuGroup } from './views/MenuGroup.ts';
import { MenuItem } from './views/MenuItem.ts';
import { MenuBar } from './views/MenuBar.ts';
import { LocalizationListener } from '../../localization/views/LocalizationListener.ts';
import { ModuleNames } from '../../../AppModules.ts';

/**
 * Module that handles rendering the application menu
 */
export class AppMenu implements Module,LocalizationListener {
    // references the application
    protected app: Application | null = null;

    /**
     * Initializes the current module
     */
    initialize(app: Application) {
        this.app = app;

        // subcribing to language change
        this.app.getModule(ModuleNames.Localization)?.subcribe(this);

        // building the app menu bar
      this.createMenuBar();

    }
   
    createMenuBar() {
        const menuBar = new MenuBar();

        // adding the menu groups
        menuBar.addGroup(this.getFileMenuGroup());
        menuBar.addGroup(this.getEditMenuGroup());
        menuBar.addGroup(this.getHelpMenuGroup());


        const appMenu = this.app!.getLayout().appMenu;
        appMenu.innerHTML = '';
        appMenu.appendChild(menuBar);
    }
    /**
     * Returns the list of items for the file menu group
     */
    getFileMenuGroup(): MenuGroup {
        const localization = this.app!.getModule(ModuleNames.Localization)!;

        const saveItem = new MenuItem({ displayName: localization.translate('Save'), onclick: () => console.log('File -> Save pressed') });
        const loadItem = new MenuItem({ displayName: localization.translate('Load'), onclick: () => console.log('File -> Load pressed') });
        const exportItem = new MenuItem({ displayName: 'Export', onclick: () => console.log('File -> Export pressed') });

        return new MenuGroup({ displayName: localization.translate ('File'), children: [saveItem, loadItem, exportItem] });
    }

    /**
     * Returns the list of items for the file menu group
     */
    getEditMenuGroup(): MenuGroup {
        const prefItem = new MenuItem({ displayName: 'Preferences', onclick: () => console.log('Edit -> Preferences pressed') });
        return new MenuGroup({ displayName: 'Edit', children: [prefItem] });
    }

    /**
     * Returns the list of items for the file menu group
     */
    getHelpMenuGroup(): MenuGroup {
        const docItem = new MenuItem({ displayName: 'Documentation', onclick: () => console.log('Help -> Documentation pressed') });
        const aboutItem = new MenuItem({ displayName: 'About', onclick: () => console.log('Help -> About pressed') });
        return new MenuGroup({ displayName: 'Help', children: [docItem, aboutItem] });
    }
    onLanguageChange(): void {
        this.createMenuBar();
        console.log("Language has changed");
    }
}
