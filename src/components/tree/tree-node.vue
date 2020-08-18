<template>		
	<draggable v-bind="dragOptions" tag="div" class="item-container" :list="list">
		<div class="node" :key="node.data.label" v-for="node in list" @click.stop="handleClick">
			<div :style="{ 'padding-left': (node.level - 1) * treeInitData.indent + 'px', 'text-align': 'left' }" class="item">{{ node.data.label }}</div>
			<tree-node class="item-sub" :node="node" :list="node.childNodes" />
		</div>
	</draggable>
</template>

<script lang="ts">
import draggable from "../draggable/vuedraggable.js";
import Tree from "./tree.vue";
import { TreeManage } from "./model/TreeManage";
import BaseVue from "@/components/base/BaseVue";
import { Component, Prop, Inject, Watch } from "vue-property-decorator";

@Component({
  name: "TreeNode",
  components: {	draggable  }
})
export default class TreeNode extends BaseVue {
	
	// 树列表
	@Prop({ required: false, type: Array, default: null })
	public list?: any[];

	// 树列表
	@Prop({ required: false, type: Object, default: null })
	public node?: any;

	// tree组件created之前的静态
	@Inject("treeInitData") private readonly treeInitData!: any;

	public tree!: Tree;

	public dragOptions: any = {
		animation: 0,
		group: "description",
		disabled: false,
		ghostClass: "ghost"
	}

	public onCreated() {
		// 获取到树组件
		let parent: any = this.$parent;

		while(!parent.isTree) {
			parent = parent.$parent;
		}

		this.tree = parent;

	}

	public handleClick() {
		console.log("this.tree.treeManage: ", this.tree.treeManage);
		const store = this.tree.treeManage;
		store!.setCurrentNode(this.node);
		// this.tree.$emit(
		// 	"current-change",
		// 	store.currentNode ? store.currentNode.data : null,
		// 	store.currentNode
		// );
		// this.tree.currentNode = this;
		// if (this.tree.expandOnClickNode) {
		// 	this.handleExpandIconClick();
		// }
		// if (this.tree.checkOnClickNode && !this.node.disabled) {
		// 	this.handleCheckChange(null, {
		// 		target: { checked: !this.node.checked }
		// 	});
		// }
		// this.tree.$emit("node-click", this.node.data, this.node, this);
	}
};
</script>
