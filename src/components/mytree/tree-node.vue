<template>
	<draggable v-bind="dragOptions" tag="div" class="item-container" :list="list">
		<div class="node" :key="el.label" v-for="el in list">
			<div style="padding-left: 18px;text-align: left" class="item">{{ el.label }}</div>
			<tree-node class="item-sub" :node="el" :list="el.childNodes" />
		</div>
	</draggable>
</template>

<script>
import draggable from "../draggable/vuedraggable.js";
export default {
	name: "TreeNode",
	components: {
		draggable
	},
	data() {
		return {};
	},

	props: {
		value: {
			required: false,
			type: Array,
			default: null
		},
		list: {
			required: false,
			type: Array,
			default: null
		},
		node: {
			required: true,
			type: Object,
			default: null
		}
	},

	computed: {
        dragOptions() {
			return {
				animation: 0,
				group: "description",
				disabled: false,
				ghostClass: "ghost"
			};
		},
		// this.value when input = v-model
		// this.list  when input != v-model
		realValue() {
			return this.value ? this.value : this.list;
		}
	},

	methods: {
	
	},

	created() {},

	mounted() {},

	updated() {}
};
</script>
