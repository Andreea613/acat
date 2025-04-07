import { CustomElement } from '../../../../core/CustomElement.ts';
import { MenuItemProps } from './MenuItemProps.ts';
import { html } from '../../../../helpers/dom.ts';

/**
 * The menu item that will be rendered inside the menu group dropdown
 */
export class MenuItem extends CustomElement<MenuItemProps> {
    static element = 'menu-item';

    /**
     * The constructor for the menu item entry
     */
    constructor(props: MenuItemProps) {
        super(props);

        // Defining the onclick function for triggering the item's action
        this.onclick = () => {
            if (this.props.disabled) return; // prevent action if item is disabled

            // signaling parent to close the dropdown
            this.parentElement!.classList.add('force-hide');
            setTimeout(() => this.parentElement!.classList.remove('force-hide'), 50);

            // invoking the click handler
            this.props.onclick();
        };
    }

    /**
     * Returning only the display name for the template
     */
    template(): string {
        // Add a 'disabled' class if the item is disabled
        const disabledClass = this.props.disabled ? 'disabled' : '';
        return html`
            <div class="${disabledClass}">
                ${this.props.displayName}
            </div>
        `;
    }

    /**
     * Returns true if the current item matches the given name
     */
    hasName(name: string): boolean {
        return this.props.displayName === name;
    }

    /**
     * Sets "disabled" status of current item
     */
    setEnabled(enabled: boolean) {
        this.props.disabled = !enabled;
        // Updates div class to no longer be ".disabled"
        this.innerHTML = this.template();
    }
}
