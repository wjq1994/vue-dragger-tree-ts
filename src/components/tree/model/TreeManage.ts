import { NodeEntity } from './NodeEntity';
import { NodeManage } from './NodeManage';
import { Node } from './Node'

export class TreeManage {
    public currentNode: Node | null;
    public currentNodeKey: string | null;
    // 业务树列表
    public data: any;
    // 根结点
    public root?: Node;
    // 存放node节点
    public nodesMap: any = {};
    // 存放默认的一些字段
    public params: any;
    // node节点唯一标识
    public nodekey: string = "id";
    [propName: string]: any;

    constructor(options: any) {
        this.currentNode = null;
        this.currentNodeKey = null;

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

        const nodeKey = node[this.nodekey];
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
    
        delete this.nodesMap[node[this.nodekey]];
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
    public getNode(data: any) {
        if (data instanceof Node) return data;
        // @ts-ignore
        const key = typeof data !== 'object' ? data : NodeManage.getNodeKey(this.nodekey, data);
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
}