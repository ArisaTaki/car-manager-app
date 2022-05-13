import React, { useEffect, useState } from 'react';
import className from 'classnames/bind';
import {
  Avatar, Dropdown, Layout, Menu,
} from 'antd';
import {
  AntDesignOutlined,
  HomeOutlined,
  BarsOutlined,
  QuestionCircleOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  SettingOutlined,
  ReconciliationOutlined,
  ProfileOutlined,
  SmileOutlined,
  TransactionOutlined,
  WhatsAppOutlined,
  InsertRowAboveOutlined,
  DollarOutlined, TeamOutlined,
  BlockOutlined, CalculatorOutlined, FundOutlined, SlidersOutlined,
} from '@ant-design/icons';
import { useHistory, Link } from 'react-router-dom';
import styles from './styles.module.scss';
import {
  deleteUser, getUser,
} from '@/utils/storageUtils';
import routerPath from '@/router/router-path';
import { UserTokenKeyInfo } from '@/services/entities';

const cx = className.bind(styles);

const { Header, Sider, Content } = Layout;

const { SubMenu } = Menu;

export interface BasicLayoutProps {
  example?: string
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  const history = useHistory();
  const [userInfo, setUserInfo] = useState<UserTokenKeyInfo>();
  const [collapsed, setCollapsed] = useState<boolean>(false);

  useEffect(() => {
    setUserInfo(getUser());
  }, []);

  const showUserMenu = () => (
    <Menu>
      <Menu.Item key="1">
        <div onClick={() => {}}>
          {userInfo?.userTitle}
        </div>
      </Menu.Item>
      <Menu.Item key="2">
        <div onClick={() => {
          deleteUser();
          history.replace(routerPath.Login);
        }}
        >
          退出登录
        </div>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className={cx('main')}>
      <Sider trigger={null} collapsible collapsed={collapsed} className={cx('aside')}>
        <div className={cx('logo')}>
          <i />
          <span className={cx({ collapsed })}>汽车维修平台</span>
        </div>
        <Menu theme="light" mode="inline" defaultSelectedKeys={[history.location.pathname]}>
          <Menu.Item key={routerPath.Home} icon={<HomeOutlined />}>
            <Link to={routerPath.Home}>首页</Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<BarsOutlined />} title="售后服务管理">
            {(userInfo?.type !== 1 && userInfo?.type !== 4) ? (
              <Menu.Item key={routerPath.CarFixForm} icon={<SettingOutlined />}>
                <Link to={routerPath.CarFixForm}>汽车维修</Link>
              </Menu.Item>
            ) : null}
            <Menu.Item key={routerPath.ServiceDelegation} icon={<ReconciliationOutlined />}>
              <Link to={routerPath.ServiceDelegation}>服务委托</Link>
            </Menu.Item>
            <Menu.Item key={routerPath.ServiceReport} icon={<ProfileOutlined />}>
              <Link to={routerPath.ServiceReport}>服务报告</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<CalculatorOutlined />} title="服务质量管理">
            <Menu.Item key={routerPath.QualityClaims} icon={<TransactionOutlined />}>
              <Link to={routerPath.QualityClaims}>质量索赔</Link>
            </Menu.Item>
            <Menu.Item key={routerPath.ServiceCheck} icon={<WhatsAppOutlined />}>
              <Link to={routerPath.ServiceCheck}>服务稽查</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" icon={<FundOutlined />} title="统计分析模块">
            <Menu.Item key={routerPath.InfoReport} icon={<InsertRowAboveOutlined />}>
              <Link to={routerPath.InfoReport}>信息报表</Link>
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub4" icon={<SlidersOutlined />} title="系统管理模块">
            <Menu.Item key={routerPath.Quotation} icon={<DollarOutlined />}>
              <Link to={routerPath.Quotation}>报价参数管理</Link>
            </Menu.Item>
            <Menu.Item key={routerPath.User} icon={<TeamOutlined />}>
              <Link to={routerPath.User}>用户管理</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key={routerPath.Question} icon={<QuestionCircleOutlined />}>
            <Link to={routerPath.Question}>疑问解答</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className={cx('site-layout')}>
        <Header className={cx('site-layout-background', 'header')} style={{ padding: 0 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: cx('trigger'),
            onClick: () => { setCollapsed(!collapsed); },
          })}
          <div className={cx('avatar')}>
            <Dropdown overlay={showUserMenu} placement="bottomCenter" arrow>
              <Avatar
                className={cx('avatar-img')}
                icon={<AntDesignOutlined />}
              />
            </Dropdown>
            <div className={cx('user-info')}>
              <div className={cx('name')}>{userInfo?.userTitle}</div>
            </div>
          </div>
        </Header>
        <Content
          className={cx('site-layout-background')}
          style={{
            margin: '24px 16px',
            padding: '24px 24px 14px 24px',
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
