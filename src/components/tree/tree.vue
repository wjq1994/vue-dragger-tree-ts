<template>
	<div class="tree">
		<TreeBranch nodeKey="id" :branch-list="root.childNodes"></TreeBranch>
		<button @click="onTestClick">测试</button>
	</div>
</template>

<script lang='ts'>
import TreeNode from "./tree-node.vue";
import TreeBranch from "./tree-branch.vue";
import { TreeManage } from "./model/TreeManage";
import BaseVue from "@/components/base/BaseVue";
import { Component, Prop, Provide } from "vue-property-decorator";
import draggable from "../draggable/vuedraggable.js";
import { findNearestComponent } from "../../utils/helper"
import { addClass, removeClass } from "../../utils/dom"
import { NodeManage } from "./model/NodeManage"
import { Node } from "./model/Node"

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
		draggingNode: null
	}

	public getNodeKey(node: Node) {
		return NodeManage.getNodeKey(this.nodeKey, node.data);
	}

	public onCreated() {
		this.treeManage = new TreeManage({
			key: this.nodeKey,
			data: this.list,
			params: this.params
		})
		this.root = this.treeManage.root;
		let dragState = this.dragState;

		this.$on("tree-node-drag-start", (event: any, treeNode: TreeNode) => {
			//dragState.draggingNode = treeNode;
			this.$emit("node-drag-start", treeNode.node, event);
		});

		this.$on("tree-node-drag-remove", (event: any, treeNode: TreeNode) => {
			// this.treeManage.remove(treeNode.node);
		});

		this.$on("tree-node-drag-update", (event: any, treeNode: TreeNode) => {
			treeNode.node.parent && treeNode.node.parent.insertChild(treeNode.node);
		});

		this.$on("tree-node-drag-add", (event: any, treeNode: TreeNode) => {
			const { draggingNode } = dragState;
		});

		this.$on("tree-node-drag-end", (event: any) => {
			const { draggingNode } = dragState;
			dragState.draggingNode = null;
			console.log("-----this.root: ", this.root);
			// if (draggingNode && dropNode) {
			// 	const draggingNodeCopy = NodeManage.generateNode({ data: draggingNode.node.data });
			// 	if (dropType !== "none") {
			// 		draggingNode.node.remove();
			// 	}
			// 	if (dropType === "before") {
			// 		dropNode.node.parent.insertBefore(
			// 			draggingNodeCopy,
			// 			dropNode.node
			// 		);
			// 	} else if (dropType === "after") {
			// 		dropNode.node.parent.insertAfter(
			// 			draggingNodeCopy,
			// 			dropNode.node
			// 		);
			// 	} else if (dropType === "inner") {
			// 		dropNode.node.insertChild(draggingNodeCopy);
			// 	}
			// 	if (dropType !== "none") {
			// 		this.treeManage!.registerNode(draggingNodeCopy!);
			// 	}
			// 	removeClass(dropNode.$el, "is-drop-inner");

			// 	this.$emit(
			// 		"node-drag-end",
			// 		draggingNode.node,
			// 		dropNode.node,
			// 		dropType,
			// 		event
			// 	);
			// 	if (dropType !== "none") {
			// 		this.$emit(
			// 			"node-drop",
			// 			draggingNode.node,
			// 			dropNode.node,
			// 			dropType,
			// 			event
			// 		);
			// 	}
			// }
			// if (draggingNode && !dropNode) {
			// 	this.$emit(
			// 		"node-drag-end",
			// 		draggingNode.node,
			// 		null,
			// 		dropType,
			// 		event
			// 	);
			// }

			// dragState.showDropIndicator = false;
			// dragState.draggingNode = null;
			// dragState.dropNode = null;
			// dragState.allowDrop = true;
		});
	}

	public onTestClick() {
		console.log("------", JSON.stringify(this.treeManage.nodesMap));
	}
}
</script>
