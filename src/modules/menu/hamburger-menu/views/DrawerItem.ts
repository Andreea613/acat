import { CustomElement } from '../../../../core/CustomElement.ts';
import { html } from '../../../../helpers/dom.ts';

/**
 * The drawer item props
 */
export type DrawerItemProps = {
    // the name displayed inside the drawer menu
    displayName: string;
    // the click handler invoked when the user clicks a menu item
    onclick: VoidFunction;
};

/**
 * Handles rendering a drawer item
 */
export class DrawerItem extends CustomElement<DrawerItemProps> {
    static element = 'drawer-item';

    /**
     * Constructor for the drawer item
     */
    constructor(props: DrawerItemProps) {
        super(props);

        // attaching the click handler
        this.onclick = this.onClick;
    }

    /**
     * Returns the template for this item
     */
    template(): string | null {
        return html`<div class="drawer-item">${this.props.displayName}</div>`;
    }

    /**
     * The click handler that removes the selected class from all siblings
     * and adds the selected class on to this element
     */
    onClick = () => {
        // removing the selected class from all drawer items
        this.parentElement?.querySelectorAll(DrawerItem.element).forEach(e => e.classList.remove('selected'));

        // marking this item as selected
        this.classList.add('selected');

        // invoking the click handler sent through props
        this.props.onclick();
    };
}
