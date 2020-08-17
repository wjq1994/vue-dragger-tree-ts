import { Component, Vue } from "vue-property-decorator";
import LifeCycleImpl from './LifeCycleImpl';


const TAG = "LifeCycleVue";

@Component
export default class LifeCycleVue extends Vue implements LifeCycleImpl {
    /**
     * 组件被激活时调用，在组件第一次渲染时也会被调用，之后每次keep-alive激活时被调用
     * created-> mounted-> activated
     */
    private activated() {
        this.onActivated();
    }

    /**
     * 在组件被停用时调用
     */
    private deactivated() {
        this.onDeactivated();
    }

    private created() {
        this.onCreated();
    }

    private beforeMount() {
        this.onBeforeMount();
    }

    private mounted() {
        this.onMounted();
    }

    private updated() {
        this.onUpdated();
    }

    private beforeUpdate() {
        this.onBeforeUpdate();
    }

    private beforeDestroy() {
        this.onBeforeDestroy();
    }

    private destroyed() {
        this.onDestroyed();
    }

    public onCreated(): void {
    }

    public onBeforeDestroy(): void {
    }

    public onBeforeMount(): void {
    }

    public onBeforeUpdate(): void {
    }

    public onDestroyed(): void {
    }

    public onMounted(): void {
    }

    public onUpdated(): void {
    }

    public onActivated(): void {

    }

    public onDeactivated(): void {

    }

    onBeforeCreate(): void {
    }
}
