<template>
	<div class="tree">
		<TreeBranch :branch-list="root.childNodes" :root="root"></TreeBranch>
	</div>
</template>

<script lang='ts'>
import TreeNode from "./tree-node.vue";
import TreeBranch from "./tree-branch.vue";
import { TreeManage } from "./model/TreeManage";
import BaseVue from "../base/BaseVue";
import { Component, Prop, Provide } from "vue-property-decorator";
import { findNearestComponent, spliceList, removeNode, arrayFindIndex } from "./utils/helper";
import { addClass, removeClass } from "./utils/dom";
import { NodeManage } from "./model/NodeManage";
import { Node } from "./model/Node";

@Component({
	name: "Tree",
	components: { TreeBranch }
})
export default class Tree extends BaseVue {
	public root: any = null;
	public isTree: boolean = true;
	public treeManage?: TreeManage;

	// 树列表
	@Prop({ required: false, type: Array, default: () => [] })
	public list?: any[];

	// 树默认参数
	@Prop({
		required: false,
		type: Object,
		default: () => { return { children: "children", label: "label", disabled: "disabled" } }
	})
	public params: any;

	// 树列表
	@Prop({ required: false, type: Number, default: 20 })
	public indent?: number;

	@Prop({
		required: false,
		type: Object,
		default: () => { return { animation: 0, group: "description", disabled: false, ghostClass: "ghost" } }
	})
	public dragOptions?: any;

	// refreshFunc初始化函数，在refresh之前调用
	@Prop({
		required: false,
		type: Function,
		default: () => { return null }
	})
	public refreshFunc?: Function;

	@Provide('treeInitData') treeInitData = this;

	public dragState: any = {
		draggingNode: null,
		// 拖拽node的父节点
		draggingNodeInitParent: null,
		dragFromTree: null,
		dragToTree: null,
		dragType: ""
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
		if (this.refreshFunc) {
			this.refreshFunc();
		}
		this.$nextTick(() => {
			this.treeManage = new TreeManage({
				data: this.list,
				params: this.params
			})
			this.root = this.treeManage.root;
			let dragState = this.dragState;
		})
	}

	public onCreated() {
		this.treeManage = new TreeManage({
			data: this.list,
			params: this.params
		})
		this.root = this.treeManage.root;
		let dragState = this.dragState;

		this.$on("tree-node-drag-start", (event: any, treeBranch: TreeBranch, newIndex: number, oldIndex: number) => {
			event.item._vm_drag_state = dragState;
			dragState.draggingNode = treeBranch.branchList![oldIndex];
			dragState.dragFromTree = this;
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
			let isSameTree = event.item._vm_drag_state.dragFromTree === event.item._vm_drag_state.dragToTree;
			console.log("tree-node-drag-remove isSameTree: ", isSameTree, ";oldIndex: ", oldIndex, ";newIndex: ", newIndex);
			if (event.pullMode === "clone") {
				console.log("当前是clone模式");
				return;
			};
			removeNode(event.item);
			this.$nextTick(() => {
				// 删除节点
				this.treeManage!.dragMoveChild(treeBranch.branchList![oldIndex], event.item._vm_drag_state.draggingNodeInitParent, isSameTree);
				console.log("-----tree-node-drag-remove----------this.root: ", this.root);
			});
		});

		//更新节点 没有tree-node-drag-remove
		this.$on("tree-node-drag-update", (event: any, treeBranch: TreeBranch, newIndex: number, oldIndex: number) => {
			console.log("tree-node-drag-update: ", "oldIndex: ", oldIndex, ";newIndex: ", newIndex);
			console.log("-----tree-node-drag-update前----------this.root: ", this.root);
			this.treeManage!.dragUpdateChildren(treeBranch.branchList![oldIndex], newIndex, oldIndex);
			console.log("-----tree-node-drag-update后----------this.root: ", this.root);
		});

		this.$on("tree-node-drag-add", (event: any, treeBranch: TreeBranch, newIndex: number, oldIndex: number) => {
			event.item._vm_drag_state.dragToTree = this;
			// 更换父节点之前保存
			event.item._vm_drag_state.draggingNodeInitParent = event.item._vm_drag_state.draggingNode.parent;
			event.item._vm_drag_state.draggingNode.parent = treeBranch.root;
			let isSameTree = event.item._vm_drag_state.dragFromTree === event.item._vm_drag_state.dragToTree;
			console.log("tree-node-drag-add isSameTree: ", isSameTree, ";oldIndex: ", oldIndex, ";newIndex: ", newIndex);
			console.log("tree-node-drag-add treeBranch: ", treeBranch.tree);
			removeNode(event.item);
			this.$nextTick(() => {
				// 插入节点
				treeBranch.root.dragInsertChildren(event.item._vm_drag_state.draggingNode, oldIndex, newIndex, isSameTree);
				console.log("-----tree-node-drag-add----------this.root: ", this.root);
			});
		});

		this.$on("tree-node-drag-end", (event: any, treeBranch: TreeBranch, newIndex: number, oldIndex: number) => {
			console.log("-----tree-node-drag-end----------this.root: ", this.root);
		});
	}

	// TODO...
	// public dragStartListener?: (toData: any[], fromData: any[]) => boolean;

	// public setOnDragStartListener(listener: (toData: any[], fromData: any[]) => boolean): void {
	// 	this.dragStartListener = listener;
	// }
}
</script>
