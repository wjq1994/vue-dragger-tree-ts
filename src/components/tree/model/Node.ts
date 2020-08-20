import { NodeEntity } from './NodeEntity';
import { NodeManage } from './NodeManage';
import { arrayFindIndex } from '../../../utils/helper';


const NODE_KEY = "$treeNodeId";

export class Node extends NodeEntity {

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
                store: this.store
            });
            child = NodeManage.generateNode(child) as Node;
        }

        child.level = this.level! + 1;

        if (typeof index === 'undefined' || index < 0) {
            this.childNodes!.push(child);
        } else {
            this.childNodes!.splice(index, 0, child);
        }

        this.updateLeafState();
    }

    public setData(data: any) {
        let node = this;
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
        let node = this;
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
        let node = this;
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
     * 更新业务中的数据
     */
    updateChildren() {
        const newData = this.getChildren() || [];
        const oldData = this.childNodes.map((node) => node.data);

        const newDataMap = {};
        const newNodes = [];

        newData.forEach((item, index) => {
            const key = item[NODE_KEY];
            const isNodeExists = !!key && arrayFindIndex(oldData, data => data[NODE_KEY] === key) >= 0;
            if (isNodeExists) {
                newDataMap[key] = { index, data: item };
            } else {
                newNodes.push({ index, data: item });
            }
        });

        oldData.forEach((item) => {
            if (!newDataMap[item[NODE_KEY]]) this.removeChildByData(item);
        });

        newNodes.forEach(({ index, data }) => {
            this.insertChild({ data }, index);
        });

        this.updateLeafState();
    }

    removeChildByData(data: any) {
        let targetNode = null;

        for (let i = 0; i < this.childNodes.length; i++) {
            if (this.childNodes[i].data === data) {
                targetNode = this.childNodes[i];
                break;
            }
        }

        if (targetNode) {
            this.removeChild(targetNode);
        }
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

    public removeChild(child: Node) {
        const children = this.getChildren() || [];
        const dataIndex = children.indexOf(child.data);
        if (dataIndex > -1) {
            children.splice(dataIndex, 1);
        }

        const index = this.childNodes.indexOf(child);

        if (index > -1) {
            this.store && this.store.deregisterNode(child);
            child.parent = null;
            this.childNodes.splice(index, 1);
        }

        this.updateLeafState();
    }

    /**
     * 拖拽时更新节点数据
     * @param child 
     */
    public dragMoveChild(child: Node) {
        const children = this.getChildren(true) || [];
        const dataIndex = children.indexOf(child.data);
        if (dataIndex > -1) {
            children.splice(dataIndex, 1);
        }

        const index = this.childNodes.indexOf(child);

        if (index > -1) {
            this.childNodes.splice(index, 1);
        }

        this.updateLeafState();
    }
    /**
     * 拖拽时移动节点数据
     * @param child 
     */
    public dragUpdateChildrenC(child: Node, newIndex: number) {
        const children = this.getChildren() || [];
        const dataIndex = children.indexOf(child.data);
        if (dataIndex > -1) {
            let spliceData = children.splice(dataIndex, 1);
            children.splice(newIndex, 0, spliceData[0]);

        }

        const index = this.childNodes.indexOf(child);

        if (index > -1) {
            let spliceNode = this.childNodes.splice(index, 1);
            this.childNodes.splice(newIndex, 0, spliceNode[0]);
        }

        this.updateLeafState();
    }

    public alterList(data: any[], onList: Function) {
        if (data) {
            onList(data);
            return;
        }
    }

    public updatePosition<T>(data: T[], oldIndex: number, newIndex: number) {
        const updatePosition = list =>
            list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
        this.alterList(data, updatePosition);
    }

    public dragUpdateChildren(child: Node, oldIndex: number, newIndex: number) {
        const children = this.getChildren() || [];
        const dataIndex = children.indexOf(child.data);
        if (dataIndex > -1) {
            this.updatePosition(children, oldIndex, newIndex);
        }

        const index = this.childNodes.indexOf(child);

        if (index > -1) {
            this.updatePosition(this.childNodes, oldIndex, newIndex);
        }
    }
}