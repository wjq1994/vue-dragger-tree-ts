let data = [
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
    {
        label: "一级 2",
        children: [
            {
                label: "二级 2-1",
                children: [
                    {
                        label: "三级 2-1-1",
                    },
                ],
            },
            {
                label: "二级 2-2",
                children: [
                    {
                        label: "三级 2-2-1",
                    },
                ],
            },
        ],
    },
    {
        label: "一级 3",
        children: [
            {
                label: "二级 3-1",
                children: [
                    {
                        label: "三级 3-1-1",
                    },
                ],
            },
            {
                label: "二级 3-2",
                children: [
                    {
                        label: "三级 3-2-1",
                    },
                ],
            },
        ],
    },
];

function getData(data, level) {
    level++;
    data.forEach((item) => {
        if (level % 2 > 0) {
            item.iconClass = 'el-icon-folder';
        } else {
            item.iconClass = 'el-icon-document';
        }
        
        if (item.children && item.children.length > 0) {
            getData(item.children, level);
        }
    })
}

getData(data, 0);

console.log(JSON.stringify(data));
