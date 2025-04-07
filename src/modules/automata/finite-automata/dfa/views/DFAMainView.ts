import '../less/dfa-main-view.less';
import { CustomElement } from '../../../../../core/CustomElement.ts';
import { LeftColumn } from './LeftColumn.ts';
import { RightColumn } from './RightColumn.ts';

export class DFAMainView extends CustomElement {
    static element = 'dfa-main-view';

    /**
     * Returning the null template because this component will have child element
     */
    template(): string | null {
        this.appendChild(new LeftColumn());
        this.appendChild(new RightColumn());

        return null;
    }

    /**
     * Returns the container in which the network of states should run
     */
    getNetworkContainer() {
        const rightCol = <RightColumn>this.children[1];
        return rightCol.getNetworkContainer();
    }

    /**
     * Returns the test input the user has typed in
     */
    getTestInput(): string {
        return (<LeftColumn>this.children[0]).getTestInput();
    }

    /**
     * Clears the log stack
     */
    clearLog() {
        (<RightColumn>this.children[1]).getLogEntry().innerHTML = '';
    }

    /**
 * Adds a button to allow step-by-step simulation
 */
    addStepButton(callback: () => void) {
        const button = document.createElement('button');
        button.innerText = 'Next Step';
        button.addEventListener('click', callback);
        button.classList.add('step-button');

        // Adds the button in the right side
        const rightCol = <RightColumn>this.children[1];
        rightCol.appendChild(button);
    }

    /**
     * Shows a message in the log entry
     */
    logMessage(message: string, type: '' | 'error' | 'success' = '') {
        const container = document.createElement('div');
        container.innerHTML = message;
        // updating the type of message if provided
        type !== '' && container.classList.add(type);
        (<RightColumn>this.children[1]).getLogEntry().appendChild(container);
    }
}
