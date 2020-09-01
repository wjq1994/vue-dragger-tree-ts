<script lang="tsx">
import BaseVue from "@/components/base/BaseVue";
import {
    Component,
    Prop
} from "vue-property-decorator";

@Component({
    name: "NodeContent",
    components: {},
})
export default class NodeContent extends BaseVue {
    // 树列表
    @Prop({
        required: false,
        type: Object,
        default: null
    })
    public node ? : any;

    render(h: any) {
        const parent: any = this.$parent;
        const tree = parent.tree;
        const node = this.node;
        const {
            data,
            store
        } = node;
        return parent.renderContent ? (
            parent.renderContent.call(parent._renderProxy, h, {
                _self: tree.$vnode.context,
                node,
                data,
                store,
            })
        ) : tree.$scopedSlots.default ? (
            tree.$scopedSlots.default({
                node,
                data
            })
        ) : ( 
          <span class = "el-tree-node__label" > 暂无信息 </span>
        );
    }
}
</script>
