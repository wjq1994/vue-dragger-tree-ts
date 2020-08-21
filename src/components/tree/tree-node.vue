<template>
  <div class="node-container">
    <div class="node" @click.stop="handleClick">
      <div
        :style="{ 'padding-left': (node.level - 1) * treeInitData.indent + 'px', 'text-align': 'left' }"
        class="item"
      >
        <span
          :class="[
          'el-tree-node__expand-icon',
          node.data.iconClass ? node.data.iconClass : 'el-icon-document'
        ]"
        ></span>
				<node-content :node="node"></node-content>
      </div>
      <slot name="branch" :node="node"></slot>
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
  components: { draggable, TreeBranch, NodeContent},
})
export default class TreeNode extends BaseVue {
  // 树列表
  @Prop({ required: false, type: Object, default: null })
  public node?: any;

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
    console.log(
      this.node.data.label,
      "this.tree.treeManage: ",
      this.tree.treeManage
    );
    console.log(this.node.data.label, "this.node: ", this.node);
    const store = this.tree.treeManage;
    store!.setCurrentNode(this.node);
    this.tree.$emit('node-click', this.node, this.node.data);
  }
}
</script>
<style>
/* .node-container {
  margin-left: 20px;
} */
</style>
