<template>
	<div class='tree'>
		<TreeNode :node='root' :list='root.childNodes'></TreeNode>
	</div>
</template>

<script lang='ts'>
import TreeNode from './tree-node.vue';
import { TreeManage } from './model/TreeManage';
import BaseVue from '@/components/base/BaseVue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
	name: 'Tree', components: { TreeNode },
	props: {
		/** 支持的扩展参数 */
		list: {
			required: false,
			type: Array,
			default: null
		},
		props: {
			default() {
				return {
					children: 'children',
					label: 'label',
					disabled: 'disabled'
				};
			}
		}
	}
})
export default class Tree extends BaseVue {
	public root: any = null;
	public isTree: boolean = true;

	// 树列表
	@Prop({ required: false, default: "" })
	public list: any[] = [];

	// 树默认参数
	@Prop({ required: false, default: "" })
	public pramas: any = {
		children: 'children',
		label: 'label',
		disabled: 'disabled'
	};

	public onCreated() {
		this.root = new TreeManage({
			data: this.list
		})
	}

};
</script>
