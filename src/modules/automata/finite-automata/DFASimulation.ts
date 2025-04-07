import { AbstractFiniteSimulation } from './AbstractFiniteSimulation.ts';
import { Application } from '../../../types/Application.ts';
import { ModuleNames } from '../../../AppModules.ts';
import { DrawerItem } from '../../menu/hamburger-menu/views/DrawerItem.ts';
import { DFAAutomata } from './dfa/DFAAutomata.ts';
/**
 * The deterministic finite automata simulation
 *
 * A DFA is a finite state machine where:
 * - each state has exactly one transition for each input symbol
 * - there are no ε (epsilon) transitions (empty string moves)
 * - the machine is in exactly one state at any given time
 */
export class DFASimulation extends AbstractFiniteSimulation {
    /**
     * Letting the abstract implementation do the basic stuff
     */
    initialize(app: Application) {
        super.initialize(app);

        // subscribing this simulation to the finite automata category
        const category = app.getModule(ModuleNames.HamburgerMenu)?.getCategory(AbstractFiniteSimulation.menuId);

        // ensuring the category is defined
        if (category === null) return;

        category?.addItem(new DrawerItem({ displayName: 'Deterministic Finite Automata', onclick: () => this.simulate() }));
    }

    /**
     * Running the simulation
     */
    simulate(): void {
        // hiding the module before proceeding with the automation
        this.app?.getModule(ModuleNames.HamburgerMenu)?.onToggleMenu();
        // enable the "Save" button
        this.app?.getModule(ModuleNames.AppMenu)?.getFileMenuGroup()?.getMenuItemByName('Save')?.setEnabled(true);
        // calling the simulation on application instance
        this.app?.simulateAutomata(new DFAAutomata());
    }  
}
