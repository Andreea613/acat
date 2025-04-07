import { AbstractFiniteSimulation } from '../../AbstractFiniteSimulation.ts';
import { Application } from '../../../../../types/Application.ts';
import { ModuleNames } from '../../../../../AppModules.ts';
import { DrawerItem } from '../../../../menu/hamburger-menu/views/DrawerItem.ts';
import { InaccessibleStatesOptimizer } from './InaccessibleStatesOptimizer.ts';

export class OptimizingInaccessibleStatesSimulation extends AbstractFiniteSimulation {
    initialize(app: Application) {
        super.initialize(app);
        const category = app.getModule(ModuleNames.HamburgerMenu)?.getCategory(AbstractFiniteSimulation.menuId);
        if (category) {
            category.addItem(new DrawerItem({
                displayName: 'Optimizing Inaccessible States',
                onclick: () => this.simulate()
            }));
        }
    }

    simulate(): void {
        this.app?.getModule(ModuleNames.HamburgerMenu)?.onToggleMenu();
        this.app?.simulateAutomata(new InaccessibleStatesOptimizer());
    }
}