import React, { Component } from 'react';
import { Button, List, Space, Image, Grid, NavBar, Input, Rate, Switch } from 'antd-mobile';
import { Layout, DatePicker, Tag, Menu, Breadcrumb, Form } from 'antd';

import Sortable from 'react-sortablejs';
import uniqueId from 'lodash/uniqueId';
import update from 'immutability-helper'
import { indexToArray, getItem, setInfo, isPath, getCloneItem, itemRemove, itemAdd } from './utils';
import _ from 'lodash';
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
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
            color: 'primary',
            size: 'middle',
            value: '第一个',
            style: {
                height: 200,
            }
        }
    },
    {
        name: 'Switch',
        attr: {
            style: {
                height: 90,
            }

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
            style: {
                width: 200,
                height: 200,
            }
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
            columns: 2,
            gap: 10,
            style: {
                border: '1px solid red'
            }
        },
    },
    {
        name: 'NavBar',
        value: '导航栏标题',
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
        let initData = [{
            name: 'Input',
            attr: {
                size: 'large',
                value: '第一个'
            }
        }];
        let cacheData = localStorage.getItem('cache');
        console.log("cacheData =" +cacheData);
        this.state = {
            Data: cacheData ? JSON.parse(cacheData)  : initData,
            // Data: [{
            //     name: 'Input',
            //     attr: {
            //         size: 'large',
            //         value: '第一个'
            //     }
            // }],
            showAttrPanel: false,
            showPreView: false,
            selectComponent: null,
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
                return <div data-id={indexs} onClick={() => showAttr(item)}><ComponentInfo {...item.attr}  >{item.value}</ComponentInfo></div>
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


        const _this = this;
        function showAttr(component) {
            console.log("showAttr click : " + component.name);
            _this.setState({
                selectComponent: component,
                showAttrPanel: !_this.state.showAttrPanel,
            })
        }

        function showPreView() {
            _this.setState({
                showPreView: !_this.state.showPreView
            })
        }
        function updateContent(value) {
            if (_this.state.selectComponent) {
                _this.state.selectComponent.value = value;
                _this.setState({
                    selectComponent: _this.state.selectComponent
                })
            }
        }
        function updateWidth(value) {
            if (_this.state.selectComponent) {
                console.log('updateHeight = ' + value)
                _this.state.selectComponent.attr.style.width = value;
                localStorage.setItem('cache', JSON.stringify(_this.state.Data));
                _this.setState({
                    selectComponent: _this.state.selectComponent
                })
                _this.setState({ Data:_this.state.Data })
            }
        }
        function updateHeight(value) {
            if (_this.state.selectComponent) {
                console.log('updateHeight = ' + value)
                _this.state.selectComponent.attr.style.height = value;
                localStorage.setItem('cache', JSON.stringify(_this.state.Data));
                _this.setState({
                    selectComponent: _this.state.selectComponent
                })
            }
        }
        function updateImageSrc(value) {
            if (_this.state.selectComponent) {
                _this.state.selectComponent.attr.src = value;
                _this.setState({
                    selectComponent: _this.state.selectComponent
                })
            }
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
                <Layout  >

                    {/* <Sider width={150}>
                        <Header>Header</Header>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            <Menu.Item key="1"  >
                                新建页面
                            </Menu.Item>
                            <SubMenu key="sub1" title="subnav 1">
                               
                            </SubMenu>
                            <SubMenu key="sub2" title="subnav 2">
                                <Menu.Item key="5">option5</Menu.Item>
                                <Menu.Item key="6">option6</Menu.Item>
                                <Menu.Item key="7">option7</Menu.Item>
                                <Menu.Item key="8">option8</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider> */}
                    <Layout  >
                        <Header>
                            <Button onClick={() => showPreView(this.state.Data)}>预览</Button>
                            <Button onClick={() => saveJson(this.state.Data)}>保存</Button>
                        </Header>
                        <Layout>
                            <Sider >
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
                                </Sortable></Sider>
                            <Content>
                                <h2>编辑区间</h2>
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
                                </Sortable></Content>

                            {this.state.showAttrPanel ? <Sider><h2>属性</h2>

                                <Form style={{ backgroundColor: '#FFFFFF' }}
                                    layout="vertical">
                                    <Form.Item label='宽'>
                                        <Input onChange={(value) => { updateWidth(value) }}></Input>
                                    </Form.Item>
                                    <Form.Item label='高'>
                                        <Input onChange={(value) => { updateHeight(value) }}></Input>
                                    </Form.Item>
                                    <Form.Item label='内容'>
                                        <Input onChange={(value) => { updateContent(value) }}></Input>
                                    </Form.Item>
                                    <Form.Item label='图片链接'>
                                        <Input onChange={(value) => { updateImageSrc(value) }}></Input>
                                    </Form.Item>
                                </Form>

                            </Sider>
                                : null}

                        </Layout>


                    </Layout>

                    {this.state.showPreView ? <Layout  >
                        <h2>预览</h2>
                        {loopPreView(this.state.Data, '')}
                    </Layout>
                        : null}

                </Layout>



            </>
        );
    }
}

export default EditPage;
