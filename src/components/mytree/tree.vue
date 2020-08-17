<template>
  <div class="tree">
    <TreeNode :node="root" :list="root.childNodes" ></TreeNode>
  </div>
</template>

<script>
import TreeNode from "./tree-node";
import TreeStore from "../mytree/model/tree-store";

export default {
  name: "Tree",
  components: {
    TreeNode
  },
  data() {
    return {
      root: null
    };
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
    props: {
      default() {
        return {
          children: "children",
          label: "label",
          disabled: "disabled"
        };
      }
    }
  },

  computed: {
    // this.value when input = v-model
    // this.list  when input != v-model
    realValue() {
      return this.value ? this.value : this.list;
    }
  },

  methods: {
    getList() {
      console.log(this.root);
    }
  },

  created() {
    this.tree = true;
    this.store = new TreeStore({
      key: this.nodeKey,
      data: this.list,
      lazy: this.lazy,
      props: this.props,
      load: this.load,
      currentNodeKey: this.currentNodeKey,
      checkStrictly: this.checkStrictly,
      checkDescendants: this.checkDescendants,
      defaultCheckedKeys: this.defaultCheckedKeys,
      defaultExpandedKeys: this.defaultExpandedKeys,
      autoExpandParent: this.autoExpandParent,
      defaultExpandAll: this.defaultExpandAll,
      filterNodeMethod: this.filterNodeMethod
    });
    this.root = this.store.root;

    console.log("this.rootXXXXXXXXXXXXX: ", this.root);
  },

  mounted() {},

  updated() {}
};
</script>
