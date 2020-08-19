declare namespace helper {
    export function insertNodeAt(): void;
    export function camelize(key: string): string; 
    export function removeNode(): void;
    export function findNearestComponent(element: string, componentName: string): any; 
}

export = helper