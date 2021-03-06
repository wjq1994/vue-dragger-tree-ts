import {TreeManage} from './TreeManage'
import {Node} from './Node'

export class NodeEntity {
    public $treeNodeId?: number;
    public key?: string;
    public checked?: Boolean;
    // 存放子节点
    public childNodes?: NodeEntity[];
    // 存放父节点
    public parent?: Node | null;
    // 存放业务数据
    public data: any;
    // 是否展开 默认不展开
    public expanded?: Boolean;
    // 是否是当前节点 默认不是
    public isCurrent?: Boolean = false;
    // 是否是叶子节点 默认不是
    public isLeaf?: Boolean;
    public isLeafByUser?: Boolean;

    // 节点层级
    public level?: number;
    // 树管理器
    public store?: TreeManage;
    // 是否显示
    public visible?: Boolean = true;

}