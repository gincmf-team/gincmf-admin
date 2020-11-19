import React, { useRef, useReducer, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { Modal, Row, Col, Input, InputNumber, DatePicker, message, Typography, Rate, Radio, Checkbox } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import AssetsModal from '@/pages/utils/modal/assets'
import { getData } from "@/services/diyForm"
import { addData as fvAddData } from "@/services/diyFormValue"
import { getData as getFlowData } from "@/services/flow"
import "./style.css"

const { Text } = Typography;
const Index = ((props, ref) => {

    const { onOk } = props

    // 图片选择框
    const assetsRef = useRef()

    // 图片选择类型
    const [actionType, setActionType] = useState(null)
    const [editIndex, setEditIndex] = useState(0)
    const [multiple, setMultiple] = useState(false)
    const [visible, setVisible] = useState(false)
    const [dateValue, setDateValue] = useState('')
    const [id, setId] = useState(0)
    const [targetId, setTargetId] = useState(0)
    const [approve, setApprove] = useState([])
    const [title, setTitle] = useState("上传凭证")
    const [formConfig, dispath] = useReducer((state, action) => {
        // ...
        let temp = [...state];
        switch (action.type) {
            case 'init':
                temp = action.param;
                break;
            case 'add':
                temp.splice(action.index, 0, action.param)
                break;
            case 'update':
                temp[action.index].data = action.param
                break;
            case 'delete':
                temp.splice(action.index, 1)
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
    const [formIndex, setFormIndex] = useState(0)
    const [nodeId, setNodeId] = useState(0)
    const [nodeType, setNodeType] = useState(1)
    const [targetType, setTargetType] = useState(0)

    useImperativeHandle(ref, () => ({
        open: (post_id, field) => {
            console.log(field)
            setVisible(true)
            setId(post_id)
            if (field.id) {
                setTargetId(field.id)
            }
            if (field.node_id) {
                setNodeId(field.node_id)
            }
            if (field.node_type) {
                setNodeType(field.node_type)
            }
            if (field.target_type) {
                setTargetType(field.target_type)
            }
            if (field.title) {
                setTitle(field.title)
            }
        },
        close: () => {
            setVisible(false)
        }
    }));

    useEffect( () => {
        if(!visible){
            setDateValue("")
        }
    } ,[visible])

    useEffect(() => {
        const featchData = async () => {
            const result = await getData(nodeId)
            if (result.code === 1) {
                window.console.log(result.data)
                dispath({
                    type: "init",
                    param: result.data
                })
            } else {
                message.error(result.msg)
            }

        }

        if (nodeId !== 0) {
            featchData()
        }

    }, [nodeId])

    useEffect(() => {

        const featchData = async () => {
            // 获取发起人的节点
            const result = await getFlowData(nodeId, { type: "start" })
            if (result.code === 1) {
                window.console.log(result.data)
                setApprove(result.data)
            } else {
                message.error(result.msg)
            }
        }

        if (nodeType === 2) {
            featchData()
        }

    }, [nodeType])

    const onAssetsModalOk = (data = []) => {
        const temp = { ...formConfig[formIndex].data }
        switch (actionType) {
            case "add":
                if (temp.value === "") {
                    temp.value = []
                }
                temp.value = temp.value.concat(data)
                break;
            case "edit":
                temp.value[editIndex] = data
                break;
            case "delete":
                temp.value.splice(data, 1)
                // window.console.log(temp, editIndex)
                break;
            default:
                break;
        }
        dispath(
            {
                type: "update",
                index: formIndex,
                param: temp
            }
        )
    }

    // 编辑图片
    const handleAssetsEdit = (i) => {
        setEditIndex(i)
        setMultiple(false)
        setActionType("edit")
        assetsRef.current.modalVisible(true)
    }

    // 删除图片
    const handleAssetsDelete = (i) => {
        setEditIndex(i)
        setActionType("delete")
        onAssetsModalOk()
    }

    useEffect(() => {
        if (actionType === "delete") {
            onAssetsModalOk()
        }
    },
        [actionType])

    // 表单输入改变
    const InputOnChange = (e, index) => {
        const { value } = e.target
        const temp = { ...formConfig[index].data }
        temp.value = value
        dispath(
            {
                type: "update",
                index,
                param: temp
            }
        )
    }

    const InputValueOnChange = (value, index) => {
        const temp = { ...formConfig[index].data }
        temp.value = value
        dispath(
            {
                type: "update",
                index,
                param: temp
            }
        )
    }

    // 完成时间
    const onDatePickerChange = (value, dateString) => {
        setDateValue(dateString)
    }

    const onCancel = () => {
        setNodeId(0)
        setVisible(false)
    }

    // 打开图片资源选择器
    const openImageModal = (index) => {
        setMultiple(true)
        setActionType("add")
        setFormIndex(index)
        assetsRef.current.modalVisible(true)
    }

    // 打开附件资源选择器
    const openFileModal = (index) => {
        setFormIndex(index)
        setActionType("add")
        assetsRef.current.modalVisible(true, 'file')
    };

    // 
    const onModalOk = async () => {
        window.console.log(id, targetId, nodeId, targetType, dateValue, formConfig, nodeType)
        const config = JSON.stringify(formConfig)

        const param = { post_id: id, taregt_id: targetId, target_type: targetType, node_id: nodeId, schedule_time: dateValue, json_config: config, node_type: nodeType }

        if (nodeType === 2) {
            param.current_node_id = approve.current_node_id
        }

        const result = await fvAddData(param)
        window.console.log(result)
        if (result.code === 1) {
            message.success(result.msg)
            setVisible(false)
            dispath({
                type: "init",
                param: []
            })
            setNodeId(0)
            if (onOk) {
                onOk()
            }

        } else {
            message.error(result.msg)
        }

    }

    const getRender = (item, index) => {

        if (item.type === 'input') {
            return (
                <div
                    key={index}
                    className="components bg-white"
                >
                    <div className="label">
                        {item.data.title}：
                </div>
                    <Input onChange={(e) => { InputOnChange(e, index) }} defaultValue={item.data.value} placeholder={item.data.placeholder} />
                
                    {item.data.tips !== "" &&  <p className="tips">{item.data.tips}</p>}
                </div>

            )
        }
        if (item.type === 'textarea') {
            return (
                <div
                    key={index}
                    className="components bg-white"
                    data-index={index}
                >
                    <div className="label">
                        {item.data.title}：
                </div>
                    <Input.TextArea onChange={(e) => { InputOnChange(e, index) }} defaultValue={item.data.value} placeholder={item.data.placeholder} style={{ resize: "none" }} />
                    {item.data.tips !== "" &&  <p className="tips">{item.data.tips}</p>}
                </div>

            )
        }
        if (item.type === 'number') {
            return (
                <div
                    key={index}
                    className="components bg-white"
                >
                    <div className="label">
                        {item.data.title}：
                </div>
                    <InputNumber onChange={(value) => { InputValueOnChange(value, index) }} defaultValue={item.data.value} placeholder={item.data.placeholder} style={{ width: "100%" }} />
                    {item.data.tips !== "" &&  <p className="tips">{item.data.tips}</p>}
                </div>
            )
        }

        if (item.type === 'rate') {
            return (
                <div
                    key={index}
                    className="components bg-white"
                >
                    <div className="label">
                        {item.data.title}：
                </div>
                    <Rate onChange={(value) => { InputValueOnChange(value, index) }} defaultValue={item.data.value} />
                    {item.data.tips !== "" &&  <p className="tips">{item.data.tips}</p>}
                </div>
            )
        }

        if (item.type === 'radio') {
            return (
                <div
                    key={index}
                    className="components bg-white"
                >
                    <div className="label">
                        {item.data.title}：
                </div>
                    <Radio.Group onChange={(value) => { InputOnChange(value, index) }} defaultValue={item.data.value}>
                        {
                            item.data.options.map((v, i) => {
                                return (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <Radio key={i} value={v}>{v}</Radio>
                                )
                            })
                        }
                    </Radio.Group>
                    {item.data.tips !== "" &&  <p className="tips">{item.data.tips}</p>}
                </div>
            )
        }

        if (item.type === 'checkbox') {
            return (
                <div
                    key={index}
                    className="components bg-white"
                >
                    <div className="label">
                        {item.data.title}：
                </div>
                    <Checkbox.Group onChange={(value) => { InputValueOnChange(value, index) }} options={item.data.options} defaultValue={item.data.value} />
                    {item.data.tips !== "" &&  <p className="tips">{item.data.tips}</p>}
                </div>
            )
        }

        if (item.type === 'image') {
            return (
                <div
                    key={index}
                    className="components bg-white"
                >
                    <div className="label">
                        {item.data.title}：
                </div>
                    <Row className="multipleImage" gutter={[24, 24]}>
                        {item.data.value.length > 0 && item.data.value.map((v, i) => {
                            return (
                                // eslint-disable-next-line react/no-array-index-key
                                <Col key={`image-${i}`} span={6}>
                                    <div className="img-wrap">
                                        <img src={v.prev_path} alt="" />
                                        <div className="handle-btn d-flex">
                                            <div onClick={() => { handleAssetsEdit(i) }} className="flex-1 btn-item">替换</div>
                                            <div className="v-line" />
                                            <div onClick={() => { handleAssetsDelete(i) }} className="flex-1 btn-item">删除</div>
                                        </div>
                                    </div>
                                </Col>
                            )
                        })}
                        <Col>
                            <div className="upload" onClick={() => { openImageModal(index) }}>
                                <CloudUploadOutlined style={{ fontSize: "1.5rem" }} />
                                <div className="ant-upload-text">上传图片</div>
                            </div>
                        </Col>
                    </Row>
                    {item.data.tips !== "" &&  <p className="tips">{item.data.tips}</p>}
                </div>

            )
        }
        if (item.type === 'file') {
            return (
                <div
                    key={index}
                    className="components bg-white"
                >
                    <div className="label">
                        {item.data.title}：
                </div>

                    <Row className="multipleFile" gutter={[0, 24]}>
                        {item.data.value.length > 0 && item.data.value.map((v, i) => {
                            return (
                                // eslint-disable-next-line react/no-array-index-key
                                <Col key={`file-${i}`} span={24}>
                                    <a rel="noreferrer" target="_blank" href={v.prev_path} className="file-title mr-2">
                                        {v.remark_name}
                                    </a>
                                    <Text onClick={() => { handleAssetsDelete(i) }} className="delete" type="danger">删除</Text>
                                </Col>
                            )
                        })}
                        <Col>
                            <div className="file-upload" onClick={() => { openFileModal(index) }}>
                                上传附件
                            </div>
                        </Col>
                        {item.data.tips !== "" &&  <p className="tips">{item.data.tips}</p>}
                    </Row>

                </div>

            )
        }
        return null
    }

    return (
        <>
            <AssetsModal multiple={multiple} ref={assetsRef} onOk={onAssetsModalOk} />
            <Modal wrapClassName="diy_form" width="50%" title={title} centered visible={visible} destroyOnClose
                onOk={onModalOk}
                onCancel={onCancel}
            >
                {
                    targetType === 0 && <div
                        className="components bg-white"
                    >
                        <div className="label">
                            完成时间：
                </div>
                        <DatePicker style={{ width: "100%" }} onChange={onDatePickerChange} />
                    </div>
                }

                {
                    formConfig.map((v, i) => {
                        return getRender(v, i)
                    })
                }

                {
                    nodeType === 2 &&
                    <>
                        <h3>
                            审批流程：
                        </h3>
                        <div>
                            审批人：{approve.role_text}
                        </div>
                    </>
                }
            </Modal>
        </>
    )

})

export default forwardRef(Index)