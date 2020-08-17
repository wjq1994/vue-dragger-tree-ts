/**
 * Vue 生命周期钩子，实现此接口用于获得声明周期的能力
 */
export default interface LifeCycleImpl {

    onBeforeCreate(): void;

    onCreated(): void

    onBeforeMount(): void

    onMounted(): void

    onBeforeUpdate(): void

    onUpdated(): void

    onBeforeDestroy(): void

    /**
     * 组件销毁时执行
     */
    onDestroyed(): void

    /**
     * 使用<keep-alive>标签包裹时会被调用
     * 当组件激活时调用
     */
    onActivated(): void

    /**
     * 使用<keep-alive>标签包裹的布局
     * 当组件隐藏时调用
     */
    onDeactivated(): void
}
