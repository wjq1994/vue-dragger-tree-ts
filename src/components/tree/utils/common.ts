import { Node } from "@/components/tree/model/Node"

/** 每次新增数据都要将原始数据构造成tree要的形式 */
export const getRules = (data: any) => {
    if (!Array.isArray(data)) {
      data = [data];
    }

    data.forEach((item: any) => {
      if (String(item.nodeType) === "2") {
        item.iconClass = 'el-icon-folder';
      } else {
        item.iconClass = 'el-icon-document';
      }
  
      if (item.children && item.children.length > 0) {
        getRules(item.children);
      }
    })
    return data;
}

/** 每次返回给后台要处理接口要的形式 */
export const returnServiceRules = (data: any) => {
  if (!Array.isArray(data)) {
    data = [data];
  }
  data.forEach((item: any) => {
    delete item.iconClass
    if (item.children && item.children.length > 0) {
      getRules(item.children);
    }

  })
  return data;
}

/** 增 */
export const append = (node: Node, data: any) => {
  let newChild = { data };
  node.insertChild(newChild);
}

/** 删 */
export const remove = (node: Node) => {
  node.parent!.removeChild(node);
}
