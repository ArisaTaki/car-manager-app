import React, { createRef, useState } from 'react';
import {
  Button, Form, Input,
  FormInstance, message, Radio, RadioChangeEvent,
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './style.module.scss';
import routerPath from '@/router/router-path';
import { ServicesApi } from '@/services/services-api';
import { deletePath, getPath, saveUser } from '@/utils/storageUtils';
import { formatRole } from '@/utils/Role';
import getHistory from '@/utils/getHistory';

const cx = classNames.bind(styles);

const Login: React.FC = () => {
  const history = getHistory;
  const [type, setType] = useState(0);

  const { login } = ServicesApi;
  const [form] = Form.useForm();
  const formRef = createRef<FormInstance>();

  const onChange = (e:RadioChangeEvent) => {
    setType(e.target.value);
  };

  const handleToHomePage = async () => {
    try {
      const { userName, passWord } = form.getFieldsValue();
      const checkResult = await formRef.current?.validateFields();
      login({ userName, password: passWord, type }).then((res) => {
        const { data } = res;
        saveUser(data);
        message.success(`欢迎你，${data.userTitle}`);
        history.push(getPath() || routerPath.Home);
        deletePath();
      }).catch((err) => {
        // TODO login error events
      });
    } catch (err) {
      message.warning('账号和密码不能为空');
    }
  };
  const renderLoginForm = () => (
    <Form
      ref={formRef}
      form={form}
      name="normal_login"
      className="login-form"
      initialValues={{ remember: true }}
    >
      <Form.Item
        name="userName"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="passWord"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <div className={cx('buttons')}>
          <Radio.Group onChange={onChange} value={type}>
            <Radio value={0}>{formatRole(0)}</Radio>
            <Radio value={1}>{formatRole(1)}</Radio>
            <Radio value={2}>{formatRole(2)}</Radio>
          </Radio.Group>
          <Button
            type="primary"
            className={cx('login')}
            onClick={handleToHomePage}
          >
            登录
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
  return (
    <div className={cx('content')}>
      <div className={cx('main')}>
        { renderLoginForm() }
      </div>
    </div>
  );
};

export default Login;
