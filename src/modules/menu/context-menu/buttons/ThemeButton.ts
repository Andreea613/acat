import { CustomElement } from '../../../../core/CustomElement.ts';
import { html } from '../../../../helpers/dom.ts';

export class ThemeButton extends CustomElement {
    static element = 'theme-button';
    
    private isDarkTheme: boolean = false;

    constructor() {
        super();
        this.addEventListener('click', this.toggleTheme.bind(this));
        
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.isDarkTheme = true;
            document.documentElement.classList.add('dark-theme');
        }
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        if (this.isDarkTheme) {
            document.documentElement.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    
        // Dispatch theme change event
        document.dispatchEvent(new Event('theme-changed'));
    }
    

    template(): string {
        return html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" id = "theme-button"> 
                    <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1"/>
                    </svg>`;
    }   
}

if (!customElements.get(ThemeButton.element)) {
    customElements.define(ThemeButton.element, ThemeButton);
}