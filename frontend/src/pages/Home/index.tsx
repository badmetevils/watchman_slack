import * as React from 'react';
import { Row, Col, Select, DatePicker, Button, Divider, Table, Space, Modal, Badge } from 'antd';
import { Moment } from 'moment';
import * as moment from 'moment';
import http from '../../utilities/HttpService/HttpService';
import style from './home.module.scss';
import Loader from '../../components/Loader';
const LogsModal = React.lazy(() => import('./LogsModal'));

interface IUserList {
  slackID: string;
  name: string;
}

const Home = () => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Date',
      dataIndex: 'date',
      width: '150px'
    },
    {
      title: 'Away in Working hour (in minutes)',
      dataIndex: 'awayInWorkingHours',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Badge color="#f40" text={record.awayInWorkingHours} />
        </Space>
      )
    },
    {
      title: 'Active in Non-Working hour (in minutes)',
      dataIndex: 'activeInNonWorkingHours',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Badge color="#87d068" text={record.activeInNonWorkingHours} />
        </Space>
      )
    },
    {
      width: '120px',
      title: 'Action',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button onClick={viewDetails(record)}>view logs </Button>
        </Space>
      )
    }
  ];

  const defaultStartDate = moment().subtract(90, 'days').format('YYYY-MM-DD');
  const defaultEndDate = moment().format('YYYY-MM-DD');

  const endpoint = `${APP_ENV.apiHost.base_url}${APP_ENV.apiHost.version}`;
  const [isLoading, setIsLoading] = React.useState(true);
  const [users, setUsers] = React.useState<IUserList[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<string>('');
  const [logs, setLogs] = React.useState([]);
  const [logsDetails, setLogDetails] = React.useState<{ data: any[]; user: any }>(null);
  const [date, setDate] = React.useState<{ startDate: string; endDate: string }>({
    startDate: defaultStartDate,
    endDate: defaultEndDate
  });
  const init = async () => {
    try {
      const list = await http.request<{ data: IUserList[]; status: 'SUCCESS' | 'FAILURE' }>(`${endpoint}/users/list`, {
        method: 'GET'
      });
      if (list.status === 'SUCCESS') {
        setUsers(list.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      let body: any = {
        toDate: date.endDate,
        fromDate: date.startDate,
        limit: 100
      };
      if (!!selectedUser) {
        body['id'] = selectedUser;
      }
      const list: any = await http.request<{ data: any[]; status: 'SUCCESS' | 'FAILURE' }>(
        `${endpoint}/users/get_time_log`,
        {
          method: 'POST',
          body: JSON.stringify(body)
        }
      );

      if (list.status === 'SUCCESS') {
        const data = list.data.map((d: any, i: number) => {
          return {
            id: d.slackID,
            key: i + 1,
            name: d.user.name,
            date: d.date,
            activeInNonWorkingHours: d.activeInNonWorkingHours,
            awayInWorkingHours: d.awayInWorkingHours
          };
        });
        setLogs(data);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  const viewDetails = (record: any) => async () => {
    const logs: any = await http.request<{ data: any[]; status: 'SUCCESS' | 'FAILURE' }>(
      `${endpoint}/users/get_activity_log?id=${record.id}&date=${record.date}`,
      {
        method: 'GET'
      }
    );
    if (logs.status === 'SUCCESS') {
      console.log(record);
      setLogDetails({ data: logs.data, user: record });
    }
  };

  React.useEffect(() => {
    init();
    fetchData();
  }, []);

  function disabledDate(current: Moment) {
    // Can not select days before today and today
    return (current && current > moment().endOf('day')) || current < moment().subtract(90, 'days');
  }

  const onSelectDate = (_date: Moment[]) => {
    setDate({
      startDate: _date[0].format('YYYY-MM-DD').toString(),
      endDate: _date[1].format('YYYY-MM-DD').toString()
    });
  };

  return (
    <div className={style.main}>
      <Row gutter={[16, 16]}>
        <Col sm={24} md={8} xs={24}>
          <Select
            className="w-100"
            size="large"
            onChange={(value: string) => {
              setSelectedUser(value);
            }}
            allowClear
            placeholder="Select User"
          >
            {users.map((u, i) => {
              return (
                <Select.Option value={u.slackID} key={i} title={'slack users'}>
                  {u.name}
                </Select.Option>
              );
            })}
          </Select>
        </Col>
        <Col sm={18} md={12} xs={24}>
          <DatePicker.RangePicker
            className="w-100"
            disabledDate={disabledDate}
            size="large"
            onChange={onSelectDate}
            value={[moment(date.startDate), moment(date.endDate)]}
          >
            {' '}
          </DatePicker.RangePicker>
        </Col>
        <Col sm={6} md={4} xs={24}>
          <Button type="primary" size="large" block onClick={fetchData}>
            Filter
          </Button>
        </Col>
      </Row>
      <Divider></Divider>
      {isLoading ? (
        <Loader />
      ) : (
        <React.Fragment>
          <Row gutter={16}>
            <Col>
              <Table
                columns={columns}
                dataSource={logs}
                pagination={{ pageSize: 25, responsive: true, showSizeChanger: false, position: ['bottomCenter'] }}
                scroll={{ y: 680 }}
                bordered
              />
            </Col>
          </Row>
          {!!logsDetails ? (
            <Modal
              centered
              maskClosable={false}
              visible={true}
              onCancel={() => setLogDetails(null)}
              footer={null}
              width={380}
              title={`Detail for ${logsDetails?.user?.name} for ${logsDetails?.user?.date}`}
            >
              <React.Suspense fallback={<Loader />}>
                <LogsModal data={logsDetails.data} />
              </React.Suspense>
            </Modal>
          ) : null}
        </React.Fragment>
      )}
    </div>
  );
};

export default Home;
