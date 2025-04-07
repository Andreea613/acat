import { CustomElement } from '../../../../core/CustomElement.ts';
import { html } from '../../../../helpers/dom.ts';
import { MenuGroupProps } from './MenuGroupProps.ts';
import { MenuItem } from './MenuItem.ts';

/**
 * Handles rendering a menu group like: File -> Open, Save, Export etc.
 */
export class MenuGroup extends CustomElement<MenuGroupProps> {
    // the menu item that holds the top entry and the children dropdown
    static element = 'menu-group';

    /**
     * After receiving the group props, the constructor will set the template on this element
     * and add all the children within the props
     */
    constructor(props: MenuGroupProps) {
        super(props);

        this.props = props;

        // appending the group items
        this.appendMenuItems();
    }

    /**
     * The template returns the name of the group and the dropdown in which children will be rendered
     */
    template(): string {
        return html`${this.props.displayName}
            <div class="dropdown"></div>`;
    }

    /**
     * Returns a MenuItem found inside this group identified by the given name
     */
    getMenuItemByName(name: string): MenuItem | null {
        const drpDwn = this.querySelector('.dropdown')!;

        for (let i = 0, len = drpDwn.children.length; i < len; i++) {
            const item = <MenuItem>drpDwn.children[i];
            if (item.hasName(name)) {
                return item;
            }
        }

        return null;
    }

    /**
     * Appending all the menu items found within the component's props
     */
    protected appendMenuItems(): void {
        const drpDwn = this.querySelector('.dropdown');

        this.props.children.forEach(menuItem => {
            drpDwn?.appendChild(menuItem);
        });
    }
}
