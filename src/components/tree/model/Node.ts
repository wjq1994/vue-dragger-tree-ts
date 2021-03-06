import { NodeEntity } from './NodeEntity';
import { NodeManage, NODE_KEY } from './NodeManage';
import { cloneDeep } from 'lodash';

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


    removeChildByData(data: any) {
        let targetNode = null;

        for (let i = 0; i < this.childNodes!.length; i++) {
            if (this.childNodes![i].data === data) {
                targetNode = this.childNodes![i];
                break;
            }
        }

        if (targetNode) {
            this.removeChild(targetNode as Node);
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
        let oldCurrentNode = this.store!.currentNode;
        try {
            this.updateCurrentNodeNull(child);
            const children = this.getChildren() || [];
            const dataIndex = children.indexOf(child.data);
            if (dataIndex > -1) {
                children.splice(dataIndex, 1);
            }

            const index = this.childNodes!.indexOf(child);

            if (index > -1) {
                this.store && this.store.deregisterNode(child);
                child.parent = null;
                this.childNodes!.splice(index, 1);
            }

            this.updateLeafState();
        } catch (error) {
            // 报错回滚当前数据
            this.store!.currentNode = oldCurrentNode;
        }
    }

    public updateCurrentNodeNull(node: NodeEntity) {
        if (this.store!.currentNode) {
            if (this.store!.currentNode === node) {
                this.store!.currentNode = null;
            }
            if (node.childNodes && node.childNodes.length > 0) {
                for (let i = 0; i < node.childNodes.length; i++) {
                    this.updateCurrentNodeNull(node.childNodes[i]);
                }
            }
        }
    }

    /**
     * 拖拽时更新节点数据
     * @param child 
     */
    public dragMoveChild(child: Node, isSameTree: boolean = true) {
        const children = this.getChildren(true) || [];
        const dataIndex = children.indexOf(child.data);
        if (dataIndex > -1) {
            children.splice(dataIndex, 1);
        }

        const index = this.childNodes!.indexOf(child);

        if (index > -1) {
            this.childNodes!.splice(index, 1);
        }

        if (!isSameTree) {
            // 循环更新level级别
            let cycleGetChildNodes = (parent: NodeEntity) => {
                this.store!.deregisterNode(parent);
                let childNodes = parent.childNodes;
                childNodes!.forEach((child: NodeEntity) => {
                    cycleGetChildNodes(child);
                });
            }
            cycleGetChildNodes(child)
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

        const index = this.childNodes!.indexOf(child);

        if (index > -1) {
            let spliceNode = this.childNodes!.splice(index, 1);
            this.childNodes!.splice(newIndex, 0, spliceNode[0]);
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
        const updatePosition = (list: T[]) =>
            list.splice(newIndex, 0, list.splice(oldIndex, 1)[0]);
        this.alterList(data, updatePosition);
    }

    public dragUpdateChildren(child: Node, oldIndex: number, newIndex: number) {
        const children = this.getChildren() || [];
        const dataIndex = children.indexOf(child.data);
        if (dataIndex > -1) {
            this.updatePosition(children, oldIndex, newIndex);
        }

        const index = this.childNodes!.indexOf(child);

        if (index > -1) {
            this.updatePosition(this.childNodes!, oldIndex, newIndex);
        }
    }

    public dragInsertChildren(child: Node, oldIndex: number, newIndex: number, isSameTree: boolean = true) {
        // 不是同一棵树要拷贝数据，并且父组件不能拷贝
        if (!isSameTree) {
            let initParent = child.parent;
            child = cloneDeep(child);
            child.parent = initParent;
        };
        // 循环更新level级别，如果不是同一棵树，要更新唯一标识，并注册
        // @ts-ignore
        let cycleGetChildNodes = (parent: Node) => {
            if (!isSameTree) {
                NodeManage.setNodeKey(parent);
            }
            this.store!.registerNode(parent);
            let childNodes = parent.childNodes;
            // @ts-ignore
            childNodes!.forEach((child: Node) => {
                child.level = parent.level! + 1;
                cycleGetChildNodes(child);
            });
        }

        // 将data数据放入
        let children = this.getChildren(true);
        children.splice(newIndex, 0, child.data || {});

        child.level = this.level! + 1;
        // 将Node数据放入
        cycleGetChildNodes(child);
        this.childNodes!.splice(newIndex, 0, child);

        this.updateLeafState();

    }

}