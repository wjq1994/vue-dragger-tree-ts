import { NodeEntity } from './NodeEntity'

let nodeIdSeed = 0;
const NODE_KEY = "$treeNodeId";

export class NodeManage {
    public static generateNode(nodeParams: NodeEntity): NodeEntity {
        let node = new NodeEntity();
        node.id = ++nodeIdSeed;
        node.visible = true;
        node.parent = null;

        node = nodeParams;

        node.level = 0;
        node.childNodes = [];

        if (node.parent) {
            node.level = node.parent.level! + 1;
        }

        const store = node.store;
        if (!store) {
            throw new Error('[Node] store is required!');
        }
        store.registerNode(node);

        const params = store.params;
        if (params && typeof params.isLeaf !== 'undefined') {
            const isLeaf = NodeManage.getPropertyFromData(node, 'isLeaf');
            if (typeof isLeaf === 'boolean') {
                node.isLeafByUser = isLeaf;
            }
        }

        if (store.lazy !== true && node.data) {
            NodeManage.setData(node.data);

            if (store.defaultExpandAll) {
                this.expanded = true;
            }
        } else if (this.level > 0 && store.lazy && store.defaultExpandAll) {
            this.expand();
        }
        if (!Array.isArray(this.data)) {
            markNodeData(this, this.data);
        }
        if (!this.data) return;
        const defaultExpandedKeys = store.defaultExpandedKeys;
        const key = store.key;
        if (key && defaultExpandedKeys && defaultExpandedKeys.indexOf(this.key) !== -1) {
            this.expand(null, store.autoExpandParent);
        }

        if (key && store.currentNodeKey !== undefined && this.key === store.currentNodeKey) {
            store.currentNode = this;
            store.currentNode.isCurrent = true;
        }

        if (store.lazy) {
            store._initDefaultCheckedNode(this);
        }

        this.updateLeafState();

        return node;
    }

    public static getPropertyFromData(node: NodeEntity, prop: string) {
        const params = node.store!.params;
        const data = node.data || {};
        const config = params[prop];

        if (typeof config === 'function') {
            return config(data, node);
        } else if (typeof config === 'string') {
            return data[config];
        } else if (typeof config === 'undefined') {
            const dataProp = data[prop];
            return dataProp === undefined ? '' : dataProp;
        }
    }

    public static setData(node: NodeEntity, data: any) {
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
            node.insertChild({ data: children[i] });
        }
    }

    public static markNodeData(node: NodeEntity, data: any) {
        if (!data || data[NODE_KEY]) return;
        Object.defineProperty(data, NODE_KEY, {
            value: node.id,
            enumerable: false,
            configurable: false,
            writable: false
        });
    }
}