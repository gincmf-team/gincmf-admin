import React, { useState, useEffect } from "react";
import { PageHeader, Button, List, Card, Upload, message } from "antd";
import { getAssets, deleteAssets } from "@/services/assets";
import ModalImages from "@/pages/utils/modal/assets/components/preview/images";
import { DeleteOutlined } from "@ant-design/icons";
import "@/assets/css/style.css";

const Index = () => {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  // 分页current
  const [pageCurrent, setPageCurrent] = useState(1);

  // 获取资源数据列表
  const getData = async (params) => {
    const temp = { ...params, type: 0 };
    const result = await getAssets(temp);
    let paginationData = [];
    if (result.code === 1) {
      setIndex(0);
      paginationData = result.data.data;
      setTotal(result.data.total);
      let tempData = [];
      paginationData.forEach((element) => {
        tempData = [
          ...tempData,
          {
            id: element.id,
            file_name: element.file_name,
            file_path: element.file_path,
            prev_path: element.prev_path,
            remark_name: element.remark_name,
          },
        ];
      });
      setData(tempData);
    }
    return { data: paginationData };
  };

  useEffect(() => {
    getData({ current: pageCurrent });
  }, [pageCurrent]);

  let token = localStorage.getItem("token");
  if (token) {
    token = JSON.parse(token);
  }
  const uploadProps = {
    name: "file[]",
    multiple: true,
    action: "/api/admin/assets",
    data: { type: 0 },
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
    onChange(info) {
      window.console.log(info);
      if (info.file.status === "done") {
        getData([]);
      }
    },
  };

  // 删除单项
  const deleteItem = async (e, id) => {
    e.stopPropagation();
    const result = await deleteAssets(id);
    if (result.code === 1) {
      getData([]);
      message.success(result.msg);
    } else {
      message.error(result.msg);
    }
  };

  // 首次加载读取数据
  useEffect(() => {
    getData([]);
  }, []);

  const openPreview = (i) => {
    setVisible(true);
    setIndex(i);
  };

  return (
    <>
      <ModalImages
        data={data}
        index={index}
        visible={visible}
        setVisible={setVisible}
      />
      <PageHeader
        style={{ padding: 0 }}
        title={`图片（共${total}条）`}
        extra={[
          <Upload key="upload" {...uploadProps}>
            <Button type="primary">上传</Button>
          </Upload>,
        ]}
      >
        <List
          grid={{ gutter: 16, column: 5, xs: 2, sm: 4, md: 4, lg: 6 }}
          dataSource={data}
          pagination={{
            position: "bottom",
            current: pageCurrent,
            total,
            onChange: (page) => {
              setPageCurrent(page);
              window.console.log(page);
            },
            pageSize: 10,
          }}
          renderItem={(item, itemIndex) => (
            <List.Item>
              <Card
                onClick={() => openPreview(itemIndex)}
                cover={<img alt={item.file_name} src={item.prev_path} />}
                className="assets-thumbnail"
                hoverable="true"
              >
                <div className="title">{item.remark_name}</div>
                <div
                  onClick={(e) => {
                    deleteItem(e, item.id);
                  }}
                  className="deleteIcon"
                >
                  <DeleteOutlined style={{ fontSize: "0.8rem" }} />
                </div>
              </Card>
            </List.Item>
          )}
        />
      </PageHeader>
    </>
  );
};

export default Index;
