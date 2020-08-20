import {r} from './dom'



function cached(fn) {
  const cache = Object.create(null);
  return function cachedFn(str) {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

const regex = /-(\w)/g;
const camelize = cached(str =>
  str.replace(regex, (_, c) => (c ? c.toUpperCase() : ""))
);

function removeNode(node) {
  if (node.parentElement !== null) {
    node.parentElement.removeChild(node);
  }
}

function insertNodeAt(fatherNode, node, position) {
  const refNode =
    position === 0
      ? fatherNode.children[0]
      : fatherNode.children[position - 1].nextSibling;
  fatherNode.insertBefore(node, refNode);
}

const findNearestComponent = (element, componentName) => {
  let target = element;
  while (target && target.tagName !== 'BODY') {
    if (target.__vue__ && target.__vue__.$options.name === componentName) {
      return target.__vue__;
    }
    target = target.parentNode;
  }
  return null;
};

const arrayFindIndex = function(arr, pred) {
  for (let i = 0; i !== arr.length; ++i) {
    if (pred(arr[i])) {
      return i;
    }
  }
  return -1;
};

const spliceList = function(oriData, newIndex, index, ele) {
  // 更新节点绑定数据
  if (ele) {
    oriData.splice(newIndex, index, ele);
  } else {
    oriData.splice(newIndex, index);
  }
}

export { insertNodeAt, camelize, findNearestComponent, removeNode, arrayFindIndex, spliceList };
