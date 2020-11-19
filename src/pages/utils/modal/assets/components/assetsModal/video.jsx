import React from 'react';
import { Card} from 'antd';
import { PlayCircleTwoTone } from '@ant-design/icons';

const Index = ({current,index,item,onClick}) => (

  <Card
    className={`assets-thumbnail ${current === index ? 'active' : ''}`}
    onClick={onClick}
    cover={<PlayCircleTwoTone style={{ fontSize: "4rem" }} />}
    hoverable="true"
  >
    <div className="title">{item.remark_name}</div>
  </Card>
)

export default Index;
