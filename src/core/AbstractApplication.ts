import { AppModule, AppModules, ModuleName, ModuleNames } from '../AppModules.ts';
import { Application } from '../types/Application.ts';
import { AppLayout } from './AppLayout.ts';
import { Automata } from '../types/Automata.ts';
import { DrawerMenu } from '../modules/menu/hamburger-menu/views/DrawerMenu.ts';

/**
 * This is the abstract application implementation that shadows a lot of under the hood logic
 * for allowing the child class to be more readable
 */
export class AbstractApplication implements Application {
    // holds the list of modules instantiated within the application
    protected modules: Map<ModuleName, AppModule> = new Map();

    // returns access to the layout UI component
    protected layout: AppLayout | null = null;

    // references the running automata
    protected activeAutomata: Automata | null = null;

    /**
     * The constructor receives the root element in which it should render its components
     */
    constructor(protected root: HTMLElement) {
        // doing nothing as the root property is already stored on this instances
    }

    /**
     * Returns access to a specific module identified by its name
     */
    getModule<T extends ModuleName>(name: T): InstanceType<(typeof AppModules)[T]> | null {
        return <InstanceType<(typeof AppModules)[T]>>this.modules.get(name) ?? null;
    }

    /**
     * Runs the application and initializez the modules
     */
    run() {
        // instantiating the modules
    }

    /**
     * Returns the Layout instance that allows injecting child elements in different areas of the application
     */
    getLayout(): AppLayout {
        if (this.layout === null) throw new Error('Layout needs to be created before it can be accessed.');

        return this.layout;
    }

    /**
     * Simulates the selected automata
     */
    simulateAutomata(automata: Automata) {
        // clearing the previous simulation
        this.clearBodyContent();

        this.activeAutomata = automata;
        // updating the context menu with the new buttons
        this.getModule(ModuleNames.ContextMenu)?.refreshToolbar(automata.getContextBar());
        this.activeAutomata.runSimulation(this);
    }

    /**
     * Returns access to the current simulating automata if exists otherwise null
     */
    getRunningAutomata(): Automata | null {
        return this.activeAutomata;
    }

    /**
     * Emptying the body content but keeping the drawer menu
     */
    protected clearBodyContent() {
        const body = this.getLayout().appBody;
        for (let i = 0, len = body.children.length; i < len; i++) {
            // sipping deleting the drawer menu
            if (body.children[i] instanceof DrawerMenu) {
                continue;
            }
            // removing the child
            body.children[i].remove();
        }
    }

    /**
     * Saves the current simulation state to local storage.
     */
    saveSimulation(): void {
       
        // Get the configuration from the current automata
        const configuration = this.activeAutomata?.getConfiguration();

        // Prompt the user for a simulation name
        const simulationName = prompt("Enter a name for your simulation:");
        if (!simulationName) return; // User canceled

        // Save the configuration to local storage
        const storageKey = `automata|${simulationName}|.`;
        localStorage.setItem(storageKey, JSON.stringify(configuration));
        alert("Simulation saved successfully!");
    }


}
