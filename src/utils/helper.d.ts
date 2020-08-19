declare namespace helper {
    export function insertNodeAt(rootcontainer: any, ele: any, oldIndex: number): void;
    export function camelize(key: string): string; 
    export function removeNode(el: any): void;
    export function findNearestComponent(element: string, componentName: string): any; 
}

export = helper