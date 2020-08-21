import { NodeEntity } from './NodeEntity';
import { NodeManage, NODE_KEY } from './NodeManage';
import { Node } from './Node'

type NodesMap = {
    [proppName: number]: Node;
};
export class TreeManage {
    public currentNode: Node | null;
    // 业务树列表
    public data: any;
    // 根结点
    public root?: Node;
    // 存放node节点
    public nodesMap: NodesMap = {};
    // 存放默认的一些字段
    public params: any;

    [propName: string]: any;

    constructor(options: any) {
        this.currentNode = null;

        for (let option in options) {
            if (options.hasOwnProperty(option)) {
                this[option] = options[option];
            }
        }

        this.root = NodeManage.generateNode({
            store: this,
            data: this.data
        });

    };

    /**
     * 注册节点
     * @param node 节点
     */
    public registerNode(node: Node) {
        if (!node || !node.data) return;

        const nodeKey = node[NODE_KEY];
        if (nodeKey !== undefined) this.nodesMap[nodeKey] = node;
    }

    /**
     * 注销节点
     * @param node 节点
     */
    public deregisterNode(node: NodeEntity) {
        if (!node || !node.data) return;

        node.childNodes.forEach(child => {
            this.deregisterNode(child);
        });

        delete this.nodesMap[node[NODE_KEY]];
    }

    /**
     * 设置当前节点
     * @param node 节点
     */
    public setCurrentNode(node: Node) {
        const prevCurrentNode = this.currentNode;
        if (prevCurrentNode) {
            prevCurrentNode.isCurrent = false;
        }
        this.currentNode = node;
        this.currentNode.isCurrent = true;
    }

    /**
     * 获取node节点
     * @param data 可能是node类型 | key | 也可能是其他类型
     */
    public getNode(data: Node | string) {
        if (data instanceof Node) return data;
        // @ts-ignore
        const key = typeof data !== 'object' ? data : NodeManage.getNodeKey(NODE_KEY, data);
        return this.nodesMap[key] || null;
    }

    /**
     * 移除节点
     * @param data 可能是node或者key
     */
    public remove(data: any) {
        const node = this.getNode(data);

        if (node && node.parent) {
            if (node === this.currentNode) {
                this.currentNode = null;
            }
            node.parent.removeChild(node);
        }
    }

    /**
     * 移除节点
     * @param data 可能是node或者key
     */
    public dragMoveChild(data: any, parent: Node, isSameTree: boolean | null) {
        const node = this.getNode(data);

        if (node && parent) {
            if (node === this.currentNode) {
                this.currentNode = null;
            }
            parent.dragMoveChild(node, isSameTree);
        }
    }

    /**
     * 移动节点
     * @param data 可能是node或者key
     */
    public dragUpdateChildren(data: Node | string, newIndex: number, oldIndex: number) {
        const node = this.getNode(data);

        if (node && node.parent) {
            if (node === this.currentNode) {
                this.currentNode = null;
            }
            node.parent.dragUpdateChildren(node, newIndex, oldIndex);
        }
    }

}