import React, { useState, useEffect, useReducer } from 'react';
import { PageHeader, Button, List, Upload, message } from 'antd';
import { getAssets } from '@/services/assets';
import Image from './image';
import Audio from './audio';
import Video from './video';
import File from './file';
import '@/assets/css/style.css';
import './style.css';

const Index = ({ onOk, visible, type, multiple }) => {
    const [total, setTotal] = useState(0);
    const [data, setData] = useState([]);
    const [current, setCurrent] = useState([]); // modal选中

    // 分页current
    const [pageCurrent, setPageCurrent] = useState(1);

    // modal选中（多选）
    const [dataCurrent, dispath] = useReducer((state, action) => {
        let temp = [...state];
        const i = action.index;

        switch (action.type) {
            case 'add':
                temp[i] = temp[i] === 1 ? 0 : 1;
                break;
            default:
                temp = [];
                break;
        }

        if (multiple === true) {
            setCurrent(temp);
        }

        return temp;
    }, []);

    useEffect(() => {
        if (multiple === true) {
            const fileList = [];
            dataCurrent.forEach((v, ti) => {
                if (v) {
                    fileList.push(data[ti]);
                }
            });

            if (onOk) {
                onOk(fileList);
            }
        }
    }, [current]);

    const [filelist, setFilelist] = useState([]);

    const tempTitle = {
        image: '图片',
        audio: '音频',
        video: '视频',
        file: '附件',
    };
    const tempType = { image: 0, audio: 1, video: 2, file: 3 };

    useEffect(() => {
        if (!visible) {
            setPageCurrent(1);
            setCurrent('');
            dispath({
                type: 'init',
            });
        }
    }, [visible]);

    // 获取资源数据列表
    const getData = async (params) => {
        const temp = { ...params, type: tempType[type] };
        const result = await getAssets(temp);

        let slideData = [];
        if (result.code === 1) {
            slideData = result.data.data;
            setTotal(result.data.total);
            let tempData = [];
            slideData.forEach((element) => {
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
        return { data: slideData };
    };

    let token = localStorage.getItem('token');
    if (token) {
        token = JSON.parse(token);
    }
    const uploadProps = {
        name: 'file[]',
        multiple: true,
        action: '/api/admin/assets',
        data: { type: tempType[type] },
        headers: {
            Authorization: `Bearer ${token.access_token}`,
        },
        onChange({ file, fileList }) {
            let temp = [...fileList];
            setFilelist(temp);

            if (file.status === 'done') {
                if (file.response.code === 1) {
                    getData({ current: pageCurrent });
                    message.success(file.response.msg);
                } else {
                    message.error(file.response.msg);
                }
                temp = fileList.slice(0, 0);
                setFilelist(temp);
            }
        },
    };

    // 首次加载读取数据
    useEffect(() => {
        getData({ current: pageCurrent });
    }, [type, pageCurrent]);

    const openChoose = (file) => {
        if (onOk) {
            onOk(file);
        }
    };

    return (
        <>
            <PageHeader style={{ padding: 0 }} title={`${tempTitle[type]}（共${total}条）`}>
                <div style={{ textAlign: 'right', marginBottom: '15px' }}>
                    <Upload key="upload" {...uploadProps} fileList={filelist}>
                        <Button type="primary">上传</Button>
                    </Upload>
                </div>

                <List
                    grid={{ gutter: 16, column: 5 }}
                    dataSource={data}
                    pagination={{
                        position: 'bottom',
                        current: pageCurrent,
                        total,
                        onChange: (page) => {
                            setPageCurrent(page);
                            window.console.log(page);
                        },
                        pageSize: 10,
                    }}
                    renderItem={(item, index) => (
                        <List.Item>
                            {type === 'image' && (
                                <Image
                                    multiple={multiple}
                                    current={current}
                                    index={index}
                                    item={item}
                                    onClick={() => {
                                        if (multiple === true) {
                                            dispath({
                                                type: 'add',
                                                index,
                                            });
                                        } else {
                                            openChoose(item);
                                            setCurrent(index);
                                        }
                                    }}
                                />
                            )}

                            {type === 'audio' && (
                                <Audio
                                    multiple={multiple}
                                    current={current}
                                    index={index}
                                    item={item}
                                    onClick={() => {
                                        if (multiple === true) {
                                            dispath({
                                                type: 'add',
                                                index,
                                            });
                                        } else {
                                            openChoose(item);
                                            setCurrent(index);
                                        }
                                    }}
                                />
                            )}

                            {type === 'video' && (
                                <Video
                                    multiple={multiple}
                                    current={current}
                                    index={index}
                                    item={item}
                                    onClick={() => {
                                        if (multiple === true) {
                                            dispath({
                                                type: 'add',
                                                index,
                                            });
                                        } else {
                                            openChoose(item);
                                            setCurrent(index);
                                        }
                                    }}
                                />
                            )}

                            {type === 'file' && (
                                <File
                                    multiple={multiple}
                                    current={current}
                                    index={index}
                                    item={item}
                                    onClick={() => {
                                        if (multiple === true) {
                                            dispath({
                                                type: 'add',
                                                index,
                                            });
                                        } else {
                                            openChoose(item);
                                            setCurrent(index);
                                        }
                                    }}
                                />
                            )}
                        </List.Item>
                    )}
                />
            </PageHeader>
        </>
    );
};

export default Index;
