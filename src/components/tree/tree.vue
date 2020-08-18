<template>
  <div class="tree">
    <draggable v-bind="dragOptions" tag="div" class="item-container" :list="root.childNodes">
      <TreeNode :node="node" :key="node.key" v-for="node in root.childNodes"></TreeNode>
    </draggable>
    <button @click="onTestClick">测试</button>
  </div>
</template>

<script lang='ts'>
import TreeNode from "./tree-node.vue";
import { TreeManage } from "./model/TreeManage";
import BaseVue from "@/components/base/BaseVue";
import { Component, Prop, Provide } from "vue-property-decorator";
import draggable from "../draggable/vuedraggable.js";

@Component({
  name: "Tree",
  components: { TreeNode, draggable }
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
    default: () => { return { children: "children", label: "label", disabled: "disabled" }}
  })
  public params: any;

  // 树列表
  @Prop({ required: false, type: Number, default: 20 })
  public indent?: number;

  @Provide('treeInitData') treeInitData = this;

  public dragOptions: any = {
		animation: 0,
		group: "description",
		disabled: false,
		ghostClass: "ghost"
	}

  public onCreated() {
    this.treeManage = new TreeManage({
      data: this.list,
      params: this.params
	  })
    this.root = this.treeManage.root;
	
	console.log("this.root", this.root);
  }

  public onTestClick() {

  }
}
</script>
