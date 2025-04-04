import { Automata } from '../../../../../types/Automata.ts';
import { Application } from '../../../../../types/Application.ts';
import { DefaultToolbar } from '../../../../menu/context-menu/DefaultToolbar.ts';
import { PlayButton } from '../../../../menu/context-menu/buttons/PlayButton.ts';
import { PauseButton } from '../../../../menu/context-menu/buttons/PauseButton.ts';
import { RefreshButton } from '../../../../menu/context-menu/buttons/RefreshButton.ts';
import { PlayStepByStepButton } from '../../../../menu/context-menu/buttons/PlayStepByStepButton.ts';
import { InaccessibleStatesSimulator } from './InaccessibleStatesSimulator.ts';
import { DFAMainView } from '../views/DFAMainView.ts';

export class InaccessibleStatesOptimizer implements Automata {
    protected app: Application | null = null;
    protected toolbar: DefaultToolbar | null = null;
    protected simulator: InaccessibleStatesSimulator = new InaccessibleStatesSimulator(this);

    constructor() {
        this.toolbar = new DefaultToolbar({
            buttons: [
                new PlayButton(this.simulator.onPlaySimulation), 
                new PauseButton(this.simulator.onPauseSimulation),
                new PlayStepByStepButton(this.simulator.onPlayStepByStepSimulation),
                new RefreshButton(this.onRefreshSimulation)
            ],
        });
    }

    getConfiguration(): Record<string, any> {
        const model = this.simulator.getCurrentModel();
        return {
            symbols: model.symbols,
            transitions: model.transitions,
            states: model.states
        };
    }

    runSimulation(app: Application): void {
        this.app = app;
        const container = new DFAMainView();
        this.app.getLayout().appBody.appendChild(container);
        this.simulator.start(container);
    }

    getContextBar(): DefaultToolbar {
        if (!this.toolbar) throw new Error('No toolbar available');
        return this.toolbar;
    }

    onRefreshSimulation = () => {
        this.app?.simulateAutomata(new InaccessibleStatesOptimizer());
    };
}