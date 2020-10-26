import React, { useState, useEffect } from "react";
import { PageHeader, Button, List, Card, Upload, message } from "antd";
import ModalAudio from "@/pages/utils/modal/assets/components/preview/audio";
import { DeleteOutlined, CustomerServiceTwoTone } from "@ant-design/icons";
import { getAssets, deleteAssets } from "@/services/assets";

const Video = () => {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);
  const [data, setData] = useState([]);

  // 获取资源数据列表
  const getData = async (params) => {
    const temp = { ...params, type: 1 };
    const result = await getAssets(temp);
    let paginationData = [];
    if (result.code === 1) {
      paginationData = result.data.data;
      setIndex(0);
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

  let token = localStorage.getItem("token");
  if (token) {
    token = JSON.parse(token);
  }
  const uploadProps = {
    name: "file[]",
    multiple: true,
    action: "/api/admin/assets",
    data: { type: 1 },
    headers: {
      Authorization: `Bearer ${token.access_token}`,
    },
    onChange(info) {
      if (info.file.status === "done") {
        getData([]);
      }
    },
  };

  // 删除单项
  const deleteItem = async (e, id) => {
    e.stopPropagation();
    const result = await deleteAsset(id);
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
      <ModalAudio
        data={data}
        index={index}
        visible={visible}
        setVisible={setVisible}
      />
      <PageHeader
        style={{ padding: 0 }}
        title={`音频（共${total}条）`}
        extra={[
          <Upload key="upload" {...uploadProps}>
            <Button type="primary">上传</Button>
          </Upload>,
        ]}
      >
        <List
          grid={{ gutter: 16, column: 6, xs: 2, sm: 4, md: 4, lg: 6 }}
          dataSource={data}
          pagination={{
            onChange: (page) => {
              window.console.log(page);
            },
            pageSize: 10,
          }}
          renderItem={(item, itemIndex) => (
            <List.Item>
              <Card
                onClick={() => openPreview(itemIndex)}
                cover={<CustomerServiceTwoTone style={{ fontSize: "4rem" }} />}
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

export default Video;
