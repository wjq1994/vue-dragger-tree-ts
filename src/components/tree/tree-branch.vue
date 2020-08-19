<template>
  <div class="branch">
    <TreeNode :node="node" :key="getNodeKey(node)" v-for="node in branchList">
		<template v-slot:branch="slotProps">
			<TreeBranch nodeKey="id" :branch-list="slotProps.node.childNodes" ></TreeBranch>
		</template>
	</TreeNode>
  </div>
</template>

<script lang='ts'>
import TreeNode from "./tree-node.vue";
import { TreeManage } from "./model/TreeManage";
import BaseVue from "@/components/base/BaseVue";
import { Component, Prop, Inject } from "vue-property-decorator";
import draggable from "../draggable/vuedraggable.js";
import { findNearestComponent } from "../../utils/helper";
import { addClass, removeClass } from "../../utils/dom";
import { NodeManage } from "./model/NodeManage";
import { Node } from "./model/Node";
import Sortable from "sortablejs";
import { insertNodeAt, camelize, removeNode } from "../../utils/helper";

@Component({
  name: "TreeBranch",
  components: { TreeNode, draggable },
})
export default class Tree extends BaseVue {
  public tree!: Tree;

  // node唯一标识字段
  @Prop({ required: true, type: String, default: "" })
  public nodeKey: string;

  // 分支列表
  @Prop({ required: false, type: Array, default: () => [] })
  public branchList?: any[];

// tree组件created之前的静态
  @Inject("treeInitData") private readonly treeInitData!: any;

  // 拖拽插件
  public sortable!: Sortable;

  // 记录拖拽元素
  public draggingElement: any;

  public visibleIndexes: number[];
  public context: any = {};
  // 监听列表
  public eventsListened: any[] = ["Start", "Add", "Remove", "Update", "End"];
  public eventsToEmit: any[] = [
    "Choose",
    "Unchoose",
    "Sort",
    "Filter",
    "Clone",
  ];

  public dragState: any = {
    draggingNode: null,
  };

  public getNodeKey(node: Node) {
    return NodeManage.getNodeKey(this.nodeKey, node.data);
  }

  public onCreated() {
    // 获取到树组件
    let parent: any = this.$parent;

    while (!parent.isTree) {
      parent = parent.$parent;
    }

    this.tree = parent;
  }

  public onMounted() {
    this.getSortableOptions();
  }

  public getSortableOptions() {
    let treeDragOptions = this.treeInitData.dragOptions;
    const optionsAdded = {};
    this.eventsListened.forEach((elt) => {
      optionsAdded["on" + elt] = this.delegateAndEmit.call(this, elt);
    });

    this.eventsToEmit.forEach((elt) => {
      optionsAdded["on" + elt] = this.emit.bind(this, elt);
    });

    const attributes = Object.keys(this.$attrs).reduce((res, key) => {
      res[camelize(key)] = this.$attrs[key];
      return res;
    }, {});

    const options = Object.assign(
      {},
      treeDragOptions,
      attributes,
      optionsAdded,
      {
        onMove: (evt, originalEvent) => {
          return this.onDragMove(evt, originalEvent);
        },
      }
    );

    !("draggable" in options) && (options.draggable = ">*");
    // 计算子节点的index
    this.computeIndexes();
    this.sortable = new Sortable(this.$el as HTMLElement, options);
  }

  public refresh() {
    this.getSortableOptions();
  }

  public emit(evtName: string, evtData: any) {
    this.$nextTick(() => this.$emit(evtName.toLowerCase(), evtData));
  }

  public delegateAndEmit(evtName: string) {
    return (evtData) => {
      if (this.branchList !== null) {
        this["onDrag" + evtName](evtData);
      }
      this.emit.call(this, evtName, evtData);
    };
  }

  public onBeforeDestroy() {
    this.sortable && this.sortable.destroy();
  }

  public getUnderlyingVm(htmlElt) {
    const index = this.computeVmIndex(this.getChildrenNodes() || [], htmlElt);
    if (index === -1) {
      //Edge case during move callback: related element might be
      //an element different from collection
      return null;
    }
    const element = this.branchList[index];
    return { index, element };
  }

  public computeVmIndex(vnodes, element) {
    let index = 0;
    for (let [key, value] of vnodes.entries()) {
      value === element && (index = key);
    }
    return index;
  }
  public computeIndexes() {
    this.$nextTick(() => {
      this.visibleIndexes = this.computeIndexesFn(this.getChildrenNodes());
    });
  }

  public computeIndexesFn(childsNode: NodeListOf<Element>) {
    if (!childsNode) {
      return [];
    }
    const rawIndexes = [...childsNode].map((elt, idx) => idx);
    return rawIndexes;
  }

  public getVmIndex(domIndex) {
    const indexes = this.visibleIndexes;
    const numberIndexes = indexes.length;
    return domIndex > numberIndexes - 1 ? numberIndexes : indexes[domIndex];
  }

  public getChildrenNodes() {
    const rawNodes = this.$el.querySelectorAll(".node");
    return rawNodes;
  }

  public onDragStart(evt) {
    console.log("onDragStart: ", evt);
    this.context = this.getUnderlyingVm(evt.item);
    evt.item._underlying_vm_ = this.clone(this.context.element);
    this.draggingElement = evt.item;
    this.tree.$emit("tree-node-drag-start", evt, this);
  }

  public onDragAdd(evt) {
    console.log("onDragAdd: ", evt);
    const element = evt.item._underlying_vm_;
    if (element === undefined) {
      return;
    }
    // removeNode(evt.item);
    const newIndex = this.getVmIndex(evt.newIndex);
    this.spliceList(newIndex, 0, element);
    this.tree.$emit("tree-node-drag-add", evt, this);
    this.computeIndexes();
    const added = { element, newIndex };
    this.emitChanges({ added });
    // this.tree.$emit('tree-node-drag-add', evt, this);
  }

  public spliceList(newIndex: number, index: number, ele?: any) {
    console.log(...arguments);
  }

  public emitChanges(evt) {
    this.$nextTick(() => {
      this.$emit("change", evt);
    });
  }

  public onDragRemove(evt) {
    console.log("onDragRemove: ", evt);
    // insertNodeAt(this.$el, evt.item, evt.oldIndex);
    if (evt.pullMode === "clone") {
      // removeNode(evt.clone);
      return;
    }
    const oldIndex = this.context.index;
    this.spliceList(oldIndex, 1);
    const removed = { element: this.context.element, oldIndex };
    this.emitChanges({ removed });
    // this.tree.$emit('tree-node-drag-remove', evt, this);
  }

  public onDragUpdate(evt: any) {
    console.log("onDragUpdate: ", evt);
    // removeNode(evt.item);
    // insertNodeAt(evt.from, evt.item, evt.oldIndex);
    const oldIndex = this.context.index;
    const newIndex = this.getVmIndex(evt.newIndex);
    this.updatePosition(oldIndex, newIndex);
    const moved = { element: this.context.element, oldIndex, newIndex };
    this.emitChanges({ moved });
    // this.tree.$emit('tree-node-drag-update', evt, this);
  }

  updatePosition(oldIndex: number, newIndex: number) {
    console.log("updatePosition: ", oldIndex, newIndex);
  }

  public onDragMove(evt: any, originalEvent: any) {
		console.log('onDragMove: ', evt)
  }

  public onDragEnd() {
		console.log("onDragEnd");
		this.computeIndexes();
		this.draggingElement = null;
    // this.tree.$emit('tree-node-drag-end');
  }

  public clone<T>(obj: T): T {
    return obj;
  }
}
</script>
