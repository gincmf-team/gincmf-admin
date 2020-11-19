import React, { useState, useRef } from 'react';
import { Link, history } from 'umi';
import { Button, Divider, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getRoles } from '@/services/role';
import ProTable from '@ant-design/pro-table';
import '@/assets/css/style.css';

const Index = () => {
    const [total, setTotal] = useState(0);
    const ref = useRef();

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 50,
            key: 'id',
            search: false,
        },
        {
            title: '角色名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '角色描述',
            dataIndex: 'remark',
            key: 'remark',
            search: false,
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            initialValue: 'all',
            order: '5',
            valueEnum: {
                all: {
                    text: '全部',
                    status: 'Default',
                },
                enable: {
                    text: '启用',
                    status: 'Success',
                },
                disable: {
                    text: '禁用',
                    status: 'Default',
                },
            },
        },
        {
            title: '操作',
            width: 180,
            dataIndex: 'option',
            valueType: 'option',
            render: (_, item) =>
                item.id === 1 ? (
                    <>
                        <a href="#!" disabled>
                            编辑
                        </a>
                        <Divider type="vertical" />
                        <a href="#!" disabled>
                            删除
                        </a>
                    </>
                ) : (
                    <>
                        <Link to={{ pathname: `/user_manage/authorize/edit/${item.id}` }}>
                            编辑
                        </Link>
                        <Divider type="vertical" />
                        <Popconfirm
                            title="您确定删除吗?"
                            okText="确认"
                            cancelText="取消"
                            // onConfirm={() => confirmDelete(item.id)}
                            placement="topRight"
                        >
                            <a style={{ color: '#ff4d4f' }}>删除</a>
                        </Popconfirm>
                    </>
                ),
        },
    ];

    // 获取列表
    const getData = async (params) => {
        const values = { ...params };
        const statusAlias = ['disable', 'enable'];
        const statusParams = { disable: 0, enable: 1 };
        values.status = statusParams[values.status];

        const result = await getRoles(values);
        let temp = [];
        if (result.code === 1) {
            temp = result.data.data;

            temp.forEach((v, i) => {
                temp[i].status = statusAlias[v.status];
            });
            setTotal(result.data.total);
        }
        return { data: temp };
    };

    return (
        <PageHeaderWrapper>
            <ProTable
                columns={columns}
                rowKey="id"
                pagination={{ total, pageSize: 10 }}
                headerTitle={`图文列表(${total}条)`}
                request={getData}
                actionRef={ref}
                toolBarRender={(_, { selectedRowKeys }) => [
                    <Button
                        key="button"
                        type="primary"
                        onClick={() => {
                            history.push('/user_manage/authorize/add');
                        }}
                    >
                        <PlusOutlined /> 新建
                    </Button>,
                    selectedRowKeys && selectedRowKeys.length && (
                        <Popconfirm
                            title="您确定全部删除吗?"
                            okText="确认"
                            cancelText="取消"
                            // onConfirm={() => {
                            //   handleBatch(selectedRowKeys);
                            // }}
                            placement="topRight"
                        >
                            <Button danger>批量删除</Button>
                        </Popconfirm>
                    ),
                ]}
            />
        </PageHeaderWrapper>
    );
};

export default Index;
