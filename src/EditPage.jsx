import React, { Component } from 'react';
import { Button, List, Space, Image, Grid, NavBar, Input, Rate, Switch } from 'antd-mobile';
import { DatePicker, Tag } from 'antd';
import Sortable from 'react-sortablejs';
import uniqueId from 'lodash/uniqueId';
import update from 'immutability-helper'
import { indexToArray, getItem, setInfo, isPath, getCloneItem, itemRemove, itemAdd } from './utils';
import _ from 'lodash';

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const GlobalComponent = {
    Button, List, Space, Image, Grid, NavBar, Input, Rate, Switch,
    MonthPicker,
    RangePicker,
    WeekPicker,
}


const soundData = [
    {
        name: 'Button',
        value: '第一个',
        attr: {
            color:'primary',
            size: 'middle',
            value: '第一个',
        }
    },
    {
        name: 'Switch',
        attr: {
            size: 'large',
        }
    },
    {
        name: 'Rate',
        attr: {
            size: 'large',
            value: 2,
        }
    },
    {
        name: 'Space',
        attr: {}
    },
    {
        name: 'Image',
        attr: {
            width: 100,
            height: 100,
            src: 'https://img2.baidu.com/it/u=1685092271,2574681286&fm=253&fmt=auto&app=120&f=JPEG?w=1200&h=797',
        }
    },
    {
        name: 'Input',
        attr: {
            size: 'large',
            value: '第一个'
        }
    },
    {
        name: 'List',
        attr: {
            style: {
                border: '1px solid red'
            }
        }
    },
    {
        name: 'Grid',
        attr: {
            style: {
                border: '1px solid red'
            }
        }
    },
    {
        name: 'NavBar',
        attr: {}
    },

    //
    {
        name: 'MonthPicker',
        attr: {}
    },
    {
        name: 'RangePicker',
        attr: {}
    },
    {
        name: 'WeekPicker',
        attr: {}
    },

    {
        name: 'Containers',
        attr: {
            style: {
                border: '1px solid red'
            }
        },
    }
]


class EditPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Data: [{
                name: 'Input',
                attr: {
                    size: 'large',
                    value: '第一个'
                }
            }],
        };
    }

    // 拖拽的添加方法
    sortableAdd = evt => {
        // 组件名或路径
        const nameOrIndex = evt.clone.getAttribute('data-id');
        // 父节点路径
        const parentPath = evt.path[1].getAttribute('data-id');
        // 拖拽元素的目标路径
        const { newIndex } = evt;
        // 新路径 为根节点时直接使用index
        const newPath = parentPath ? `${parentPath}-${newIndex}` : newIndex;
        // 判断是否为路径 路径执行移动，非路径为新增
        if (isPath(nameOrIndex)) {
            // 旧的路径index
            const oldIndex = nameOrIndex;
            // 克隆要移动的元素
            const dragItem = getCloneItem(oldIndex, this.state.Data)
            // 比较路径的上下位置 先执行靠下的数据 再执行考上数据
            if (indexToArray(oldIndex) > indexToArray(newPath)) {
                // 删除元素 获得新数据
                let newTreeData = itemRemove(oldIndex, this.state.Data);
                // 添加拖拽元素
                newTreeData = itemAdd(newPath, newTreeData, dragItem)
                // 更新视图
                this.setState({ Data: newTreeData })
                return
            }
            // 添加拖拽元素
            let newData = itemAdd(newPath, this.state.Data, dragItem)
            // 删除元素 获得新数据
            newData = itemRemove(oldIndex, newData);

            this.setState({ Data: newData })
            return
        }

        // 新增流程 创建元素 => 插入元素 => 更新视图
        const id = nameOrIndex

        const newItem = _.cloneDeep(soundData.find(item => (item.name === id)))

        // 为容器或者弹框时增加子元素
        if (newItem.name === 'Containers') {
            const ComponentsInfo = _.cloneDeep(GlobalComponent[newItem.name])
            // 判断是否包含默认数据
            newItem.children = []
        }

        let Data = itemAdd(newPath, this.state.Data, newItem)

        this.setState({ Data })
    }

    // 拖拽的排序方法
    sortableUpdate = evt => {
        // 交换数组
        const { newIndex, oldIndex } = evt;

        // 父节点路径
        const parentPath = evt.path[1].getAttribute('data-id');

        // 父元素 根节点时直接调用data
        let parent = parentPath ? getItem(parentPath, this.state.Data) : this.state.Data;
        // 当前拖拽元素
        const dragItem = parent[oldIndex];
        // 更新后的父节点
        parent = update(parent, {
            $splice: [[oldIndex, 1], [newIndex, 0, dragItem]],
        });

        // 最新的数据 根节点时直接调用data
        const Data = parentPath ? setInfo(parentPath, this.state.Data, parent) : parent
        // 调用父组件更新方法
        this.setState({ Data })

    }

    render() {

        // 递归函数
        const loop = (arr, index) => (
            arr.map((item, i) => {
                const indexs = index === '' ? String(i) : `${index}-${i}`;
                if (item.children) {
                    return <div {...item.attr}
                        data-id={indexs}
                    >
                        <Sortable
                            key={uniqueId()}
                            style={{
                                minHeight: 100,
                                margin: 10,
                            }}
                            ref={c => c && (this.sortable = c.sortable)}
                            options={{
                                ...sortableOption,
                                onUpdate: evt => (this.sortableUpdate(evt)),
                                onAdd: evt => (this.sortableAdd(evt)),
                            }}
                        >
                            {loop(item.children, indexs)}
                        </Sortable>
                    </div>
                }
                const ComponentInfo = GlobalComponent[item.name]
                return <div data-id={indexs}><ComponentInfo {...item.attr} >{item.value}</ComponentInfo></div>
            })
        )
        // 递归函数
        const loopPreView = (arr, index) => (
            arr.map((item, i) => {
                const indexs = index === '' ? String(i) : `${index}-${i}`;
                if (item.children) {
                    return <div {...item.attr}
                        data-id={indexs}
                    >

                        {loopPreView(item.children, indexs)}
                    </div>
                }
                const ComponentInfo = GlobalComponent[item.name]
                return <div data-id={indexs}><ComponentInfo {...item.attr} >{item.value}</ComponentInfo></div>
            })
        )
        const sortableOption = {
            animation: 150,
            fallbackOnBody: true,
            swapThreshold: 0.65,
            group: {
                name: 'formItem',
                pull: true,
                put: true,
            },
        }

        function exportDom() {
            console.log('ssss' + document.documentElement)
        }
        function saveJson(data) {
            var content = JSON.stringify(data);
            console.log('保存的数据：' + content)

            var content = JSON.stringify(data);
            var eleLink = document.createElement('a');
            eleLink.download = "save.json";
            eleLink.style.display = 'none';
            // 字符内容转变成blob地址
            var blob = new Blob([content]);
            eleLink.href = URL.createObjectURL(blob);
            // 触发点击
            document.body.appendChild(eleLink);
            eleLink.click();
            // 然后移除
            document.body.removeChild(eleLink);

        }




        return (
            <>
                <h2>组件列表</h2>
                <Sortable
                    options={{
                        group: {
                            name: 'formItem',
                            pull: 'clone',
                            put: false,
                        },
                        sort: false,
                    }}
                >
                    {
                        soundData.map(item => {
                            return <div data-id={item.name}><Tag>{item.name}</Tag></div>
                        })
                    }
                </Sortable>
                <h2>容器</h2>
                <Sortable
                    ref={c => c && (this.sortable = c.sortable)}
                    options={{
                        ...sortableOption,
                        onUpdate: evt => (this.sortableUpdate(evt)),
                        onAdd: evt => (this.sortableAdd(evt)),
                    }}
                    key={uniqueId()}
                >
                    {loop(this.state.Data, '')}
                </Sortable>
                <h2>预览</h2>
                {loopPreView(this.state.Data, '')}
                <Button onClick={() => saveJson(this.state.Data)}>保存</Button>
            </>
        );
    }
}

export default EditPage;
