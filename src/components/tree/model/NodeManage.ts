import { NodeEntity } from './NodeEntity';
import { Node } from './Node';

let nodeIdSeed = 0;
const NODE_KEY = "$treeNodeId";

export class NodeManage {
    // 存放node节点
    public static nodesMap: any;
    
    public static generateNode(nodeParams: NodeEntity): Node | undefined {
        let node = new Node();
        node.id = ++nodeIdSeed;
        node.visible = true;
        node.parent = null;

        node.objectAssign(node, nodeParams);

        node.level = 0;
        node.childNodes = [];

        if (node.parent) {
            node.level = (node.parent as Node).level! + 1;
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

        if (node.data) {
            node.setData(node.data);
        }

        if (!Array.isArray(node.data)) {
            NodeManage.markNodeData(node, node.data);
        }
        if (!node.data) return;

        const key = store.key;

        // 判断当前节点
        if (key && store.currentNodeKey !== undefined && node.key === store.currentNodeKey) {
            store.currentNode = node;
            store.currentNode.isCurrent = true;
        }

        node.updateLeafState();

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

    public static markNodeData(node: NodeEntity, data: any) {
        if (!data || data[NODE_KEY]) return;
        Object.defineProperty(data, NODE_KEY, {
            value: node.id,
            enumerable: false,
            configurable: false,
            writable: false
        });
    }

    public static getNodeKey(key: string, data: any) {
        if (!key) return data[NODE_KEY];
        return data[key];
    }
}