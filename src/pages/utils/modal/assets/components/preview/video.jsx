import React, { useEffect, useState, useRef } from 'react';
import { Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import '@/assets/css/style.css';

const Audio = (props) => {
    const { visible, setVisible, data, index } = props;

    const [src, setSrc] = useState('');

    const videoRef = useRef();

    useEffect(() => {
        if (data.length > 0) {
            setSrc(data[index].prev_path);
        }
    }, [data, index]);

    return (
        <Modal
            visible={visible}
            centered
            footer={null}
            maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            wrapClassName="modal-audio"
            closable={false}
            maskClosable={false}
        >
            <div className="d-flex justify-content-center align-items-center">
                <video style={{ outline: 'none' }} controls autoPlay src={src} ref={videoRef}>
                    <track kind="captions" />
                </video>
                <CloseOutlined
                    onClick={() => {
                        setVisible(false);
                        videoRef.current.pause();
                    }}
                    style={{
                        color: '#fff',
                        marginLeft: '0.75rem',
                        fontSize: '1rem',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderRadius: '50%',
                        padding: '0.5rem',
                    }}
                />
            </div>
        </Modal>
    );
};

export default Audio;
