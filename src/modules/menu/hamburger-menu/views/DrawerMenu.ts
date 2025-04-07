import '../less/drawer-menu.less';

import { CustomElement } from '../../../../core/CustomElement.ts';

export class DrawerMenu extends CustomElement {
    static element = 'drawer-menu';

    /**
     * Returning null because the elements will be added as children
     */
    template(): string | null {
        return null;
    }
}
