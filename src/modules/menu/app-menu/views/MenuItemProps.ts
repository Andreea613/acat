/**
 * Defines the type of properties for a menu item constructor
 */
export type MenuItemProps = {
    // the name of the menu item that will be displayed inside the dropdown
    displayName: string;
    // the function to be invoked when the user clicks the menu
    onclick: VoidFunction;
    // specifies whether or not the menu item is disabled
    disabled?: boolean;
};
