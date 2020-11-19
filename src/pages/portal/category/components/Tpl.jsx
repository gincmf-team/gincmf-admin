import react, { useRef,useEffect } from "React";
import { Form, Select, Row, Col } from "antd";

const { Option } = Select;

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


const Tpl = (props) => {

    const { onFormChange, form,formData } = props
    useEffect(() => {
        console.log(formData)
        // 编辑
        if (formData) {
            form.setFieldsValue(formData);
        }
       
    }, [formData])

    return (
        <Row>
            <Col span={12}>
                <Form form={form} onValuesChange={onFormChange} {...formItemLayout}>

                    <Form.Item label="列表模板" name="list_tpl" rules={[{ required: true, message: '列表模板不能为空!' }]} initialValue="">
                        <Select>
                            <Option value="">请选择</Option>
                            <Option value="list">文章列表页 portal/list.html</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item label="文章模板" name="one_tpl" rules={[{ required: true, message: '文章模板不能为空!' }]} initialValue="">
                        <Select>
                            <Option value="">请选择</Option>
                            <Option value="article">文章详情页 portal/article.html</Option>
                        </Select>
                    </Form.Item>

                </Form>
            </Col>
        </Row>
    );
}

export default Tpl