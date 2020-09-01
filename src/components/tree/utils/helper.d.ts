declare namespace helper {
    export function insertNodeAt(rootcontainer: any, ele: any, oldIndex: number): void;
    export function camelize(key: string): string; 
    export function removeNode(el: any): void;
    export function findNearestComponent(element: string, componentName: string): any; 
    export function arrayFindIndex(arr: any[],pred: any): number;
    export function spliceList(oriData: any[], newIndex: number, index: number, ele?: any): void;
    export function objectAssign(target: Object,params: Object): any;
}

export = helper