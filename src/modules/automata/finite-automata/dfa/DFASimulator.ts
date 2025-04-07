import { Network, DataSet, Node, Edge } from 'vis-network/standalone';
import { DFAAutomata } from './DFAAutomata.ts';
import { DFAMainView } from './views/DFAMainView.ts';
import { DFAModel, State } from './DFAModel.ts';
/**
 * Does the actual simulation of the Deterministic Finite Automata
 */
export class DFASimulator {
    // the simulator view
    protected mainView: DFAMainView | null = null;

    // references the network of states
    protected network: Network | null = null;

    // references the DFAModel
    protected model: DFAModel = new DFAModel();

    // @ts-ignore
    protected currentTimeout: NodeJS.Timeout;

    // New variables for step-by-step module

    protected stepByStepInput: string = '';
    protected currentIndex: number = 0;
    protected stepByStepActive: boolean = false;

    /**
     * The constructor receives the Automata instance
     */
    constructor(protected automata: DFAAutomata) {}

    /**
     * Returns access to the DFA Model
     */
    getCurrentModel(): DFAModel {
        return this.model;
    }

    /**
     * Entry point for starting the simulation
     */
    start(mainView: DFAMainView) {
        // initializing the DFA model
        this.model.states.push({ name: 'q0', initial: true, final: false });

        // keeping track of the container
        this.mainView = mainView;
        // creating the network of states
        const [nodes, edges] = [this.getNodes(), this.getEdges()];
        // setting up some display options for how to render the network
        const options = { physics: true, edges: { font: { align: 'top' } } };
        // instantiating the network of states
        this.network = new Network(mainView.getNetworkContainer(), { nodes, edges }, options);

        this.network.setOptions({
            interaction: {
                selectable: true,
                multiselect: true,
            },
            manipulation: {
                enabled: true,
                addEdge: this.edgeAdded,
                addNode: this.nodeAdded,
            },
        });

        /**
         * Subscribing to select node event
         */
        this.network.on('selectNode', (node: Node) => {
            console.log('Node selected:');
            console.log(node);
        });
    }

    /**
     * Invoked when the user clicks the play button for the simulation
     */
    onPlaySimulation = () => {
        // resetting the simulation before the start
        this.resetSimulation();

        const input = this.mainView!.getTestInput();
        if (input.length === 0) {
            alert('Please type the input for the DFA in the top left box.');
            return;
        }

        // clearing the output console
        this.mainView?.clearLog();

        // letting the UI know that we started the simulation
        this.mainView?.logMessage('Starting simulation for the following input: ' + input, 'success');

        // showing the start state
        this.highlightStateAndEdge(this.model.getInitialState());

        // letting the first state shine for a second
        this.currentTimeout = setTimeout(async () => {
            let nextState = this.model.currentState;

            // processing the input character by character to see if we reach the final state
            for (let i = 0, len = input.length; i < len; i++) {
                const currentChar = input[i];

                this.mainView?.logMessage('Processing input character: ' + currentChar);
                nextState = await this.transitionFunction(currentChar);

                // if the next state is not valid, highlighting the current node to know where the automata stopped
                if (nextState === -1) {
                    this.network?.updateClusteredNode(this.model.states[this.model.currentState].name, { color: 'palevioletred' });
                    break;
                }

                this.model.currentState = nextState;
            }

            // checking if we reached the final state
            if (nextState !== -1 && this.model.states[this.model.currentState].final) {
                this.network?.updateClusteredNode(this.model.states[this.model.currentState].name, { color: 'yellow' });
                // letting the user know that the input sequence was successfully received
                this.mainView?.logMessage('Input accepted: ' + input, 'success');
            } else {
                this.mainView?.logMessage('Input rejected:' + input, 'error');
            }
        }, 1000);
    };

    /**
     * Invoked when the user pauses the simulation
     */
    onPauseSimulation = () => {
        this.resetSimulation();
    };

    /**
     * Resets the current simulation and sets the current state to the initial state
     */
    resetSimulation() {
        // stopping the next timeout function if exists
        clearTimeout(this.currentTimeout);
        // resetting the state to the initial value
        this.model.currentState = this.model.states.indexOf(this.model.getInitialState());
        // updating colors
        this.resetNodesColors();
    }

    /**
     * Executes the simulation in a step-by-step manner.
     * Each invocation processes a single character from `stepByStepInput`.
     */
    onPlayStepByStepSimulation = async () => {
        // Check if the "Step By Step" mode is being initiated or if it hasn't been activated yet.
        if (!this.stepByStepActive) {
            this.stepByStepActive = true;

            // Retrieve the input from the UI.
            this.stepByStepInput = this.mainView!.getTestInput();
            if (!this.stepByStepInput || this.stepByStepInput.length === 0) {
                alert('Please type the input for the DFA in the top left box.');
                return;
            }

            // Clear the console.
            this.mainView?.clearLog();

            // Log the start of the simulation.
            this.mainView?.logMessage('Starting step-by-step simulation for the following input: ' + this.stepByStepInput, 'success');

            // Reset the DFA to its initial state.
            this.model.currentState = this.model.states.indexOf(this.model.getInitialState());

            // Highlight the initial state.
            this.highlightStateAndEdge(this.model.getInitialState());

            // Initialize the processing index to 0.
            this.currentIndex = 0;
        }

        // If the entire input has already been processed, no further action is taken.
        if (this.currentIndex >= this.stepByStepInput.length) {
            this.mainView?.logMessage('No more input to process.', '');
            return;
        }

        // Process the current character from the input.
        const currentChar = this.stepByStepInput[this.currentIndex];
        this.mainView?.logMessage('Processing input character: ' + currentChar);

        // Perform the DFA transition for the current character.
        const nextState = await this.transitionFunction(currentChar);

        // A nextState value of -1 indicates that no valid transition exists.
        if (nextState === -1) {
            this.network?.updateClusteredNode(this.model.states[this.model.currentState].name, { color: 'palevioletred' });
            this.mainView?.logMessage('Input rejected: ' + this.stepByStepInput, 'error');

            // Deactivate step-by-step mode.
            this.stepByStepActive = false;
            return;
        }

        // Update the current state and highlight it.
        this.model.currentState = nextState;
        this.highlightStateAndEdge(this.model.states[this.model.currentState]);

        // Increment the index as the current character has been processed.
        this.currentIndex++;

        // When the end of the input is reached, determine if it is accepted or rejected.
        if (this.currentIndex === this.stepByStepInput.length) {
            if (this.model.states[this.model.currentState].final) {
                this.mainView?.logMessage('Input accepted: ' + this.stepByStepInput, 'success');
            } else {
                this.mainView?.logMessage('Input rejected: ' + this.stepByStepInput, 'error');
            }
            // Mark the end of the step-by-step simulation.
            this.stepByStepActive = false;
        }
    };

