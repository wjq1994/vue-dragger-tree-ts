<template>
  <div>
      <tree nodeKey="id" ref='tree' :list='data'></tree>
      <eltree node-key="id" :data="data" :props="defaultProps" ></eltree>
  </div>
</template>

<script lang='ts'>
import BaseVue from '@/components/base/BaseVue';
// @ts-ignore
import tree from '../components/tree/tree.vue';
import mytree from '../components/mytree/tree.vue';
import eltree from '../components/eltree/tree.vue';

import { Component } from 'vue-property-decorator';

@Component({ name: 'index', components: { tree, mytree, eltree } })
export default class Index extends BaseVue {
    public defaultProps: any = {
          children: 'children',
          label: 'label'
    };
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
    public data1: any = [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1',
            }],
          }],
        }];
    public data0: any = [{
          label: '一级 1',
          children: [],
        }]; 
        
}
</script>

<style>

</style>