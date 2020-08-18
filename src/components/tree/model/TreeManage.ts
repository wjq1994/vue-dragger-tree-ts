import { NodeEntity } from './NodeEntity';
import { NodeManage } from './NodeManage';
import { Node } from './Node'

export class TreeManage {
    public currentNode: Node | null;
    public currentNodeKey: number | null;
    // 业务树列表
    public data: any;
    // 根结点
    public root?: Node;
    // 存放node节点
    public nodesMap: any;
    // 存放默认的一些字段
    public params: any;
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
        const key = this.key;
        if (!key) return;

        const nodeKey = node.nodeData.key;
        if (nodeKey !== undefined) this.nodesMap[nodeKey] = node;
    }
}