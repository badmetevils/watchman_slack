import * as React from 'react';
import { Table, Space, Tag } from 'antd';
import * as moment from 'moment';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

interface ILogsModal {
  data: any[];
}

const LogsModal: React.SFC<ILogsModal> = props => {
  const columns = [
    {
      title: 'Time',
      dataIndex: 'timestamp'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text: any, record: any) => (
        <Space size="middle">
          {record.status == 'ACTIVE' ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              ACTIVE
            </Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} color="error">
              AWAY
            </Tag>
          )}
        </Space>
      )
    }
  ];

  if (!props.data) {
    return null;
  }

  const data = props.data.map(d => {
    return {
      key: d.slackID + d.id,
      timestamp: moment(d.timestamp).format('hh:mm:ss A').toString(),
      status: d.status
    };
  });

  return <Table columns={columns} dataSource={data} pagination={false} bordered />;
};

export default LogsModal;
