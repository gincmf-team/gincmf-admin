import React, { useEffect, useState } from "react";
import { Form, Input, TreeSelect, Row, Col } from "antd";
import { ThumbnailInput, ThumbMultInput } from '@/components/Form';
import { getPortalCategoryList } from '@/services/portalCategory';
import '@/assets/css/style.css';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
    },
};


const Basic = (props) => {
    const { onFormChange, form, pid, formData } = props

    let tPid = "0"
    if (pid !== undefined) {
        tPid = pid
    }

    const [treeData, setTreeData] = useState([])

    useEffect(() => {
        const featchData = async () => {
            const result = await getPortalCategoryList()
            if (result.code === 1) {
                const data = [
                    {
                        title: '作为一级分类',
                        value: '0'
                    }
                ]
                result.data.forEach(element => {
                    data.push(element)
                });
                setTreeData(data)
            }
        }

        // 编辑
        if (formData) {
            tPid = "0"
            form.setFieldsValue(formData);
        }

        featchData()

    }, [formData])

    const onChange = (value) => {
        window.console.log("value", value)
    }

    return (
        <>
            <Row>
                <Col span={12}>
                    <Form form={form} onValuesChange={onFormChange} {...formItemLayout}>
                        <Form.Item label="id" style={{ display: "none" }} name="id">
                            <Input />
                        </Form.Item>

                        <Form.Item label="上级" name="parent_id" initialValue={tPid} rules={[{ required: true, message: '请选择上级分类!' }]}>
                            <TreeSelect
                                treeDefaultExpandAll
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={treeData}
                                onChange={onChange}
                            />
                        </Form.Item>

                        <Form.Item label="分类名称" name="name" rules={[{ required: true, message: '分类名称不能为空!' }]}>
                            <Input />
                        </Form.Item>

                        <Form.Item label="分类别名" name="alias">
                            <Input />
                        </Form.Item>

                        <Form.Item label="描述" name="description">
                            <Input.TextArea rows={4} />
                        </Form.Item>

                        <Form.Item label="缩略图" name="thumbnail" getValueProps={ () => ( {"path":form.getFieldValue('prev_path')} ) }>
                            <ThumbnailInput/>
                        </Form.Item>

                        <Form.Item label="缩略图2" name="thumb">
                            <ThumbMultInput />
                        </Form.Item>

                    </Form>
                </Col>
            </Row>
        </>
    );
}

export default Basic