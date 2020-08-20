<template>
	<div class="tree">
		<TreeBranch :branch-list="root.childNodes" :root="root"></TreeBranch>
	</div>
</template>

<script lang='ts'>
import TreeNode from "./tree-node.vue";
import TreeBranch from "./tree-branch.vue";
import { TreeManage } from "./model/TreeManage";
import BaseVue from "@/components/base/BaseVue";
import { Component, Prop, Provide } from "vue-property-decorator";
import draggable from "../draggable/vuedraggable.js";
import { findNearestComponent, spliceList } from "../../utils/helper";
import { addClass, removeClass } from "../../utils/dom";
import { NodeManage } from "./model/NodeManage";
import { Node } from "./model/Node";
import { arrayFindIndex } from '../../utils/helper';

@Component({
	name: "Tree",
	components: { TreeBranch, draggable }
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

	// node唯一标识字段
	@Prop({ required: true, type: String, default: "" })
	public nodeKey: string;

	// 树列表
	@Prop({ required: false, type: Number, default: 20 })
	public indent?: number;

	@Prop({ required: false, type: Function, default: null })
	public allowDrop?: Function;

	@Provide('treeInitData') treeInitData = this;

	public dragOptions: any = {
		animation: 0,
		group: "description",
		disabled: false,
		ghostClass: "ghost"
	}

	public dragState: any = {
		draggingNode: null,
		// 拖拽node的父节点
		draggingNodeInitParent: null,
	}

	public getNodeKey(node: Node) {
		return NodeManage.getNodeKey(this.nodeKey, node.data);
	}

	// 解决vue数组更新问题
	public refresh() {
		let newRoot = this.root.childNodes.splice(0);
		this.root.childNodes = [];
		this.$nextTick(() => {
			this.root.childNodes = newRoot;
		});
	}

	public onCreated() {
		this.treeManage = new TreeManage({
			key: this.nodeKey,
			data: this.list,
			params: this.params
		})
		this.root = this.treeManage.root;
		let dragState = this.dragState;

		this.$on("tree-node-drag-start", (event: any, treeBranch: TreeBranch, newIndex: number, oldIndex: number) => {
			dragState.draggingNode = treeBranch.branchList[oldIndex];
			this.$emit("node-drag-start", treeBranch, treeBranch.root, event);
		});

		this.$on("tree-node-drag-remove", (event: any, treeBranch: TreeBranch, newIndex: number, oldIndex: number) => {
			// 删除节点
			this.treeManage.dragMoveChild(treeBranch.branchList[oldIndex], dragState.draggingNodeInitParent);
		});

		//更新节点 没有tree-node-drag-remove
		this.$on("tree-node-drag-update", (event: any, treeBranch: TreeBranch, newIndex: number, oldIndex: number) => {
			this.treeManage.dragUpdateChildren(treeBranch.branchList[oldIndex], newIndex, oldIndex);
			this.refresh();
		});

		this.$on("tree-node-drag-add", (event: any, treeBranch: TreeBranch, newIndex: number, oldIndex: number) => {
			// 更换父节点之前保存
			dragState.draggingNodeInitParent = dragState.draggingNode.parent;
			dragState.draggingNode.parent = treeBranch.root;
			// 插入节点
			treeBranch.root.insertChild(dragState.draggingNode, newIndex);
			// 更新数据
			spliceList(treeBranch.root.getChildren(true), newIndex, 0, dragState.draggingNode.data);
		});

		this.$on("tree-node-drag-end", (event: any, treeBranch: TreeBranch, newIndex: number, oldIndex: number) => {
			dragState.draggingNode = null;
			dragState.draggingNodeInitParent = null;
			console.log("-----this.root: ", this.root);
		});
	}
}
</script>
