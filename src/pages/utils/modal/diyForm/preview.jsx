import React, { useReducer, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import { Modal, Row, Col, Input, InputNumber, DatePicker, message, Rate, Radio, Checkbox, Button, Table } from 'antd';
import moment from 'moment';
import { getData, approveAduit, getApproveList } from "@/services/diyFormValue"
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


const Preview = ((props, ref) => {

    const { onOk } = props

    const [visible, setVisible] = useState(false)
    const [dateValue, setDateValue] = useState('')
    const [targetId, setTargetId] = useState(0)
    const [targetType, setTargetType] = useState(0)
   
    const [approveList, setApproveList] = useState([])

    const [title, setTitle] = useState('查看凭证')
    const [formConfig, dispath] = useReducer((state, action) => {
        // ...
        let temp = [...state];
        switch (action.type) {
            case 'init':
                temp = action.data;
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
        console.log(temp)
        return temp;
    }, []);

    // 是否是审核
    const [status, setStatus] = useState(-1)
    const [audit, setAudit] = useState(0)
    const [approveId, setApproveId] = useState(0)
    const [content, setContent] = useState(0)

    // 选择保存缩略图的文件
    useImperativeHandle(ref, () => ({
        open: (field) => {
            window.console.log(field)
            setVisible(true)
            setTargetId(field.target_id)
            setDateValue(field.schedule_time)
            if (field.target_type) {
                setTargetType(field.target_type)
            }
            if (field.approve_id) {
                setApproveId(field.approve_id)
            }
            if (field.title) {
                setTitle(field.title)
            }
            if (field.status) {
                window.console.log("status", field.status)
                setStatus(field.status)
            }

            if (field.audit) {
                setAudit(field.audit)
            }
        },
        close: () => {
            setVisible(false)
        }
    }));

    // 初始化
    useEffect(() => {

        if (!visible) {
            setTargetId(0)
            setApproveId(0)
            setTitle("查看凭证")
            setDateValue("")
            setStatus(-1)
            setAudit(false)
            dispath({
                type: "init",
                data: []
            })
        }

    }, [visible])

    useEffect(() => {
        const featchData = async () => {
            const result = await getData(targetId)
            if (result.code === 1) {
                window.console.log(result.data)

                dispath({
                    type: "init",
                    data: result.data
                })
            } else {
                message.error(result.msg)
            }


            if (approveId > 0) {
                const res = await getApproveList(approveId)
                if (res.code === 1) {

                    const temp = res.data

                    temp.map((v) => {
                        const t = v
                        t.status = stas[v.status]
                        return t
                    })

                    setApproveList(res.data)
                }
            }
        }

        if (targetId !== 0) {
            featchData()
        }

    }, [targetId])


    const onCancel = () => {
        setVisible(false)
    }

    const onButtonOk = () => {
        setVisible(false)
    }

    const approve = (s) => {
        console.log(s, approveId, content)
        const featchData = async () => {
            const result = await approveAduit({ approve_id: approveId, status: s, content })
            console.log(result)
            if (result.code === 1) {
                message.success(result.msg)
                setVisible(false)
                if (onOk) {
                    onOk()
                }
            } else {
                message.error(result.msg)
            }
        }

        featchData()
    }

    const exportTemp = () => {
        window.open(`/api/admin/export_template/${targetId}`)    
    }


    const footer = () => {
        let render = [
            <Button type="primary" style={{float:"left"}} onClick={exportTemp}>
                导出
            </Button>,
            <Button key="back" onClick={onCancel}>
                取消
            </Button>,
            <Button key="submit" type="primary" onClick={onButtonOk}>
                确定
            </Button>
        ]
        if (approveId > 0 && status === 1 && audit) {
            render = [
                <Button key="back" onClick={() => { approve(0) }}>
                    拒绝
            </Button>,
                <Button key="submit" type="primary" onClick={() => { approve(1) }}>
                    同意
            </Button>
            ]
        }
        return render
    }

    const getRender = (item, index) => {

        if (item.type === 'input') {
            return (
                <div
                    key={`com-render-${index}`}
                    className="components bg-white"
                >
                    <div className="label">
                        {item.data.title}：
                </div>
                    <Input readOnly value={item.data.value} placeholder={item.data.placeholder} />
                </div>

            )
        }
        if (item.type === 'textarea') {
            return (
                <div
                    key={`com-render-${index}`}
                    className="components bg-white"
                    data-index={index}
                >
                    <div className="label">
                        {item.data.title}：
                </div>
                    <Input.TextArea disabled value={item.data.value} placeholder={item.data.placeholder} style={{ resize: "none" }} />
                </div>

            )
        }
        if (item.type === 'number') {
            return (
                <div
                    key={`com-render-${index}`}
                    className="components bg-white"
                >
                    <div className="label">
                        {item.data.title}：
                </div>
                    <InputNumber readOnly value={item.data.value} placeholder={item.data.placeholder} style={{ width: "100%" }} />
                </div>
            )
        }

        if (item.type === 'rate') {
            return (
                <div
                    key={`com-render-${index}`}
                    className="components bg-white"
                >
                    <div className="label">
                        {item.data.title}：
                </div>
                    <Rate disabled value={item.data.value} />
                </div>
            )
        }

        if (item.type === 'radio') {
            return (
                <div
                    key={`com-render-${index}`}
                    className="components bg-white"
                >
                    <div className="label">
                        {item.data.title}：
                </div>
                    <Radio.Group disabled value={item.data.value}>
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
                    key={`com-render-${index}`}
                    className="components bg-white"
                >
                    <div className="label">
                        {item.data.title}：
                </div>
                    <Checkbox.Group disabled options={item.data.options} value={item.data.value} />
                </div>
            )
        }

        if (item.type === 'image') {
            return (
                <div
                    key={`com-render-${index}`}
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
                                    {tempApprove !== "" &&<div><Input.TextArea disabled defaultValue={tempApprove} style={{marginTop:"10px"}} rows="1" /></div>}
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
                    key={`com-render-${index}`}
                    className="components bg-white"
                >
                    <div className="label">
                        {item.data.title}：
                </div>

                    <Row className="multipleFile" gutter={[0, 24]}>
                        {item.data.value.length > 0 && item.data.value.map((v, i) => {

                            const reg = ['jpg', 'jpeg', 'png', 'gif', 'bmp4', 'svg']
                            const suffix = v.prev_path.split('.').slice(-1)[0]
                            window.console.log("suffix",suffix)
                            const re = reg.indexOf(suffix.toLowerCase());

                            window.console.log(re)

                            let tempApprove = ""
                            if (item.data.approve instanceof Array && item.data.approve.length > i) {
                                tempApprove = item.data.approve[i]
                            }
                            
                            if (re === -1) {
                                return (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <Col key={`file-${i}`} span={24}>
                                        <a rel="noreferrer" target="_blank" href={v.prev_path} className="file-title mr-2">
                                            {v.remark_name}
                                        </a>
                                        {tempApprove !== "" &&<div><Input.TextArea disabled defaultValue={tempApprove} style={{marginTop:"10px"}} rows="1" /></div>}

                                    </Col>
                                )
                            }

                            return (
                                // eslint-disable-next-line react/no-array-index-key
                                <Col key={`file-${i}`} span={6}>
                                    <div className="img-wrap">
                                        <img src={v.prev_path} alt="" />
                                    </div>
                                </Col>
                            )




                        })}

                    </Row>
                </div>

            )
        }
        return null
    }

    const getApprove = (e) => {
        console.log(e.target.value)
        setContent(e.target.value)
    }

    return (
        <>
            <Modal wrapClassName="diy_form" width="50%" title={ 
                title
             } centered visible={visible} destroyOnClose
                onOk={onOk}
                onCancel={onCancel}
                footer={footer()}
            >
                {targetType === 0 &&
                    <div
                        className="components bg-white"
                    >
                        <div className="label">
                            完成时间：
                </div>
                        <DatePicker disabled style={{ width: "100%" }} value={moment(dateValue, dateFormat)} format={dateFormat} />
                    </div>
                }

                {
                    formConfig.map((v, i) => {
                        return getRender(v, i)
                    })
                }

                {
                    (() => {

                        if (approveId > 0 && audit) {
                            if (status === 1) {

                                return (
                                    <div
                                        className="components bg-white"
                                    >
                                        <div className="label">
                                            审批意见：
                </div>
                                        <Input.TextArea onChange={getApprove} />
                                    </div>
                                )

                            }
                        }

                        return null

                    })()
                }

                {approveList.length > 0 && <div className="components bg-white">
                    <div className="label">
                        审批意见：
                                    </div>
                    <Table columns={columns} rowKey="id" dataSource={approveList} size="middle" pagination={false} />
                </div>}


            </Modal>
        </>
    )

})

export default forwardRef(Preview)