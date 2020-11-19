import React from 'react';
import { Card } from 'antd';

const Index = ({ current, multiple, index, item, onClick }) => {
    let active = '';
    if (multiple) {
        active = current[index] === 1 ? 'active' : '';
    } else {
        active = current === index ? 'active' : '';
    }

    return (
        <Card
            className={`assets-thumbnail ${active}`}
            onClick={onClick}
            cover={<img alt={item.remark_name} src={item.prev_path} />}
            hoverable="true"
        >
            <div className="title">{item.remark_name}</div>
        </Card>
    );
};
export default Index;
