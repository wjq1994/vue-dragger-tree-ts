declare namespace domjs {
    export function addClass(el: HTMLElement, cls: string): void;
    export function removeClass(el: HTMLElement, cls: string): string;
    export function insertHtmlAtCaret(el: HTMLElement, cls: string): string; 
}

export = domjs