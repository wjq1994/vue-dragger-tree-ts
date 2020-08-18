import { NodeEntity } from './NodeEntity';
import { NodeManage } from './NodeManage';

export class Node {
    public nodeData: NodeEntity = new NodeEntity();

    public getNodeData(): NodeEntity {
        return this.nodeData;
    }

    public insertChild(child: NodeEntity, index?: number, batch?: boolean) {
        if (!(child instanceof Node)) {
            if (!batch) {
                const children = this.getChildren(true);
                if (children.indexOf(child.data) === -1) {
                    if (typeof index === 'undefined' || index < 0) {
                        children.push(child.data);
                    } else {
                        children.splice(index, 0, child.data);
                    }
                }
            }
            this.objectAssign(child, {
                parent: this,
                store: this.nodeData.store
            });
            let point = NodeManage.generateNode(child);
            child = point!.nodeData;
        }

        child.level = this.nodeData.level! + 1;

        // if (typeof index === 'undefined' || index < 0) {
        //     this.nodeData.childNodes!.push(child);
        // } else {
        //     this.nodeData.childNodes!.splice(index, 0, child);
        // }

        this.updateLeafState();
    }

    public setData(data: any) {
        let node = this.nodeData;
        if (!Array.isArray(data)) {
            NodeManage.markNodeData(node, data);
        }

        node.data = data;
        node.childNodes = [];

        let children;
        if (node.level === 0 && node.data instanceof Array) {
            children = node.data;
        } else {
            children = NodeManage.getPropertyFromData(node, 'children') || [];
        }

        for (let i = 0, j = children.length; i < j; i++) {
            this.insertChild({ data: children[i] });
        }
    }

    /**
     * 设置isLeaf属性
     */
    public updateLeafState(): void {
        let node = this.nodeData;
        // 自己设置时
        if (typeof node.isLeafByUser !== 'undefined') {
            node.isLeaf = node.isLeafByUser;
            return;
        }
        const childNodes = node.childNodes;
        // 没有子节点时
        if (!childNodes || childNodes.length === 0) {
            node.isLeaf = true;
            return;
        }

        node.isLeaf = false;
    }

    /**
     * 获取业务数组里的children
     * @param forceInit 前置初始化为数组
     */
    public getChildren(forceInit = false) {
        let node = this.nodeData;
        if (node.level === 0) return node.data;
        const data = node.data;
        if (!data) return null;

        const params = node.store!.params;
        let children = 'children';
        if (params) {
            children = params.children || 'children';
        }

        if (data[children] === undefined) {
            data[children] = null;
        }

        if (forceInit && !data[children]) {
            data[children] = [];
        }

        return data[children];
    }

    /**
     * 合并参数
     * @param target 
     */
    public objectAssign(target: any, ...params: any[]) {
        for (let i = 1, j = arguments.length; i < j; i++) {
            let source = arguments[i] || {};
            for (let prop in source) {
                if (source.hasOwnProperty(prop)) {
                    let value = source[prop];
                    if (value !== undefined) {
                        target[prop] = value;
                    }
                }
            }
        }

        return target;
    };
}