import React from 'react';
import { Link, history } from 'umi';
import { Button, Divider, Popconfirm, message, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { getDatas } from '@/services/user';

const { Text } = Typography;

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 100,
        search: false,
    },
    {
        title: '用户名',
        dataIndex: 'user_login',
    },
    {
        title: '邮箱',
        dataIndex: 'user_email',
    },
    {
        title: '最后登录IP',
        dataIndex: 'last_loginip',
        search: false,
    },
    {
        title: '最后登录时间',
        dataIndex: 'last_login_time',
        search: false,
        render: (text) => {
            if (text === '0') {
                return '-';
            }
            return text;
        },
    },
    {
        title: '创建时间',
        key: 'create_time',
        search: true,
        width: 200,
        dataIndex: 'create_time',
        valueType: 'dateTime',
    },
    {
        title: '操作',
        valueType: 'option',
        dataIndex: 'option',
        width: 110,
        render: (text, record, index) => {
            if (index === 0) {
                return (
                    <>
                        <Text disabled>编辑</Text>
                        <Divider type="vertical" />
                        <Text disabled>删除</Text>
                        {/* <Divider type="vertical" />
            <Text disabled>拉黑</Text> */}
                    </>
                );
            }

            return (
                <>
                    <Link disbaled="true" to={`/user_manage/admin_user/edit/${record.id}`}>
                        编辑
                    </Link>
                    <Divider type="vertical" />
                    <Popconfirm
                        title="您确定删除吗?"
                        okText="确认"
                        cancelText="取消"
                        onConfirm={() => {}}
                        placement="topRight"
                    >
                        <a style={{ color: '#ff4d4f' }}>删除</a>
                    </Popconfirm>
                    {/* <Divider type="vertical" />
          <Popconfirm
            title="您确定拉黑吗?"
            okText="确认"
            cancelText="取消"
            onConfirm={() => { }}
            placement="topRight"
          >
            <a style={{ color: '#2C3E50' }}>拉黑</a>
          </Popconfirm> */}
                </>
            );
        },
    },
];

const request = async (params) => {
    const result = await getDatas(params);
    let data = [];
    if (result.code === 1) {
        data = result.data.data;
    } else {
        message.error(result.msg);
    }
    return { data };
};

const Index = () => {
    return (
        <PageHeaderWrapper>
            <ProTable
                columns={columns}
                rowKey="id"
                request={request}
                dateFormatter="string"
                headerTitle="批量操作"
                toolBarRender={() => [
                    <Button
                        key="3"
                        type="primary"
                        onClick={() => {
                            history.push('/user_manage/admin_user/add');
                        }}
                    >
                        <PlusOutlined />
                        新建
                    </Button>,
                ]}
            />
        </PageHeaderWrapper>
    );
};

export default Index;
