import { AppModules, ModuleName } from '../AppModules.ts';
import { AppLayout } from '../core/AppLayout.ts';
import { Automata } from './Automata.ts';

/**
 * Describes the application interface that exposes its API to the public.
 * It receives a generic that describes the list of modules that were bundled into the application
 * This is implemented by the main program.
 *
 */
export interface Application {
    /**
     * Returns direct access to a specific module
     */
    getModule<T extends ModuleName>(name: T): InstanceType<(typeof AppModules)[T]> | null;

    /**
     * Runs the application
     */
    run(): void;

    /**
     * Returns access to the main layout UI component
     */
    getLayout(): AppLayout;

    /**
     * Starts the simulation for the given automata
     */
    simulateAutomata(automata: Automata): void;

    /**
     * Returns access to the current simulation
     */
    getRunningAutomata(): Automata | null;

    /**
     * Saves the current simulation state to local storage.
     */
    saveSimulation() : void;
}
