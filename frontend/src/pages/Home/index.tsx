import * as React from 'react';
import { Row, Col, Select, DatePicker, Button, Divider, Table, Modal, Typography, Card, Popover } from 'antd';
import { Moment } from 'moment';
import * as moment from 'moment';
import http from '../../utilities/HttpService/HttpService';
import style from './home.module.scss';
import Loader from '../../components/Loader';
import { minutesToHoursAndMin } from '../../utilities/helpers';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import columns from './column';
const LogsModal = React.lazy(() => import('./LogsModal'));

interface IUserList {
  slackID: string;
  name: string;
}

const Home = () => {
  const defaultStartDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  const defaultEndDate = moment().format('YYYY-MM-DD');

  const endpoint = `${APP_ENV.apiHost.base_url}${APP_ENV.apiHost.version}`;
  const [isLoading, setIsLoading] = React.useState(true);
  const [users, setUsers] = React.useState<IUserList[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<string>('');
  const [logs, setLogs] = React.useState<{ data: any[]; sum: any }>({
    data: [],
    sum: {}
  });
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
      const list: any = await http.request<{ data: any; status: 'SUCCESS' | 'FAILURE' }>(
        `${endpoint}/users/get_time_log`,
        {
          method: 'POST',
          body: JSON.stringify(body)
        }
      );

      if (list.status === 'SUCCESS') {
        const data = list.data.list.map((d: any, i: number) => {
          // const activeInWorkingHours = 0;
          // const now = moment().clone();
          // const _startHours = parseFloat(`${SETTINGS.START_TIME}` || '10');
          // const _endHours = parseFloat(`${SETTINGS.END_TIME}` || '19');
          // const _currentHour = moment.duration(now.format('H:mm').toString()).abs().asHours();
          // const _today12 = moment().startOf('day');
          // const _startWorkTime = _today12.clone().add(_startHours, 'hour');
          // const _endWorkTime = _today12.clone().add(_endHours, 'hour');
          // if (_currentHour >= _startHours && _currentHour <= _endHours) {
          //   const minutesElapsed = moment.duration(_startWorkTime.format("H:mm").toString()).abs().asMinutes();

          // }

          return {
            id: d.slackID,
            key: i + 1,
            name: d.user.name,
            date: d.date,
            activeInNonWorkingHours: minutesToHoursAndMin(d.activeInNonWorkingHours),
            awayInWorkingHours: minutesToHoursAndMin(d.awayInWorkingHours)
          };
        });
        setLogs({ data, sum: list.data.aggregation });
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
  React.useEffect(() => {
    if (!!selectedUser) {
      fetchData();
    }
  }, [selectedUser]);

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

  const renderCards = () => {
    const totalWorkDays = moment(date.endDate).diff(moment(date.startDate), 'days');
    const hoursPerDay = SETTINGS.END_TIME - SETTINGS.START_TIME;
    const minPerDays = hoursPerDay * 60;
    const totalWorkHours = minPerDays * totalWorkDays;
    const totalActiveHours = totalWorkHours - logs.sum.awayInWorkingHours;
    return (
      <Row gutter={16}>
        <Col span={12}>
          <Card title={`Hour Information  (from ${date.startDate} to ${date.endDate})`} bordered={true}>
            <p>
              Active Time in Non Work Hours:{' '}
              <span className='success'>{minutesToHoursAndMin(logs.sum.activeInNonWorkingHours)}</span>
            </p>
            <p>
              Active Time in Work Hours: <span className='success'>{minutesToHoursAndMin(totalActiveHours)}</span> /{' '}
              <span className='danger'>{minutesToHoursAndMin(totalWorkHours)}</span>
            </p>

            <p>
              Total Active hours:{' '}
              <span className='success'>
                {minutesToHoursAndMin(totalActiveHours + (logs.sum.activeInNonWorkingHours || 0))}
              </span>
            </p>
          </Card>
        </Col>
        <Col span={12}>
          <Card title='Summary' bordered={true}>
            <p>Total Employees : {users.length}</p>
            <p>Work Hours per Day : {hoursPerDay} hours </p>
            <p>
              Total Work Hours : {minutesToHoursAndMin(totalWorkHours)} ({totalWorkHours} minutes)
              <Popover
                content={() => {
                  return (
                    <div>
                      <p>Formula : </p>
                      <p>Total Days x Hours per days</p>
                      <p>from Date : {date.startDate}</p>
                      <p>end Date : {date.endDate}</p>
                      <p>Total Days : {totalWorkDays}</p>
                    </div>
                  );
                }}
              >
                <span>
                  {'  '}
                  <ExclamationCircleOutlined></ExclamationCircleOutlined>
                </span>
              </Popover>
            </p>
            <p></p>
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <div className={style.main}>
      <Row gutter={[16, 16]}>
        <Col sm={24} md={8} xs={24}>
          <Select
            className='w-100'
            size='large'
            onChange={(value: string) => {
              setSelectedUser(value);
            }}
            allowClear
            placeholder='Select User'
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
            className='w-100'
            disabledDate={disabledDate}
            size='large'
            onChange={onSelectDate}
            value={[moment(date.startDate), moment(date.endDate)]}
          >
            {' '}
          </DatePicker.RangePicker>
        </Col>
        <Col sm={6} md={4} xs={24}>
          <Button type='primary' size='large' block onClick={fetchData}>
            Filter
          </Button>
        </Col>
      </Row>
      <Divider></Divider>
      {isLoading ? (
        <Loader />
      ) : (
        <React.Fragment>
          <Row gutter={16} justify='center'>
            <Typography.Title level={2}>
              Working hours are from {SETTINGS.START_TIME}:00 to {SETTINGS.END_TIME}:00
            </Typography.Title>
          </Row>
          <Row gutter={20} justify='center'>
            <Typography.Title level={4}>
              a penalty off 1800 seconds (30 minutes) when away in working hours
            </Typography.Title>
          </Row>
          {!!selectedUser && !isLoading && logs.data.length !== 0 ? (
            <div style={{ background: '#eee', padding: '2rem' }}>{renderCards()}</div>
          ) : null}

          <Row gutter={16}>
            <Col>
              <Table
                columns={columns(viewDetails)}
                dataSource={logs.data}
                pagination={{ pageSize: 25, responsive: true, showSizeChanger: false, position: ['bottomCenter'] }}
                scroll={{ y: 680 }}
                bordered
                footer={() => {
                  return (
                    <React.Fragment>
                      <Row gutter={16} justify='space-around'>
                        Total Away time in Working Hours:
                        <p className='danger'>
                          <b>{minutesToHoursAndMin(logs.sum.awayInWorkingHours)}</b>
                        </p>
                        Total Active Time in Non Working Hours:
                        <p className='success'>
                          <b>{minutesToHoursAndMin(logs.sum.activeInNonWorkingHours)}</b>
                        </p>
                      </Row>
                    </React.Fragment>
                  );
                }}
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
              width={680}
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
