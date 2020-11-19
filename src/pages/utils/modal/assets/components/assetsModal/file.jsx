import React from 'react';
import { Card } from 'antd';
import { FileTwoTone } from '@ant-design/icons';

const Index = ({ current,multiple, index, item, onClick }) => {
  let active = ''
  if (multiple) {
    active = current[index] === 1 ? 'active' : ''
  } else {
    active = current === index ? 'active' : ''
  }

  return (
    <Card
      className={`assets-thumbnail ${active}`}
      onClick={onClick}
      cover={<FileTwoTone style={{ fontSize: "4rem" }} />}
      hoverable="true"
    >
      <div className="title">{item.remark_name}</div>
    </Card>
  )

}

export default Index;
