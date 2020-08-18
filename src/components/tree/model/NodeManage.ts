import { NodeEntity } from './NodeEntity';
import {Node} from './Node';

let nodeIdSeed = 0;
const NODE_KEY = "$treeNodeId";

export class NodeManage {
    public static generateNode(nodeParams: NodeEntity): Node | undefined {
        let point = new Node();
        let node = point.nodeData;
        node.id = ++nodeIdSeed;
        node.visible = true;
        node.parent = null;

        point.objectAssign(node, nodeParams);

        node.level = 0;
        node.childNodes = [];

        if (node.parent) {
            node.level = (node.parent as Node).nodeData.level! + 1;
        }

        const store = node.store;
        if (!store) {
            throw new Error('[Node] store is required!');
        }
        store.registerNode(point);
        
        const params = store.params;
        if (params && typeof params.isLeaf !== 'undefined') {
            const isLeaf = NodeManage.getPropertyFromData(node, 'isLeaf');
            if (typeof isLeaf === 'boolean') {
                node.isLeafByUser = isLeaf;
            }
        }
        
        if (node.data) {
            point.setData(node.data);
        }

        if (!Array.isArray(node.data)) {
            NodeManage.markNodeData(node, node.data);
        }
        if (!node.data) return;

        const key = store.key;

        // 判断当前节点
        if (key && store.currentNodeKey !== undefined && node.key === store.currentNodeKey) {
            store.currentNode = point;
            store.currentNode.nodeData.isCurrent = true;
        }

        point.updateLeafState();

        return point;
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
}