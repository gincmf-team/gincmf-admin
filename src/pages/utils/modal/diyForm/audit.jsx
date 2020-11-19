import React, { useRef, useReducer, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { Modal, Row, Col, Input, InputNumber, DatePicker, message, Rate, Radio, Checkbox, Table, Button } from 'antd';
import AssetsModal from '@/pages/utils/modal/assets'
import { getData } from "@/services/diyFormValue"
import { addData,getApproveList } from '@/services/siteApprove'
import moment from 'moment';
import "./style.css"

const dateFormat = "YYYY-MM-DD"

const stas = ['已拒绝', '待审核', '已完成']

const columns = [
    {
        title: '审批人',
        dataIndex: 'user_name',
    },
    {
        title: '审批意见',
        dataIndex: 'content',
    },
    {
        title: '审批时间',
        dataIndex: 'create_time',
    },
    {
        title: '审批状态',
        dataIndex: 'status',
        valueEnum: {
            all: {
                text: '全部',
                status: 'Default',
            },
            refuse: {
                text: '已拒绝',
                status: 'Error',
            },
            review: {
                text: '审核中',
                status: 'Processing',
            },
            success: {
                text: '通过',
                status: 'Success',
            },
        }
    },
];


const Index = ((props, ref) => {

    const {onOk} = props
    
    // 图片选择框
    const assetsRef = useRef()

    // 图片选择类型
    const [visible, setVisible] = useState(false)
    const [dateValue, setDateValue] = useState('')
    const [id, setId] = useState(0)
    const [targetId, setTargetId] = useState(0)
    const [title, setTitle] = useState('修改凭证')
    const [approveId, setApproveId] = useState(0)
    const [approveList, setApproveList] = useState([])
    const [readOnly, setReadOnly] = useState(false)

    const [remarkItem, setRemarkItem] = useState(false)

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
    const [nodeId, setNodeId] = useState(0)
    const [nodeType, setNodeType] = useState(1)
    const [targetType, setTargetType] = useState(0)

    const [remark, setRemark] = useState([])

    useImperativeHandle(ref, () => ({
        open: (valueId, field) => {
            console.log(field)
            setVisible(true)
            setId(valueId)
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

            if (field.schedule_time) {
                setDateValue(field.schedule_time)
            }

            if (field.remark_item) {
                setRemarkItem(field.remark_item)
            }

            setReadOnly(false)
            if (field.readonly) {
                setReadOnly(field.readonly)
            }

            if (field.title) {
                setTitle(field.title)
            }

            if (field.approve_id) {
                setApproveId(field.approve_id)
            }
        },
        close: () => {
            setVisible(false)
        }
    }));

    // 初始化
    useEffect(() => {

        if (!visible) {
            setId(0)
            setTargetId(0)
            setTitle("修改凭证")
            setDateValue("")
        }

    }, [visible])

    useEffect(() => {
        const featchData = async () => {
            const result = await getData(id)
            if (result.code === 1) {
                window.console.log(result.data)

                const temp = result.data

                const tempRemark = []
                temp.forEach((v) => {
                    console.log("v", v)
                    if (v.type === "image" || v.type === "file") {
                        if (v.data.approve !== undefined) {
                            v.data.approve.forEach((sv) => {

                                console.log("sv", sv)
                                tempRemark.push(sv)

                            })
                        }
                    }
                    console.log(tempRemark)

                    let remarkVal = ""
                    tempRemark.forEach((rv, i) => {
                        remarkVal = `${remarkVal + (i + 1)}:${rv}\n`
                    })

                    setRemark(remarkVal)
                })

                dispath({
                    type: "init",
                    param: result.data
                })
            } else {
                message.error(result.msg)
            }

        }
        if (id !== 0) {
            featchData()
        }

    }, [id])

    useEffect(() => {

        const featchData = async () => {
            console.log(targetId)
            const res = await getApproveList(targetId)
            if (res.code === 1) {
                const temp = res.data
                temp.map((v) => {
                    const t = v
                    t.status = stas[v.status]
                    return t
                })

                console.log("temp",temp)
                setApproveList(res.data)
            }
        }

        if (targetId !== 0) {
            featchData()
        }

    }, [targetId])


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

    // 增加意见输入改变
    const ApproveOnChange = (e, index, i) => {
        const { value } = e.target

        console.log("value", value)

        const temp = { ...formConfig[index].data }
        if (temp.approve === undefined || temp.approve === "") {
            temp.approve = []
        }
        temp.approve[i] = value

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


    // 
    const onApprove = async (status) => {
        window.console.log(id, approveId, targetId, nodeId, targetType, dateValue, formConfig, nodeType)
        const param = { approve_id: approveId, form_value_id: id, status, json_config: JSON.stringify(formConfig) }
        console.log(param)
        const result = await addData(param)
        if (result.code === 1) {
            message.success(result.msg)
            setVisible(false)
            if(onOk) {
                console.log("onk",onOk)
                onOk()
            }

        } else {
            message.error(result.msg)
        }
    }

    const getRender = (temp, index) => {

        const item = { ...temp }

        if (item.type === 'input') {
            return (
                <div
                    key={index}
                    className="components bg-white"
                >
                    <div className="label">
                        {item.data.title}：
                </div>
                    <Input disabled onChange={(e) => { InputOnChange(e, index) }} value={item.data.value} placeholder={item.data.placeholder} />
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
                    <Input.TextArea disabled onChange={(e) => { InputOnChange(e, index) }} value={item.data.value} placeholder={item.data.placeholder} style={{ resize: "none" }} />
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
                    <InputNumber disabled onChange={(value) => { InputValueOnChange(value, index) }} value={item.data.value} placeholder={item.data.placeholder} style={{ width: "100%" }} />
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
                    <Rate disabled onChange={(value) => { InputValueOnChange(value, index) }} value={item.data.value} />
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
                    <Radio.Group disabled onChange={(value) => { InputOnChange(value, index) }} value={item.data.value}>
                        {
                            item.data.options.map((v, i) => {
                                return (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <Radio key={i} value={v}>{v}</Radio>
                                )
                            })
                        }
                    </Radio.Group>
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
                    <Checkbox.Group disabled onChange={(value) => { InputValueOnChange(value, index) }} options={item.data.options} value={item.data.value} />
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

                            let tempApprove = ""
                            if (item.data.approve instanceof Array && item.data.approve.length > i) {
                                tempApprove = item.data.approve[i]
                            }

                            return (
                                // eslint-disable-next-line react/no-array-index-key
                                <Col key={`image-${i}`} span={6}>
                                    <div className="img-wrap">
                                        <img src={v.prev_path} alt="" />
                                    </div>
                                    { remarkItem &&
                                        <Input.TextArea defaultValue={tempApprove} onChange={(e) => { ApproveOnChange(e, index, i) }} style={{ marginTop: "10px" }} rows="1" />
                                    }
                                </Col>
                            )
                        })}
                    </Row>
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
                            let tempApprove = ""
                            if (item.data.approve instanceof Array && item.data.approve.length > i) {
                                tempApprove = item.data.approve[i]
                            }

                            return (
                                // eslint-disable-next-line react/no-array-index-key
                                <Col key={`file-${i}`} span={24}>
                                    <a rel="noreferrer" target="_blank" href={v.prev_path} className="file-title mr-2">
                                        {v.remark_name}
                                    </a>

                                    { remarkItem &&
                                        <div>
                                            <Input.TextArea onChange={(e) => { ApproveOnChange(e, index, i) }} defaultValue={tempApprove} style={{ width: "60%", marginTop: "10px" }} rows={1} />
                                        </div>
                                    }
                                </Col>
                            )
                        })}

                    </Row>

                </div>

            )
        }
        return null
    }

    const footer = () => {
        let render = [
            <Button type="primary" style={{ float: "left" }}>
                导出
            </Button>,
            <Button key="back" onClick={() => setVisible(false)}>
                取消
            </Button>,
            <Button key="submit" onClick={() => setVisible(false)} type="primary">
                确定
            </Button>
        ]

        if (!readOnly) {
            render = [
                <Button key="back" onClick={() => { onApprove(0) }}>
                    拒绝
            </Button>,
                <Button key="submit" type="primary" onClick={() => { onApprove(2) }}>
                    同意
            </Button>
            ]
        }

        return render
    }

    return (
        <>
            <AssetsModal ref={assetsRef} />
            <Modal wrapClassName="diy_form" width="50%" title={title} centered visible={visible} onCancel={() => setVisible(false)} destroyOnClose
                footer={footer()}
            >
                <div
                    className="components bg-white"
                >
                    <div className="label">
                        完成时间：
                </div>
                    <DatePicker disabled value={moment(dateValue, dateFormat)} format={dateFormat} style={{ width: "100%" }} onChange={onDatePickerChange} />
                </div>

                {
                    formConfig.map((v, i) => {
                        return getRender(v, i)
                    })
                }

                <div
                    key="remark"
                    className="components bg-white"
                >
                    <div className="label">
                        批注记录：
                </div>
                    <Input.TextArea value={remark} />
                </div>

                {approveList.length > 0 && <div className="components bg-white">
                    <div className="label">
                        审批意见：
                                    </div>
                    <Table rowKey="id" columns={columns} dataSource={approveList} size="middle" pagination={false} />
                </div>}
            </Modal>
        </>
    )

})

export default forwardRef(Index)