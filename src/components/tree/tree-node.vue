<template>
<div class="node-container" :class="{
      'is-current': node.isCurrent,
    }" tabindex="-1">
    <div class="node" @click.stop="handleClick">
        <div :style="{ 'padding-left': (node.level - 1) * treeInitData.indent + 'px', 'text-align': 'left' }" class="node-content">
            <span :class="[
          'el-tree-node__expand-icon',
          node.data.iconClass ? node.data.iconClass : ''
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
import TreeBranch from "./tree-branch.vue";
import Tree from "./tree.vue";
import {
    TreeManage
} from "./model/TreeManage";
import BaseVue from "../base/BaseVue";
import {
    Component,
    Prop,
    Inject,
    Watch
} from "vue-property-decorator";
import {
    insertNodeAt,
    camelize,
    removeNode
} from "./utils/helper";
import {
    Node
} from "./model/Node";
import {
    NodeManage
} from "./model/NodeManage";
import NodeContent from "./node-content.vue"

@Component({
    name: "TreeNode",
    components: {
        TreeBranch,
        NodeContent
    }
})
export default class TreeNode extends BaseVue {
    // 树列表
    @Prop({
        required: false,
        type: Node,
        default: null
    })
    public node ? : Node;

    // tree组件created之前的静态
    @Inject("treeInitData") private readonly treeInitData!: any;

    @Watch('node', { immediate: true, deep: true })
	private onDragOptionsChanged(newOptionValue: any): void {
	}

    public tree!:Tree;

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
        console.log("this.tree: ", this.tree);
        const store = this.tree.treeManage;
        store!.setCurrentNode(this.node!);
        this.tree.$emit('node-click', {
            treeNode: this,
            node: this.node,
            data: this.node!.data
        });
    }
}
</script>

<style lang="scss">
.node-container {
    background: #ffffff;

    &:focus {
        outline: none;
        background: #f5f7fa;
    }

    .node {
        &>.node-content {
            &:hover {
                cursor: pointer;
                background: #f5f7fa;
            }
        }
    }
}
</style>