    /**
     * Handler that will be invoked when a new node will be added
     */
    protected nodeAdded = (nodeData: Node, callback: (arg: Node) => void) => {
        const newNode = { x: nodeData.x, y: nodeData.y, ...this.getNextStateData() };
        callback(newNode);

        // if there are more than two nodes (Initial and Final state) we update the intermediary ones
        // @todo this logic needs to be updated because a DFA can have one initial state and multiple final states
        if (this.model.states.length > 2) {
            // updating the last node because it is no longer final
            const previous = this.model.states[this.model.states.length - 2];
            const previousNode: Node = { id: previous.name, label: previous.name, color: 'lightblue' };

            // keep in mind that these nodes get updated when the user drags them on the canvas
            this.network?.updateClusteredNode(previousNode.id!, { label: previousNode.label, color: previousNode.color });
        }
    };

    /**
     * Invoked when a new edge has been added
     */
    protected edgeAdded = (edgeData: Edge, callback: (edge: Edge) => void) => {
        // requesting the character that will validate next state
        const character = prompt('Enter the transition character:');
        if (!character) {
            alert('Aborting because no character was inserted');
            return;
        }

        // @ts-ignore
        this.model.transitions.push({ from: edgeData.from, to: edgeData.to, character });

        edgeData.label = character;
        callback(edgeData);
    };

    /**
     * Returns a new node definition
     */
    protected getNextStateData(): Node {
        const nextState: State = { name: 'q' + this.model.states.length, final: true, initial: false };
        this.model.states.push(nextState);
        return { id: nextState.name, label: nextState.name + ' (Final)', shape: 'ellipse', color: 'lightgreen' };
    }

    /**
     * The transition function that handles moving on to the next state
     */
    protected transitionFunction = async (char: string): Promise<number> => {
        // returning a promise that will be resolved delayed for the animation to work
        return new Promise((resolve, reject) => {
            // we consider by default that the input character is invalid
            let nextState: number = -1;

            const currentState = this.model.getCurrentState();
            for (let i = 0, len = this.model.transitions.length; i < len; i++) {
                // getting the current iteration transition
                const transition = this.model.transitions[i];

                // skipping transitions that don't start from the current instance
                if (currentState.name !== transition.from) continue;

                // searching for the next possible state
                const nextStateCandidate = this.model.states.filter(s => s.name === transition.to && transition.character === char)[0];

                // checking if this edge starts from current state and leads to a new state when reading the input character
                if (nextStateCandidate) {
                    // if we have a valid state we update the network for highlighting it
                    const next = this.model.getStateByName(transition.to);
                    nextState = next !== null ? this.model.states.indexOf(next) : -1;
                    this.highlightStateAndEdge(nextStateCandidate);
                    break;
                }
            }

            // resolving next state for continuing simulation
            this.currentTimeout = setTimeout(() => resolve(nextState), 1000);
        });
    };

    /**
     * Highlights the current state and edge if given
     */
    protected highlightStateAndEdge(state: State) {
        this.resetNodesColors();
        this.network?.updateClusteredNode(state.name, { color: 'yellow' });
    }

    /**
     * Iterates through all nodes and resetes their colors
     */
    protected resetNodesColors() {
        for (let i = 0, len = this.model.states.length; i < len; i++) {
            const color = this.model.states[i].initial || this.model.states[i].final ? 'lightgreen' : 'lightblue';
            this.network?.updateClusteredNode(this.model.states[i].name, { color });
        }
    }

    /**
     * Returns the list of nodes created based on the model's states
     */
    protected getNodes(): Node[] {
        const nodes: Node[] = [];
        for (let i = 0, len = this.model.states.length; i < len; i++) {
            const state = this.model.states[i];
            nodes.push({
                id: state.name,
                label: state.name + (state.initial ? ' (Start)' : state.final ? ' (Final)' : ''),
                shape: 'ellipse',
                color: state.initial || state.final ? 'lightgreen' : 'lightblue',
            });
        }

        return nodes;
    }

    /**
     * Returns the list of edges created based on the model's transition table
     */
    protected getEdges(): Edge[] {
        const edges: Edge[] = [];
        for (let i = 0, len = this.model.transitions.length; i < len; i++) {
            const transition = this.model.transitions[i];
            edges.push({ label: transition.character, from: transition.from, to: transition.to });
        }

        return edges;
    }
}
