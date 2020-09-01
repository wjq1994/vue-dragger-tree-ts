<template>
<div class="tree">
    <TreeBranch :branch-list="root.childNodes" :root="root"></TreeBranch>
</div>
</template>

<script lang="ts">
import TreeNode from "./tree-node.vue";
import TreeBranch from "./tree-branch.vue";
import {
    TreeManage
} from "./model/TreeManage";
import BaseVue from "@/components/base/BaseVue";
import {
    Component,
    Prop,
    Provide
} from "vue-property-decorator";
import {
    findNearestComponent,
    spliceList
} from "./utils/helper";
import {
    addClass,
    removeClass
} from "./utils/dom";
import {
    NodeManage
} from "./model/NodeManage";
import {
    Node
} from "./model/Node";
import {
    arrayFindIndex
} from './utils/helper';

@Component({
    name: "Tree",
    components: {
        TreeBranch
    }
})
export default class Tree extends BaseVue {
    public root: any = null;
    public isTree: boolean = true;
    public treeManage ? : TreeManage;

    // 树列表
    @Prop({
        required: false,
        type: Array,
        default: () => []
    })
    public list ? : any[];

    // 树默认参数
    @Prop({
        required: false,
        type: Object,
        default: () => {
            return {
                children: "children",
                label: "label",
                disabled: "disabled"
            }
        }
    })
    public params: any;

    // 树列表
    @Prop({
        required: false,
        type: Number,
        default: 20
    })
    public indent ? : number;

    @Prop({
        required: false,
        type: Boolean,
        default: false
    })
    public allowDrop ? : Boolean;

    @Provide('treeInitData') treeInitData = this;

    public dragOptions: any = {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
    }

    public dragState: any = {
        draggingNode: null,
        // 拖拽node的父节点
        draggingNodeInitParent: null,
        // 是否是一棵树
        isSameTree: null
    }

    // 解决vue数组更新问题
    public refresh() {
        let newRoot = this.root.childNodes.splice(0);
        this.root.childNodes = [];
        this.$nextTick(() => {
            this.root.childNodes = newRoot;
        });
    }

    // 刷新整棵树
    public refreshTree() {
        this.$nextTick(() => {
            this.treeManage = new TreeManage({
                data: this.list,
                params: this.params
            })
            this.root = this.treeManage.root;
            let dragState = this.dragState;

            this.dragOptions.disabled = this.allowDrop;
        })
    }

    public onCreated() {
        this.treeManage = new TreeManage({
            data: this.list,
            params: this.params
        })
        this.root = this.treeManage.root;
        let dragState = this.dragState;

        this.dragOptions.disabled = this.allowDrop;

        this.$on("tree-node-drag-start", (event: any, treeBranch: TreeBranch, newIndex: number, oldIndex: number) => {
            event.item._vm_drag_state = dragState;
            dragState.draggingNode = treeBranch.branchList![oldIndex];
            this.$emit("node-drag-start", treeBranch, treeBranch.root, event);

            // TODO...
            // if(this.dragStartListener) {
            // 	let res = this.dragStartListener(event, event);
            // 	if(!res) {
            // 		// 回滚
            // 	}
            // }
        });

        this.$on("tree-node-drag-remove", (event: any, treeBranch: TreeBranch, newIndex: number, oldIndex: number) => {
            // 删除节点
            this.treeManage!.dragMoveChild(treeBranch.branchList![oldIndex], event.item._vm_drag_state.draggingNodeInitParent, event.item._vm_drag_state.isSameTree);
        });

        //更新节点 没有tree-node-drag-remove
        this.$on("tree-node-drag-update", (event: any, treeBranch: TreeBranch, newIndex: number, oldIndex: number) => {
            this.treeManage!.dragUpdateChildren(treeBranch.branchList![oldIndex], newIndex, oldIndex);
            this.refresh();
        });

        this.$on("tree-node-drag-add", (event: any, treeBranch: TreeBranch, newIndex: number, oldIndex: number) => {
            dragState.isSameTree = true;
            // 更换父节点之前保存
            event.item._vm_drag_state.draggingNodeInitParent = event.item._vm_drag_state.draggingNode.parent;
            event.item._vm_drag_state.draggingNode.parent = treeBranch.root;
            // 插入节点
            treeBranch.root.dragInsertChildren(event.item._vm_drag_state.draggingNode, newIndex, oldIndex);
        });

        this.$on("tree-node-drag-end", (event: any, treeBranch: TreeBranch, newIndex: number, oldIndex: number) => {
            console.log("-----this.root: ", this.root);
        });
    }

    // TODO...
    // public dragStartListener?: (toData: any[], fromData: any[]) => boolean;

    // public setOnDragStartListener(listener: (toData: any[], fromData: any[]) => boolean): void {
    // 	this.dragStartListener = listener;
    // }
}
</script>
