import { Automata } from '../../../../types/Automata.ts';
import { Application } from '../../../../types/Application.ts';
import { DefaultToolbar } from '../../../menu/context-menu/DefaultToolbar.ts';
import { PlayButton } from '../../../menu/context-menu/buttons/PlayButton.ts';
import { PauseButton } from '../../../menu/context-menu/buttons/PauseButton.ts';
import { RefreshButton } from '../../../menu/context-menu/buttons/RefreshButton.ts';
import { PlayStepByStepButton } from '../../../menu/context-menu/buttons/PlayStepByStepButton.ts';
import { DFASimulator } from './DFASimulator.ts';
import { DFAMainView } from './views/DFAMainView.ts';
import { ThemeButton } from '../../../menu/context-menu/buttons/ThemeButton.ts';
/**
 * The DFA automata implementation which acts as a gateway between the simulator and the application
 * It handles returning the current configuration, updating the application context bar
 * and starting the simulation
 */
export class DFAAutomata implements Automata {
    // references the current application
    protected app: Application | null = null;

    // references this simulation's toolbar
    protected toolbar: DefaultToolbar | null = null;

    // references the actual simulator
    protected simulator: DFASimulator = new DFASimulator(this);

    /**
     * The constructor for the Deterministic Finite Automata
     */
    constructor() {
        // creating the context menu toolbar for the DFA simulation
        this.toolbar = new DefaultToolbar({
            buttons: [
                new PlayButton(this.simulator.onPlaySimulation),
                new PauseButton(this.simulator.onPauseSimulation),
                new PlayStepByStepButton(this.simulator.onPlayStepByStepSimulation),
                new RefreshButton(this.onRefreshSimulation),
            ],
        });
    }

    /**
     * Returning the current configuration for the user to later save it
     */
    getConfiguration(): Record<string, any> {
        const model = this.simulator.getCurrentModel();
        const { symbols, transitions, states } = model;
        return { symbols, transitions, states };
    }

    /**
     * Runs the current simulation for Deterministic Finite Automation
     */
    runSimulation(app: Application): void {
        this.app = app;

        // adding the main view to the body
        const container = new DFAMainView();
        this.app.getLayout().appBody.appendChild(container);
        this.simulator.start(container);
    }

    /**
     * Returns the new context bar that will be displayed in the top context menu
     */
    getContextBar(): DefaultToolbar {
        if (this.toolbar === null) throw new Error('No toolbar available');
        return this.toolbar;
    }

    /**
     * Invoked when the user clicks the refresh button
     */
    onRefreshSimulation = () => {
        this.app?.simulateAutomata(new DFAAutomata());
    };
}
