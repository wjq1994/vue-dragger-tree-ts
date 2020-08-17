<template>
  <div>
      <tree ref='tree' :list='data'></tree>
  </div>
</template>

<script lang='ts'>
import BaseVue from '@/components/base/BaseVue';
// @ts-ignore
import tree from '../components/tree/tree.vue';
import { Component } from 'vue-property-decorator';

@Component({ name: 'index', components: { tree } })
export default class Index extends BaseVue {
    public data: any = [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1',
            }],
          }],
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1',
            }],
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1',
            }],
          }],
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1',
            }],
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1',
            }],
          }],
        }];
}
</script>

<style>

</style>