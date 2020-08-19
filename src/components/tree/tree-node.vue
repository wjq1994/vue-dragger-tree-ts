<template>
	<div class="node-container">
		<div class="node" @click.stop="handleClick">
			<div :style="{ 'padding-left': (node.level - 1) * treeInitData.indent + 'px', 'text-align': 'left' }"
				class="item">{{ node.data.label }}</div>
			<tree-node class="item-sub" :key="getNodeKey(childNode)" v-for="childNode in node.childNodes"
				:node="childNode" />
		</div>
	</div>
</template>

<script lang="ts">
import draggable from "../draggable/vuedraggable.js";
import Tree from "./tree.vue";
import { TreeManage } from "./model/TreeManage";
import BaseVue from "@/components/base/BaseVue";
import { Component, Prop, Inject, Watch } from "vue-property-decorator";
import Sortable from "sortablejs";
import { insertNodeAt, camelize, removeNode } from "../../utils/helper";
import { Node } from "./model/Node";
import { NodeManage } from "./model/NodeManage"

@Component({
	name: "TreeNode",
	components: { draggable }
})
export default class TreeNode extends BaseVue {
	// 树列表
	@Prop({ required: false, type: Object, default: null })
	public node?: any;

	// tree组件created之前的静态
	@Inject("treeInitData") private readonly treeInitData!: any;

	public tree!: Tree;

	public context: any = {};

	// 拖拽插件
	public sortable!: Sortable;

	// 监听列表
	public eventsListened: any[] = ["Start", "Add", "Remove", "Update", "End"];
	public eventsToEmit: any[] = ["Choose", "Unchoose", "Sort", "Filter", "Clone"];

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
		this.eventsListened.forEach(elt => {
			optionsAdded["on" + elt] = this.delegateAndEmit.call(this, elt);
		});

		this.eventsToEmit.forEach(elt => {
			optionsAdded["on" + elt] = this.emit.bind(this, elt);
		});

		const attributes = Object.keys(this.$attrs).reduce((res, key) => {
			res[camelize(key)] = this.$attrs[key];
			return res;
		}, {});

		const options = Object.assign({}, treeDragOptions, attributes, optionsAdded, {
			onMove: (evt, originalEvent) => {
				return this.onDragMove(evt, originalEvent);
			}
		});

		!("draggable" in options) && (options.draggable = ">*");
		this.sortable = new Sortable(this.$el as HTMLElement, options);
	}

	public refresh() {
		this.getSortableOptions()
	}

	public handleClick() {
		console.log(this.node.data.label, "this.tree.treeManage: ", this.tree.treeManage);
		console.log(this.node.data.label, "this.node: ", this.node);
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

	public emit(evtName: string, evtData: any) {
		this.$nextTick(() => this.$emit(evtName.toLowerCase(), evtData));
	}

	public delegateAndEmit(evtName: string) {
		return evtData => {
			if (this.node !== null) {
				this["onDrag" + evtName](evtData);
			}
			this.emit.call(this, evtName, evtData);
		};
	}

	public onBeforeDestroy() {
		this.sortable && this.sortable.destroy();
	}

	public onDragStart(evt) {
		console.log(this.node.data.label, 'onDragStart: ', evt);
		this.tree.$emit('tree-node-drag-start', evt, this);
	}

	public onDragAdd(evt) {
		console.log(this.node.data.label, 'onDragAdd: ', evt);
		this.tree.$emit('tree-node-drag-add', evt, this);
	}

	public onDragRemove(evt) {
		console.log(this.node.data.label, 'onDragRemove: ', evt);
		this.tree.$emit('tree-node-drag-remove', evt, this);
	}

	public onDragUpdate(evt) {
		console.log(this.node.data.label, 'onDragUpdate: ', evt);
		this.tree.$emit('tree-node-drag-update', evt, this);
	}

	public onDragMove(evt, originalEvent) {
		console.log(this.node.data.label, 'onDragMove: ', evt)
	}

	public onDragEnd() {
		console.log(this.node.data.label, 'onDragEnd')
		this.tree.$emit('tree-node-drag-end');
	}

	public clone<T>(obj: T): T {
		return obj;
	}

	public getNodeKey(node: Node) {
		return NodeManage.getNodeKey(this.tree.nodeKey, node.data);
	}
}
</script>
