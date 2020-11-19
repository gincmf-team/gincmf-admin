import React, { useEffect, useState, useRef } from 'react';
import {
  Input, Button, Row, Col,
} from 'antd';
import ModalImages from '@/pages/utils/modal/assets/components/preview/images';
import AssetsModal from '@/pages/utils/modal/assets';
import { CloudUploadOutlined } from '@ant-design/icons';

import styles from "./form.less"
// import { Editor } from '@tinymce/tinymce-react';
/* eslint-disable */
/**
 * 自定义图片上传控件
 * data [ file_path,prev_path ]
 */
const ThumbnailInput = (props) => {

    const { value = '', onChange, path } = props

    const assetsRef = useRef()

    const [prevPath,setPrevPath] = useState(path)

    useEffect( () => {
        setPrevPath(path)
        console.log(path)
    },[path])

    const openImageModal = () => {
        assetsRef.current.modalVisible(true);
    };

    const onImageOk = (data) => {
        if(onChange) {
            onChange(data.file_path)
        }
        setPrevPath(data.prev_path)
    };

    return (
        <>
            <AssetsModal ref={assetsRef} onOk={onImageOk} />
            <Input value={value} style={{ display: 'none' }} />
            {prevPath === '' ? (
                <div className="upload" onClick={openImageModal}>
                    <CloudUploadOutlined style={{ fontSize: '1.5rem' }} />
                    <div className="ant-upload-text">上传图片</div>
                </div>
            ) : (
                    <div
                        style={{ width: '200px', border: '1px solid #d9d9d9' }}
                        className="thumbnail-preview" onClick={openImageModal}
                    >
                        <img src={prevPath} alt="" />
                    </div>
                )}
        </>
    );
};

// 图片多选组件
const ThumbMultInput = ({ value = "[]", onChange }) => {

    let json = "[]"
    try {
        json = JSON.parse(value)
    } catch (error) {
        json = []
    }

    const [images, setImages] = useState(json)

    useEffect(() => {
        setImages(json)
    }, [value])


    const [multiple, setMultiple] = useState(false)
    const assetsRef = useRef()

    const [visible, setVisible] = useState(false);
    const [index, setIndex] = useState(0);

    const [actionType, setActionType] = useState(null)
    const [editIndex, setEditIndex] = useState(0)

    const openImageModal = () => {
        setMultiple(true)
        assetsRef.current.modalVisible(true)
        setActionType("add");
    }

    const openPreview = (i) => {
        setVisible(true);
        setIndex(i);
    };

    const onAssetsModalOk = (data = []) => {
        const temp = [...images]

        switch (actionType) {
            case "add":
                data.forEach((item) => {
                    temp.push(item)
                })
                break;
            case "edit":
                temp[editIndex] = data
                break;
            case "delete":
                temp.splice(data, 1)
                break;
            default:
                break;
        }
        setImages(temp)
        onChange(JSON.stringify(temp))
    }

    const handleAssetsEdit = (i, e) => {
        e.stopPropagation();
        setEditIndex(i)
        setMultiple(false)
        setActionType("edit")
        assetsRef.current.modalVisible(true)
    }

    // 删除图片
    const handleAssetsDelete = (i, e) => {
        e.stopPropagation();
        setEditIndex(i)
        setActionType("delete")
        onAssetsModalOk()
    }

    return (
        <>
            <ModalImages data={images} index={index} visible={visible} setVisible={setVisible} />
            <AssetsModal multiple={multiple} ref={assetsRef} onOk={onAssetsModalOk} />
            <div>
                <Input value={JSON.stringify(images)} style={{ display: "none" }} />
                <Row className={styles.multipleImage} gutter={[24, 24]}>
                    {images.map((v, i) => (
                        <Col key={`image-${i}`} span={6}>
                            <div className={`${styles.imgWrap} img-wrap`} onClick={() => openPreview(i)}>
                                <img src={v.prev_path} alt="" />
                                <div className={`${styles.handleBtn} d-flex`}>
                                    <div onClick={(e) => { handleAssetsEdit(i, e) }} className={`flex-1 ${styles.btnItem}`}>替换</div>
                                    <div className={styles.vLine} />
                                    <div onClick={(e) => { handleAssetsDelete(i, e) }} className={`flex-1 ${styles.btnItem}`}>删除</div>
                                </div>
                            </div>
                        </Col>
                    ))}
                    <Col span={6}>
                        <div className="upload" onClick={() => { openImageModal() }}>
                            <CloudUploadOutlined style={{ fontSize: "1.5rem" }} />
                            <div className="ant-upload-text">上传图片</div>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    )
}

