import { Button, Badge, Space, Tag } from 'antd';
import * as React from 'react';
import { CaretUpOutlined } from '@ant-design/icons';
const columns = (viewDetails: (data: string) => () => void) => {
  return [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '250px',
      render: (text: any, record: any) => (
        <Space size='middle'>
          {record.name}
          {record.penaltyCount ? (
            <Tag icon={<CaretUpOutlined />} color='error'>
              + {record.penaltyCount} penalties
            </Tag>
          ) : null}
        </Space>
      )
    },
    {
      title: 'Date',
      dataIndex: 'date',
      width: '150px'
    },
    {
      title: 'Away in Working hour ',
      dataIndex: 'awayInWorkingHours',
      render: (text: any, record: any) => (
        <Space size='middle'>
          <Badge color='#f40' text={record.awayInWorkingHours} />
        </Space>
      )
    },
    {
      title: (
        <p style={{ textAlign: 'center' }}>
          Away in Working hour <br />
          <b>(NO PENALTY)</b>
        </p>
      ),
      dataIndex: 'awayInWorkingHoursNoPenalty',
      render: (text: any, record: any) => (
        <Space size='middle'>
          <Badge color='#f40' text={record.awayInWorkingHoursNoPenalty} />
        </Space>
      )
    },
    {
      title: 'Active in Non-Working hour',
      dataIndex: 'activeInNonWorkingHours',
      render: (text: any, record: any) => (
        <Space size='middle'>
          <Badge color='#87d068' text={record.activeInNonWorkingHours} />
        </Space>
      )
    },
    {
      width: '120px',
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size='middle'>
          <Button onClick={viewDetails(record)}>view logs </Button>
        </Space>
      )
    }
  ];
};
export default columns;
