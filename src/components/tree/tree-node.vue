<template>
	<div>
		<div class="item-container">
			<div class="node" @click.stop="handleClick">
				<div :style="{ 'padding-left': (node.level - 1) * treeInitData.indent + 'px', 'text-align': 'left' }"
					class="item">{{ node.data.label }}</div>
				<tree-node class="item-sub" :key="childNode.data.label" v-for="childNode in node.childNodes"
					:node="childNode" />
			</div>
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
	private _sortable!: Sortable;

	// 监听列表
	private _eventsListened: String[] = ["Start", "Add", "Remove", "Update", "End"];
	private _eventsToEmit: String[] = ["Choose", "Unchoose", "Sort", "Filter", "Clone"];

	public onCreated() {
		// 获取到树组件
		let parent: any = this.$parent;

		while (!parent.isTree) {
			parent = parent.$parent;
		}

		this.tree = parent;
	}

	public onMounted() {
		this.getSortableOptions(this.treeInitData.dragOptions);
	}


	public getSortableOptions(treeDragOptions: any) {
		const optionsAdded = {};
		this._eventsListened.forEach(elt => {
			optionsAdded["on" + elt] = this.delegateAndEmit.call(this, elt);
		});

		this._eventsToEmit.forEach(elt => {
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
		this._sortable = new Sortable(this.$el as HTMLElement, options);
	}

	public handleClick() {
		console.log("this.tree.treeManage: ", this.tree.treeManage);
		console.log("this.node: ", this.node);
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

  public getUnderlyingVm() {
    const index = computeVmIndex(this.getChildrenNodes() || [], htmlElt);
      if (index === -1) {
        //Edge case during move callback: related element might be
        //an element different from collection
        return null;
      }
      const element = this.realList[index];
      return { index, element };
  }

  public onDragStart(evt) {
    console.log('onDragStart: ', evt)
    this.context = this.getUnderlyingVm(evt.item);
    evt.item._underlying_vm_ = this.clone(this.context.element);
    draggingElement = evt.item;
  }

  public clone<T>(obj: T) :T{
    return obj;
  }
}
</script>