/**
 * 自定义音频上传控件
 * data [ file_path,prev_path ]
 */
const AudioInput = ({ value = '', data = {}, onChange, onClick }) => {
    useEffect(() => {
        if (Object.keys(data).length > 0) {
            onChange(data.file_path);
        }
    }, [data]);
    return (
        <>
            <Input value={value} style={{ display: 'none' }} />
            {Object.keys(data).length === 0 ? (
                <div className="upload" onClick={onClick}>
                    <CloudUploadOutlined style={{ fontSize: '1.5rem' }} />
                    <div className="ant-upload-text">Upload</div>
                </div>
            ) : (
                    <>
                        <div className="audio-preview d-flex align-items-center">
                            <audio className="mr-2" controls src={data.prev_path}>
                                <track kind="captions" />
                            </audio>

                            <Button onClick={onClick} type="primary" icon={<CloudUploadOutlined />}>
                                上传
                        </Button>
                        </div>
                    </>
                )}
        </>
    );
};
/**
 * 自定义视频上传控件
 * data [ file_path,prev_path ]
 */
const VideoInput = ({ value = '', data = {}, onChange, onClick }) => {
    useEffect(() => {
        if (Object.keys(data).length > 0) {
            onChange(data.file_path);
        }
    }, [data]);
    return (
        <>
            <Input value={value} style={{ display: 'none' }} />
            {Object.keys(data).length === 0 ? (
                <div className="upload" onClick={onClick}>
                    <CloudUploadOutlined style={{ fontSize: '1.5rem' }} />
                    <div className="ant-upload-text">上传视频</div>
                </div>
            ) : (
                    <>
                        <div className="audio-preview d-flex align-items-center">
                            <video
                                style={{ outline: 'none', width: '100%' }}
                                className="mr-2"
                                controls
                                src={data.prev_path}
                            >
                                <track kind="captions" />
                            </video>

                            <Button onClick={onClick} type="primary" icon={<CloudUploadOutlined />}>
                                上传
                        </Button>
                        </div>
                    </>
                )}
        </>
    );
};

/**
 * 自定义图文编辑器
 */
const EditorInput = ({ value = '', onChange, onInit }) => {
    const triggerChange = (changedValue) => {
        if (onChange) {
            onChange(changedValue);
        }
    };

    const triggerInit = () => {
        if (onInit) {
            onInit();
        }
    };

    return (
        <>
            <Editor
                init={{
                    height: 200,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image',
                        'charmap print preview anchor help',
                        'searchreplace code',
                        'insertdatetime media table advtable wordcount fullscreen',
                    ],
                    toolbar:
                        'insertfile a11ycheck undo redo | formatselect bold italic | forecolor backcolor | template codesample | alignleft aligncenter alignright alignjustify | bullist numlist | table tableinsertdialog tablecellprops tableprops | link image tinydrive | preview code fullscreen',
                    language: 'zh_CN',
                }}
                value={value}
                onChange={(e) => {
                    triggerChange(e.target.getContent());
                }}
                onInit={triggerInit}
            />
        </>
    );
};

export { ThumbnailInput, ThumbMultInput, AudioInput, VideoInput, EditorInput };
