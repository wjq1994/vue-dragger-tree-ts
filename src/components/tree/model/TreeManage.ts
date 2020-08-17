import { NodeEntity } from './NodeEntity'
import { NodeManage } from './NodeManage'

export class TreeManage {
    public currentNode?: NodeEntity | null;
    public currentNodeKey?: string;
    // 业务树列表
    public data: any;
    // 根结点
    public root?: NodeEntity;
    // 存放node节点
    public nodesMap: any;
    // 存放默认的一些字段
    public params: any;
    [propName: string]: any;

    constructor(options: any) {
        this.currentNode = null;
        this.currentNodeKey = "";

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
    public registerNode(node: NodeEntity) {
        const key = this.key;
        if (!key) return;

        const nodeKey = node.key;
        if (nodeKey !== undefined) this.nodesMap[nodeKey] = node;
    }
}