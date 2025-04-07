import './dialogs.less';
import { CustomElement } from '../../core/CustomElement.ts';
import { html } from '../../helpers/dom.ts';
import { Module } from '../../types/Module.ts';
import { Application } from '../../types/Application.ts';

interface InfoDialogProps {
    title: string;
    message: string;
}

export class InfoDialog extends CustomElement<InfoDialogProps> {
    static element = 'info-dialog';

    template(): string | null {
        return html`
            <div class="dialog-overlay">
                <div class="dialog-box">
                    <h2>${this.props.title}</h2>
                    <p>${this.props.message}</p>
                    <button id="ok-button">OK</button>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        const okButton = this.querySelector<HTMLButtonElement>('#ok-button');
        if (okButton) {
            okButton.addEventListener('click', () => this.remove());
        }
    }
}

export class InputDialog extends CustomElement {
    static element = 'input-dialog';

    public promise: Promise<string | null>;
    private _resolve!: (value: string | null) => void;

    constructor() {
        super();
        this.promise = new Promise<string | null>(resolve => {
            this._resolve = resolve;
        });
    }

    template(): string | null {
        return html`
            <div class="dialog-overlay">
                <div class="dialog-box">
                    <p>Please enter input:</p>
                    <input type="text" id="user-input" />
                    <div class="dialog-buttons">
                        <button id="submit-button">Submit</button>
                        <button id="cancel-button">Cancel</button>
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        const submitButton = this.querySelector<HTMLButtonElement>('#submit-button');
        const cancelButton = this.querySelector<HTMLButtonElement>('#cancel-button');
        const inputField = this.querySelector<HTMLInputElement>('#user-input');

        if (submitButton) {
            submitButton.addEventListener('click', () => {
                const value = inputField?.value || '';
                this._resolve(value);
                this.remove();
            });
        }

        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                this._resolve(null);
                this.remove();
            });
        }
    }
}

export class SystemInteraction implements Module {
    private app!: Application;

    initialize(app: Application): void {
        this.app = app;
    }

    showInfo(title: string, message: string): void {
        const dialog = new InfoDialog({ title, message });
        this.app.getLayout().appBody.appendChild(dialog);
    }

    requestInput(): Promise<string | null> {
        const dialog = new InputDialog();
        this.app.getLayout().appBody.appendChild(dialog);
        return dialog.promise;
    }
}
