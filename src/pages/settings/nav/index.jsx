import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Tag, Divider } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';

const Nav = () => {
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 50,
            key: 'id',
            hideInSearch: true,
        },
        {
            title: '导航名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '主导航',
            dataIndex: 'main',
            width: 80,
            hideInSearch: true,
            key: 'main',
            render: (main) => main && <Tag color="#2db7f5">是</Tag>,
        },
        {
            title: '描述',
            dataIndex: 'desc',
            key: 'desc',
            hideInSearch: true,
        },
        {
            title: '操作',
            width: 100,
            dataIndex: 'option',
            valueType: 'option',
            render: () => (
                <>
                    <a>菜单管理</a>
                    <Divider type="vertical" />
                    <a>编辑</a>
                    <Divider type="vertical" />
                    <a>删除</a>
                </>
            ),
        },
    ];

    return (
        <PageHeaderWrapper>
            <ProTable
                columns={columns}
                rowKey="key"
                headerTitle="导航栏列表"
                toolBarRender={() => [
                    <Button type="primary">
                        <PlusOutlined /> 新建
                    </Button>,
                ]}
            />
        </PageHeaderWrapper>
    );
};

export default Nav;
