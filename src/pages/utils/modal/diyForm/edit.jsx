import React, {
  useRef,
  useReducer,
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Modal,
  Row,
  Col,
  Input,
  InputNumber,
  DatePicker,
  message,
  Typography,
  Rate,
  Radio,
  Checkbox,
  Table,
} from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import AssetsModal from "@/pages/utils/modal/assets";
import { getData, editData, getApproveList } from "@/services/diyFormValue";

import { getData as getFlowData } from "@/services/flow";
import moment from "moment";
import "./style.css";

const dateFormat = "YYYY-MM-DD";

const stas = ["已拒绝", "待审核", "已完成"];

const columns = [
  {
    title: "审批人",
    dataIndex: "user_name",
  },
  {
    title: "审批意见",
    dataIndex: "content",
  },
  {
    title: "审批时间",
    dataIndex: "create_time",
  },
  {
    title: "审批状态",
    dataIndex: "status",
    valueEnum: {
      all: {
        text: "全部",
        status: "Default",
      },
      refuse: {
        text: "已拒绝",
        status: "Error",
      },
      review: {
        text: "审核中",
        status: "Processing",
      },
      success: {
        text: "通过",
        status: "Success",
      },
    },
  },
];

const { Text } = Typography;
const Index = (props, ref) => {
  const { onOk } = props;
  // 图片选择框
  const assetsRef = useRef();

  // 图片选择类型
  const [actionType, setActionType] = useState(null);
  const [editIndex, setEditIndex] = useState(0);
  const [multiple, setMultiple] = useState(false);
  const [visible, setVisible] = useState(false);
  const [dateValue, setDateValue] = useState("");
  const [id, setId] = useState(0);
  const [targetId, setTargetId] = useState(0);
  const [title, setTitle] = useState("修改凭证");
  const [approve, setApprove] = useState([]);
  const [approveList, setApproveList] = useState([]);
  const [formConfig, dispath] = useReducer((state, action) => {
    // ...
    let temp = [...state];
    switch (action.type) {
      case "init":
        temp = action.param;
        break;
      case "add":
        temp.splice(action.index, 0, action.param);
        break;
      case "update":
        temp[action.index].data = action.param;
        break;
      case "delete":
        temp.splice(action.index, 1);
        // eslint-disable-next-line no-case-declarations
        break;
      default:
        temp = [];
        break;
    }

    return temp;
  }, []);
  // 选择保存缩略图的文件

  // 当前操的数据索引
  const [formIndex, setFormIndex] = useState(0);
  const [nodeId, setNodeId] = useState(0);
  const [nodeType, setNodeType] = useState(1);
  const [targetType, setTargetType] = useState(0);

  const [remark, setRemark] = useState([]);

  useImperativeHandle(ref, () => ({
    open: (valueId, field) => {
      setVisible(true);
      setId(valueId);
      if (field.id) {
        setTargetId(field.id);
      }
      if (field.node_id) {
        setNodeId(field.node_id);
      }
      if (field.node_type) {
        setNodeType(field.node_type);
      }
      if (field.target_type) {
        setTargetType(field.target_type);
      }

      if (field.schedule_time) {
        setDateValue(field.schedule_time);
      }

      if (field.title) {
        setTitle(field.title);
      }
    },
    close: () => {
      setVisible(false);
    },
  }));

  // 初始化
  useEffect(() => {
    if (!visible) {
      setId(0);
      setTargetId(0);
      setTitle("修改凭证");
      setDateValue("");
    }
  }, [visible]);

  useEffect(() => {
    const featchData = async () => {
      const result = await getData(id);
      if (result.code === 1) {
        window.console.log(result.data);

        const temp = result.data;

        const tempRemark = [];
        temp.forEach((v) => {
          console.log("v", v);
          if (v.type === "image" || v.type === "file") {
            if (v.data.approve !== undefined) {
              v.data.approve.forEach((sv) => {
                console.log("sv", sv);
                tempRemark.push(sv);
              });
            }
          }
          console.log(tempRemark);

          let remarkVal = "";
          tempRemark.forEach((rv, i) => {
            remarkVal = `${remarkVal + (i + 1)}:${rv}\n`;
          });

          setRemark(remarkVal);
        });

        dispath({
          type: "init",
          param: result.data,
        });
      } else {
        message.error(result.msg);
      }
    };
    if (id !== 0) {
      featchData();
    }
  }, [id]);

  useEffect(() => {
    const featchData = async () => {
      const res = await getApproveList(targetId);
      if (res.code === 1) {
        const temp = res.data;
        temp.map((v) => {
          const t = v;
          t.status = stas[v.status];
          return t;
        });
        setApproveList(res.data);
      }
    };

    if (targetId !== 0) {
      featchData();
    }
  }, [targetId]);

  useEffect(() => {
    const featchData = async () => {
      // 获取发起人的节点
      const result = await getFlowData(nodeId, { type: "start" });
      if (result.code === 1) {
        window.console.log(result.data);
        setApprove(result.data);
      } else {
        message.error(result.msg);
      }
    };

    if (nodeType === 2) {
      featchData();
    }
  }, [nodeType]);

  const onAssetsModalOk = (data = []) => {
    const temp = { ...formConfig[formIndex].data };
    switch (actionType) {
      case "add":
        if (temp.value === "") {
          temp.value = [];
        }
        temp.value = temp.value.concat(data);
        break;
      case "edit":
        temp.value[editIndex] = data;
        break;
      case "delete":
        temp.value.splice(data, 1);
        // window.console.log(temp, editIndex)
        break;
      default:
        break;
    }
    dispath({
      type: "update",
      index: formIndex,
      param: temp,
    });
  };

  // 编辑图片
  const handleAssetsEdit = (i) => {
    setEditIndex(i);
    setMultiple(false);
    setActionType("edit");
    assetsRef.current.modalVisible(true);
  };

  // 删除图片
  const handleAssetsDelete = (i) => {
    setEditIndex(i);
    setActionType("delete");
    onAssetsModalOk();
  };

  useEffect(() => {
    if (actionType === "delete") {
      onAssetsModalOk();
    }
  }, [actionType]);

  // 表单输入改变
  const InputOnChange = (e, index) => {
    const { value } = e.target;
    const temp = { ...formConfig[index].data };
    temp.value = value;
    dispath({
      type: "update",
      index,
      param: temp,
    });
  };

  // 增加意见输入改变
  const ApproveOnChange = (e, index, i) => {
    const { value } = e.target;

    console.log("value", value);

    const temp = { ...formConfig[index].data };
    if (temp.approve === undefined || temp.approve === "") {
      temp.approve = [];
    }
    temp.approve[i] = value;

    dispath({
      type: "update",
      index,
      param: temp,
    });
  };

  const InputValueOnChange = (value, index) => {
    const temp = { ...formConfig[index].data };
    temp.value = value;
    dispath({
      type: "update",
      index,
      param: temp,
    });
  };

  // 完成时间
  const onDatePickerChange = (value, dateString) => {
    setDateValue(dateString);
  };

  const onCancel = () => {
    setNodeId(0);
    setVisible(false);
  };

  // 打开图片资源选择器
  const openImageModal = (index) => {
    setMultiple(true);
    setActionType("add");
    setFormIndex(index);
    assetsRef.current.modalVisible(true);
  };

  // 打开附件资源选择器
  const openFileModal = (index) => {
    setFormIndex(index);
    setActionType("add");
    assetsRef.current.modalVisible(true, "file");
  };

  //
  const onModalOk = async () => {
    window.console.log(
      id,
      targetId,
      nodeId,
      targetType,
      dateValue,
      formConfig,
      nodeType
    );

    const param = {
      schedule_time: dateValue,
      json_config: JSON.stringify(formConfig),
    };

    const result = await editData(id, param);

    if (result.code === 1) {
      message.success(result.msg);
      if (onOk) {
        onOk();
      }
      setVisible(false);
    }
  };

  const getRender = (temp, index) => {
    const item = { ...temp };

    if (item.type === "input") {
      return (
        <div key={index} className="components bg-white">
          <div className="label">{item.data.title}：</div>
          <Input
            onChange={(e) => {
              InputOnChange(e, index);
            }}
            value={item.data.value}
            placeholder={item.data.placeholder}
          />
        </div>
      );
    }
    if (item.type === "textarea") {
      return (
        <div key={index} className="components bg-white" data-index={index}>
          <div className="label">{item.data.title}：</div>
          <Input.TextArea
            onChange={(e) => {
              InputOnChange(e, index);
            }}
            value={item.data.value}
            placeholder={item.data.placeholder}
            style={{ resize: "none" }}
          />
        </div>
      );
    }
    if (item.type === "number") {
      return (
        <div key={index} className="components bg-white">
          <div className="label">{item.data.title}：</div>
          <InputNumber
            onChange={(value) => {
              InputValueOnChange(value, index);
            }}
            value={item.data.value}
            placeholder={item.data.placeholder}
            style={{ width: "100%" }}
          />
        </div>
      );
    }

    if (item.type === "rate") {
      return (
        <div key={index} className="components bg-white">
          <div className="label">{item.data.title}：</div>
          <Rate
            onChange={(value) => {
              InputValueOnChange(value, index);
            }}
            value={item.data.value}
          />
        </div>
      );
    }

    if (item.type === "radio") {
      return (
        <div key={index} className="components bg-white">
          <div className="label">{item.data.title}：</div>
          <Radio.Group
            onChange={(value) => {
              InputOnChange(value, index);
            }}
            value={item.data.value}
          >
            {item.data.options.map((v, i) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <Radio key={i} value={v}>
                  {v}
                </Radio>
              );
            })}
          </Radio.Group>
        </div>
      );
    }

    if (item.type === "checkbox") {
      return (
        <div key={index} className="components bg-white">
          <div className="label">{item.data.title}：</div>
          <Checkbox.Group
            onChange={(value) => {
              InputValueOnChange(value, index);
            }}
            options={item.data.options}
            value={item.data.value}
          />
        </div>
      );
    }

    if (item.type === "image") {
      return (
        <div key={index} className="components bg-white">
          <div className="label">{item.data.title}：</div>
          <Row className="multipleImage" gutter={[24, 24]}>
            {item.data.value.length > 0 &&
              item.data.value.map((v, i) => {
                let tempApprove = "";
                if (
                  item.data.approve instanceof Array &&
                  item.data.approve.length > i
                ) {
                  tempApprove = item.data.approve[i];
                }

                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <Col key={`image-${i}`} span={6}>
                    <div className="img-wrap">
                      <img src={v.prev_path} alt="" />
                      <div className="handle-btn d-flex">
                        <div
                          onClick={() => {
                            handleAssetsEdit(i);
                          }}
                          className="flex-1 btn-item"
                        >
                          替换
                        </div>
                        <div className="v-line" />
                        <div
                          onClick={() => {
                            handleAssetsDelete(i);
                          }}
                          className="flex-1 btn-item"
                        >
                          删除
                        </div>
                      </div>
                    </div>
                    <Input.TextArea
                      defaultValue={tempApprove}
                      onChange={(e) => {
                        ApproveOnChange(e, index, i);
                      }}
                      style={{ marginTop: "10px" }}
                      rows="1"
                    />
                  </Col>
                );
              })}
            <Col>
              <div
                className="upload"
                onClick={() => {
                  openImageModal(index);
                }}
              >
                <CloudUploadOutlined style={{ fontSize: "1.5rem" }} />
                <div className="ant-upload-text">上传图片</div>
              </div>
            </Col>
          </Row>
        </div>
      );
    }
    if (item.type === "file") {
      return (
        <div key={index} className="components bg-white">
          <div className="label">{item.data.title}：</div>

          <Row className="multipleFile" gutter={[0, 24]}>
            {item.data.value.length > 0 &&
              item.data.value.map((v, i) => {
                let tempApprove = "";
                if (
                  item.data.approve instanceof Array &&
                  item.data.approve.length > i
                ) {
                  tempApprove = item.data.approve[i];
                }

                return (
                  // eslint-disable-next-line react/no-array-index-key
                  <Col key={`file-${i}`} span={24}>
                    <a
                      rel="noreferrer"
                      target="_blank"
                      href={v.prev_path}
                      className="file-title mr-2"
                    >
                      {v.remark_name}
                    </a>
                    <Text
                      onClick={() => {
                        handleAssetsDelete(i);
                      }}
                      className="delete"
                      type="danger"
                    >
                      删除
                    </Text>
                    <div>
                      <Input.TextArea
                        onChange={(e) => {
                          ApproveOnChange(e, index, i);
                        }}
                        defaultValue={tempApprove}
                        style={{ width: "60%", marginTop: "10px" }}
                        rows={1}
                      />
                    </div>
                  </Col>
                );
              })}
            <Col>
              <div
                className="file-upload"
                onClick={() => {
                  openFileModal(index);
                }}
              >
                上传附件
              </div>
            </Col>
          </Row>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <AssetsModal multiple={multiple} ref={assetsRef} onOk={onAssetsModalOk} />
      <Modal
        width="50%"
        title={title}
        centered
        visible={visible}
        destroyOnClose
        onOk={onModalOk}
        onCancel={onCancel}
      >
        <div className="components bg-white">
          <div className="label">完成时间：</div>
          <DatePicker
            value={moment(dateValue, dateFormat)}
            format={dateFormat}
            style={{ width: "100%" }}
            onChange={onDatePickerChange}
          />
        </div>

        {formConfig.map((v, i) => {
          return getRender(v, i);
        })}

        <div key="remark" className="components bg-white">
          <div className="label">批注记录：</div>
          <Input.TextArea value={remark} />
        </div>

        {approveList.length > 0 && (
          <div className="components bg-white">
            <div className="label">审批意见：</div>
            <Table
              rowKey="id"
              columns={columns}
              dataSource={approveList}
              size="middle"
              pagination={false}
            />
          </div>
        )}

        {nodeType === 2 && (
          <>
            <h3>审批流程：</h3>
            <div>审批人：{approve.role_text}</div>
          </>
        )}
      </Modal>
    </>
  );
};

export default forwardRef(Index);
