import React, { useState, useRef } from "react";
import { Button, Popconfirm, message, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { history } from "umi";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { getDatas, deleteData } from "@/services/department";
import ProTable from "@ant-design/pro-table";
import FormModal from "./components/formModal";

const status = ["停用", "启用"];
const statusObj = { enable: 1, disable: 0 };

const Index = (props) => {
  const { id } = props.match.params;
  const [total, setTotal] = useState(0);
  const ref = useRef();
  const formModal = useRef();
  // 确认删除
  const confirmDelete = async (item_id) => {
    const result = await deleteData(item_id);
    console.log(result);
    if (result.code === 1) {
      ref.current.reload();
      message.success(result.msg);
    } else {
      message.error(result.msg);
    }
  };
  // 批量删除
  const handleBatch = async (selectedRowKeys) => {};
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
      key: "id",
      hideInSearch: true,
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "描述",
      dataIndex: "remark",
      key: "remark",
      hideInSearch: true,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      initialValue: "all",
      order: "5",
      valueEnum: {
        all: {
          text: "全部",
          status: "Default",
        },
        enable: {
          text: "启用",
          status: "Success",
        },
        disable: {
          text: "禁用",
          status: "Default",
        },
      },
    },
    {
      title: "操作",
      width: 180,
      dataIndex: "option",
      valueType: "option",
      render: (_, item) => (
        <>
          <a
            onClick={() => {
              formModal.current.open(item.id);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="您确定删除吗?"
            okText="确认"
            cancelText="取消"
            onConfirm={() => confirmDelete(item.id)}
            placement="topRight"
          >
            <a style={{ color: "#ff4d4f" }}>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];
  const getData = async (params) => {
    const tempParams = params;
    tempParams.status = statusObj[params.status];
    let data = [];
    const result = await getDatas(params);
    if (result.code === 1) {
      data = result.data.data;
      data.map((v) => {
        const temp = v;
        temp.status = status[v.status];
        return temp;
      });
      setTotal(result.total);
    }

    return { data };
  };

  const onFormOk = (result) => {
    ref.current.reload();
  };

  return (
    <PageHeaderWrapper>
      <FormModal ref={formModal} formOk={onFormOk} />
      <ProTable
        columns={columns}
        rowKey="id"
        pagination={{ total: total, current: 1, pageSize: 10 }}
        rowSelection={{}}
        headerTitle=""
        request={getData}
        actionRef={ref}
        toolBarRender={(_, { selectedRowKeys }) => [
          <Button type="primary" onClick={() => formModal.current.open()}>
            <PlusOutlined /> 新建
          </Button>,
          selectedRowKeys && selectedRowKeys.length && (
            <Popconfirm
              title="您确定全部删除吗?"
              okText="确认"
              cancelText="取消"
              onConfirm={() => {
                handleBatch(selectedRowKeys);
              }}
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
