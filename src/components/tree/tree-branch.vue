<template>
	<div class="branch">
		<TreeNode :node="node" :key="getNodeKey(node)" v-for="node in branchList">
			<template v-slot:branch="slotProps">
				<TreeBranch :root="slotProps.node" :branch-list="slotProps.node.childNodes"></TreeBranch>
			</template>
		</TreeNode>
	</div>
</template>

<script lang='ts'>
import TreeNode from "./tree-node.vue";
import Tree from "./tree.vue";
import { TreeManage } from "./model/TreeManage";
import BaseVue from "../base/BaseVue";
import { Component, Prop, Inject, Watch } from "vue-property-decorator";
import { findNearestComponent } from "./utils/helper";
import { addClass, removeClass } from "./utils/dom";
import { NodeManage, NODE_KEY } from "./model/NodeManage";
import { Node } from "./model/Node";
// @ts-ignore
import Sortable from "sortablejs";
import { insertNodeAt, camelize, removeNode } from "./utils/helper";

@Component({
	name: "TreeBranch",
	components: { TreeNode }
})
export default class TreeBranch extends BaseVue {
	public tree!: Tree;

	// node唯一标识字段
	@Prop({ required: false, type: Object, default: "" })
	public root: any;

	// 分支列表
	@Prop({ required: false, type: Array, default: () => [] })
	public branchList?: any[];

	// tree组件created之前的静态
	@Inject("treeInitData") private readonly treeInitData!: any;

	@Watch('treeInitData.dragOptions')
	private onDragOptionsChanged(newOptionValue: any): void {
		this.updateOptions(newOptionValue);
	}

	// 拖拽插件
	public sortable!: Sortable;

	// 记录拖拽元素
	public draggingElement: any;

	public visibleIndexes?: number[];
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
	public readonlyProperties = ["Move", ...this.eventsListened, ...this.eventsToEmit].map(
		evt => "on" + evt
	);

	public dragState: any = {
		draggingNode: null,
	};

	public getNodeKey(node: Node) {
		return NodeManage.getNodeKey(NODE_KEY, node.data);
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

	public onBeforeDestroy() {
		this.sortable && this.sortable.destroy();
	}

	public updateOptions(newOptionValue: any) {
      for (var property in newOptionValue) {
        const value: any = camelize(property);
        if (this.readonlyProperties.indexOf(value) === -1) {
          this.sortable.option(value, newOptionValue[property]);
        }
      }
    }

	public getSortableOptions() {
		let treeDragOptions = this.treeInitData.dragOptions;
		const optionsAdded = {};
		this.eventsListened.forEach((elt) => {
			// @ts-ignore
			optionsAdded["on" + elt] = this.delegateAndEmit.call(this, elt);
		});

		this.eventsToEmit.forEach((elt) => {
			// @ts-ignore
			optionsAdded["on" + elt] = this.emit.bind(this, elt);
		});

		const attributes = Object.keys(this.$attrs).reduce((res, key) => {
			// @ts-ignore
			res[camelize(key)] = this.$attrs[key];
			return res;
		}, {});

		const options = Object.assign(
			{},
			treeDragOptions,
			attributes,
			optionsAdded,
			{
				onMove: (evt: any, originalEvent: any) => {
					return this.onDragMove(evt, originalEvent);
				},
			}
		);
		!("draggable" in options) && (options.draggable = ">*");
		this.sortable = new Sortable(this.$el as HTMLElement, options);
	}

	public emit(evtName: string, evtData: any) {
		this.$nextTick(() => this.$emit(evtName.toLowerCase(), evtData));
	}

	public delegateAndEmit(evtName: string) {
		return (evtData: any) => {
			if (this.branchList !== null) {
				// @ts-ignore
				this["onDrag" + evtName](evtData);
			}
			this.emit.call(this, evtName, evtData);
		};
	}

	public getUnderlyingVm(htmlElt: any) {
		const index = this.computeVmIndex(this.getChildrenNodes() || [], htmlElt);
		if (index === -1) {
			//Edge case during move callback: related element might be
			//an element different from collection
			return null;
		}
		const element = this.branchList![index];
		return { index, element };
	}

	public computeVmIndex(vnodes: any, element: any) {
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

	public getVmIndex(domIndex: any) {
		const indexes = this.visibleIndexes;
		const numberIndexes = indexes!.length;
		return domIndex > numberIndexes - 1 ? numberIndexes : indexes![domIndex];
	}

	public getChildrenNodes() {
		const rawNodes = this.$el.querySelectorAll(".node-container");
		return rawNodes;
	}

	public onDragStart(evt: any) {
		console.log("onDragStart: ", evt);
		this.tree.$emit("tree-node-drag-start", evt, this, evt.newIndex, evt.oldIndex);
	}

	public onDragAdd(evt: any) {
		console.log("onDragAdd: ", evt);
		this.tree.$emit("tree-node-drag-add", evt, this, evt.newIndex, evt.oldIndex);
	}

	public emitChanges(evt: any) {
		this.$nextTick(() => {
			this.$emit("change", evt);
		});
	}

	public onDragRemove(evt: any) {
		console.log("onDragRemove: ", evt);
		this.tree.$emit('tree-node-drag-remove', evt, this, evt.newIndex, evt.oldIndex);
	}

	public onDragUpdate(evt: any) {
		console.log("onDragUpdate: ", evt);
		this.tree.$emit('tree-node-drag-update', evt, this, evt.newIndex, evt.oldIndex);
	}

	public onDragMove(evt: any, originalEvent: any) {
		console.log('onDragMove: ', evt);
	}

	public onDragEnd(evt: any) {
		console.log("onDragEnd", evt);
		this.tree.$emit('tree-node-drag-end', evt, this, evt.newIndex, evt.oldIndex);
	}

	public clone<T>(obj: T): T {
		return obj;
	}
}
</script>
