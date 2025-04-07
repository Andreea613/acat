import { Application } from '../../types/Application.ts';
import { Module } from '../../types/Module.ts'
/**
 * The Module interface that describes the methods that need to be implemented in order
 * for the module to correctly register into the application
 */
export class Theme implements Module {
    initialize(): void {  
        const savedTheme = localStorage.getItem("theme") as "white" | "dark";
        if (!savedTheme) localStorage.setItem("theme", "white");
        this.setTheme(savedTheme);
        
        const toggleButton = document.getElementById("theme-button");
    
        if (toggleButton) {
            const newButton = toggleButton.cloneNode(true) as HTMLElement;
            toggleButton.replaceWith(newButton); 
    
            newButton.addEventListener("click", () => {
                const currentTheme = document.documentElement.getAttribute("data-theme");
                const newTheme = currentTheme === "dark" ? "white" : "dark";
                this.setTheme(newTheme);
            });
        }
    }
    

    setTheme(theme: "white" | "dark"): void {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }
}