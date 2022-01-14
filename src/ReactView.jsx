import React, { Component } from 'react';
import { Button, List, Space, Image, Grid, NavBar, Input, Rate, Switch,} from 'antd-mobile';
import { DatePicker, Tag } from 'antd';
import _ from 'lodash';
// import jsonData from "./save.json";
import axios from 'axios';

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
        attr: {}
    },
    {
        name: 'Switch',
        attr: {
            size: 'large',
        }
    },
    {
        name: 'Rate',
        attr: {}
    },

    {
        name: 'Space',
        attr: {}
    },
    {
        name: 'Image',
        attr: {}
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

class ReactView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            jsonData: [{
                name: 'Input',
                attr: {
                    size: 'large',
                    value: '第一个'
                }
            }],
        };
        const _this = this;
        let url = "http://127.0.0.1:8080/getJson";
        axios.get(url)
            .then(function (response) {
                var res = response.data
                console.log(res);
                _this.setState({ jsonData: res });
            })
            .catch(function (error) {
                console.log(error);
            });

    }



    render() {
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

        return (
            <>
                {loopPreView(this.state.jsonData, '')}
            </>
        );
    }
}

export default ReactView;
