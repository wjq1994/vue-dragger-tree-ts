<template>
	<div class="node-container" :class="{
      'is-current': node.isCurrent,
    }">
		<div class="node" @click.stop="handleClick">
			<div :style="{ 'padding-left': (node.level - 1) * treeInitData.indent + 'px', 'text-align': 'left' }"
				class="node-content">
				<span :class="[
          'el-tree-node__expand-icon',
          node.data.iconClass ? node.data.iconClass : 'el-icon-document'
        ]"></span>
				<node-content :node="node"></node-content>
			</div>
			<div class="node-children">
				<slot name="branch" :node="node"></slot>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import draggable from "../draggable/vuedraggable.js";
import TreeBranch from "./tree-branch.vue";
import Tree from "./tree.vue";
import { TreeManage } from "./model/TreeManage";
import BaseVue from "@/components/base/BaseVue";
import { Component, Prop, Inject, Watch } from "vue-property-decorator";
import { insertNodeAt, camelize, removeNode } from "../../utils/helper";
import { Node } from "./model/Node";
import { NodeManage } from "./model/NodeManage";
import NodeContent from "./node-content.vue"

@Component({
	name: "TreeNode",
	components: { draggable, TreeBranch, NodeContent },
})
export default class TreeNode extends BaseVue {
	// 树列表
	@Prop({ required: false, type: Node, default: null })
	public node?: Node;

	// tree组件created之前的静态
	@Inject("treeInitData") private readonly treeInitData!: any;

	public tree!: Tree;

	public onCreated() {
		// 获取到树组件
		let parent: any = this.$parent;

		while (!parent.isTree) {
			parent = parent.$parent;
		}

		this.tree = parent;
	}

	public handleClick() {
		console.log("this.node: ", this.node);
		const store = this.tree.treeManage;
		store!.setCurrentNode(this.node);
    this.tree.refresh();
		this.tree.$emit('node-click', this, this.node, this.node.data);
	}
}
</script>
<style lang="scss">
.node-container {
  background: #ffffff;
  &.is-current {
    background: #f5f7fa;
  }

	.node {
		& > .node-content {
			&:hover {
				cursor: pointer;
				background: #f5f7fa;
			}
		}
	}
}
</style>
