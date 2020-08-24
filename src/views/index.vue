<template>
	<div>
		<tree :allowDrop="allowDrop" nodeKey="id" ref="tree" :list="data" @node-click="nodeClick">
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<span>{{ data.label }}</span>
				<span>
					<el-button type="text" size="mini" @click.stop="() => append(node, data)">
						Append
					</el-button>
					<el-button type="text" size="mini" @click.stop="() => remove(node, data)">
						Delete
					</el-button>
				</span>
			</span>
		</tree>
		<br />
		<br />
		<br />
		<tree nodeKey="id" ref="tree1" :list="data1">
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<span>{{ data.label }}</span>
				<span>
					<el-button type="text" size="mini" @click.stop="() => append(node, data)">
						Append
					</el-button>
					<el-button type="text" size="mini" @click.stop="() => remove(node, data)">
						Delete
					</el-button>
				</span>
			</span>
		</tree>
		<tree nodeKey="id" ref="tree2" :list="rules">
			<span class="custom-tree-node" slot-scope="{ node, data }">
				<span>{{ data.name }}</span>
				<span>
					<el-button type="text" size="mini" @click.stop="() => append(node, data)">
						Append
					</el-button>
					<el-button type="text" size="mini" @click.stop="() => remove(node, data)">
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
	public allowDrop: boolean = true;
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
	public rules: any[] = [];
	public onClickTest() {
		console.log("this.data", this.data);
		console.log("this.treeManage", (this.$refs.tree as any).treeManage);
		console.log("this.treeManage1", (this.$refs.tree1 as any).treeManage);
	}
	// 增
	public append(node, data) {
		console.log("append")
		let newChild = { data: { label: 'testtest', children: [] } };
		node.insertChild(newChild);
	}
	// 删
	public remove(node, data) {
		console.log("remove", node, data);
		node.parent.removeChild(node);
	}
	public nodeClick(node, data) {
		console.log("nodeClick", node, data);
	}

	public onCreated() {
		let data = [
			{
				"name": "目录01",   // 文件或目录名称
				"type": 2,   // 映射规则节点类型, 1: 文件, 2: 目录
				"required": true,  // 是否必备, 此字段对目录类型的节点无意义，可不填
				"mappingType": 1,   //  映射类型，1: 普通映射, 2: 合并映射, 此字段对目录类型的节点无意义，可不填
				"children": [   // 子节点, 此字段对文件类型的节点无意义，可不填
					{
						"name": "XX合同",  // 映射后的文件名，占位符格式: {{合同号}}, {{原告}}, {{被告}}, 合并映射不支持占位符
						"type": 1,   // 文件
						"required": true,  // 是否必备
						"mappingType": 1,   //  映射类型，1: 普通映射, 2: 合并映射 
						"sources": [  // 对于 mappingType 为 1 的节点来说此数组型字段有且只有一个元素
							{
								"originalName": "合同ABC",
								"required": true,  // 是否必备, 对于 mappingType 为 1 的节点来说此字段的值无所谓
								"pageNoRequired": false // 是否需要页码，对于 mappingType 为 1 的节点来说此字段的值无所谓
							}
						]
					},
					{
						"name": "XX合同",
						"type": 1,   // 文件
						"required": true,  // 是否必备
						"mappingType": 1,   //  映射类型，1: 普通映射, 2: 合并映射 
						"sources": [  // 对于 mappingType 为 1 的节点来说此数组型字段有且只有一个元素
							{
								"originalName": "合同ABC",
								"required": true,  // 是否必备, 对于 mappingType 为 1 的节点来说此字段的值无所谓
								"pageNoRequired": false // 对于 mappingType 为 1 的节点来说此字段的值无所谓
							}
						]
					},
					{
						"name": "XX合同",
						"type": 1,   // 文件
						"required": true,
						"mappingType": 2,
						"sources": [
							{
								"originalName": "合同1",
								"pageNoRequired": false
							},
							{
								"originalName": "合同2",
								"required": true,
								"pageNoRequired": true
							},
							{
								"originalName": "合同1",
								"required": true,
								"pageNoRequired": true
							}
						]
					},
				]
			},
			{
				"name": "目录02",
				"type": 2,   // 目录
				"children": [
					{
						"name": "XX合同",
						"type": 1,   // 文件
						"required": true,
						"mappingType": 2,
						"sources": [
							{
								"originalName": "合同1",
								"pageNoRequired": false
							},
							{
								"originalName": "合同2",
								"required": true,
								"pageNoRequired": true
							},
							{
								"originalName": "合同1",
								"required": true,
								"pageNoRequired": true
							}
						]
					},
				]
			}

		];
		function getData(data) {
			data.forEach((item) => {
				if (item.type === 2) {
					item.iconClass = 'el-icon-folder';
				} else {
					item.iconClass = 'el-icon-document';
				}

				if (item.children && item.children.length > 0) {
					getData(item.children);
				}
			})
		}

		getData(data);

    this.rules = data;
	}

}
</script>

<style lang="scss">
</style>