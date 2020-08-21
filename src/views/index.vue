<template>
  <div>
    <tree nodeKey="id" ref="tree" :list="data">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(node, data)">
            Append
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button>
        </span>
      </span>
    </tree>
    <br/>
    <br/>
    <br/>
    <tree nodeKey="id" ref="tree1" :list="data1">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.label }}</span>
        <span>
          <el-button
            type="text"
            size="mini"
            @click="() => append(node, data)">
            Append
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button>
        </span>
      </span>
    </tree>
    <button @click="onClickTest">测试</button>
  </div>
</template>

<script lang='ts'>
import BaseVue from "@/components/base/BaseVue";
// @ts-ignore
import tree from "../components/tree/tree.vue";
import mytree from "../components/mytree/tree.vue";
import eltree from "../components/eltree/tree.vue";

import { Component } from "vue-property-decorator";

@Component({ name: "index", components: { tree, mytree, eltree } })
export default class Index extends BaseVue {
  public defaultProps: any = {
    children: "children",
    label: "label",
  };
  public data: any = [
    {
      label: "一级 1",
      children: [
        {
          label: "二级 1-1",
          children: [{ label: "三级 1-1-1", iconClass: "el-icon-folder" }],
          iconClass: "el-icon-document",
        },
      ],
      iconClass: "el-icon-folder",
    },
    {
      label: "一级 2",
      children: [
        {
          label: "二级 2-1",
          children: [{ label: "三级 2-1-1", iconClass: "el-icon-folder" }],
          iconClass: "el-icon-document",
        },
        {
          label: "二级 2-2",
          children: [{ label: "三级 2-2-1", iconClass: "el-icon-folder" }],
          iconClass: "el-icon-document",
        },
      ],
      iconClass: "el-icon-folder",
    },
    {
      label: "一级 3",
      children: [
        {
          label: "二级 3-1",
          children: [{ label: "三级 3-1-1", iconClass: "el-icon-folder" }],
          iconClass: "el-icon-document",
        },
        {
          label: "二级 3-2",
          children: [{ label: "三级 3-2-1", iconClass: "el-icon-folder" }],
          iconClass: "el-icon-document",
        },
      ],
      iconClass: "el-icon-folder",
    },
  ];
  public data1: any = [
    {
      label: "一级 1",
      children: [
        {
          label: "二级 1-1",
          children: [
            {
              label: "三级 1-1-1",
            },
          ],
        },
      ],
    },
  ];
  public data0: any = [
    {
      label: "一级 1",
      children: [],
    },
  ];
  public onClickTest() {
    console.log("this.data", this.data);
    console.log("this.treeManage", (this.$refs.tree as any).treeManage);
    console.log("this.treeManage1", (this.$refs.tree1 as any).treeManage);
  }
  // 增
  public append(node, data) {
    console.log("append")
    let newChild = { data:{ label: 'testtest', children: []} };
    node.insertChild(newChild);
  }
  // 删
  public remove(node, data) {
    console.log("remove", node, data);
    node.parent.removeChild(node);
  }
}
</script>

<style>
</style>