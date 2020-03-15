/* eslint-disable prefer-template */
/* eslint jsx-a11y/no-noninteractive-element-interactions:0 */
import React, { PureComponent } from 'react';
import { Icon, Input, Select, Dialog } from '@icedesign/base';
import Layout from '@icedesign/layout';
import StyledMenu, {
  Item as MenuItem,
  SubMenu,
  Divider
} from '@icedesign/styled-menu';

import FoundationSymbol from 'foundation-symbol';
import { Button, Balloon } from '@alifd/next';
import cookie from 'react-cookies';
import axios from 'axios';
import { createHashHistory } from 'history';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import * as unichain from 'unichain-web3';
import { headerMenuConfig } from '../../menuConfig';
import Logo from '../Logo';
import * as utils from '../../utils/utils';
import * as constant from '../../utils/constant';
import { T, setLang } from '../../utils/lang';
import './scss/base.scss';

export const history = createHashHistory();

export default class Header extends PureComponent {
  constructor(props) {
    super(props);
    const nodeInfoCookie = cookie.load('nodeInfo');
    const defaultLang = cookie.load('defaultLang');

    let nodeInfo = nodeInfoCookie;
    if (utils.isEmptyObj(nodeInfo)) {
      nodeInfo = constant.testNetRPCAddr;
    }

    this.state = {
      current: null,
      nodeConfigVisible: false,
      nodeInfo,
      chainId: 0,
      customNodeDisabled: true,
      languages: [{value: 'ch', label:'中文'}, {value: 'en', label:'English'}],
      defaultLang: (defaultLang == null || defaultLang == 'ch') ? 'ch' : 'en',
      nodes: [{value: constant.mainNetRPCHttpsAddr, label:T('主网：') + constant.mainNetRPCHttpsAddr}, 
              {value: constant.testNetRPCHttpsAddr1, label:T('测试网1：') + constant.testNetRPCHttpsAddr1}, 
              {value: constant.testNetRPCHttpsAddr2, label:T('测试网2：') + constant.testNetRPCHttpsAddr2},
              {value: constant.LocalRPCAddr, label:T('本地节点：') + constant.LocalRPCAddr}, 
              {value: 'others', label: T('自定义')}],
    };
    setLang(this.state.defaultLang);
  }
  componentDidMount = () => {
    unichain.uni.getChainConfig().then(chainConfig => {
      this.setState({chainId: chainConfig.chainId});
    })
  }
  openSetDialog = () => {
    this.setState({ nodeConfigVisible: true });
  }
  handleNodeInfoChange = (v) => {
    this.state.nodeInfo = v;
  }
  onChangeLanguage = (v) => {
    cookie.save('defaultLang', v, {path: '/', maxAge: 3600 * 24 * 360});
    setLang(v);
    history.push('/');
  }
  onChangeNode = (type, value) => {
    cookie.save('defaultNode', value, {path: '/', maxAge: 3600 * 24 * 360});
    this.setState({customNodeDisabled: value != 'others', nodeInfo: value});
  }
  onConfigNodeOK = () => {
    const nodeInfo = (this.state.nodeInfo.indexOf('http://') == 0 || this.state.nodeInfo.indexOf('https://') == 0) ? this.state.nodeInfo : 'https://' + this.state.nodeInfo;
    cookie.save('nodeInfo', nodeInfo, {path: '/', maxAge: 3600 * 24 * 360});
    axios.defaults.baseURL = nodeInfo;
    this.setState({ nodeConfigVisible: false, nodeInfo });
    unichain.utils.setProvider(nodeInfo);
    this.state.chainId = unichain.uni.getChainId();
    //history.push('/');
    location.reload(true);
  }

  handleClick = e => {
    this.setState({
      current: e.key
    });
  };
  render() {
    const defaultTrigger = <Button type="primary" className="btrigger" onClick={this.openSetDialog.bind(this)}><Icon type="set" />{T('设置接入节点')}</Button>;
    const { isMobile, theme, width, className, style, location } = this.props;  
    const { pathname } = location;

    return (
      <Layout.Header
        theme={theme}
        className={cx('ice-design-layout-header')}
        style={{ ...style, width }}
      >
        <Logo />
        <div
          className="ice-design-layout-header-menu"
          style={{ display: 'flex' }}
        >     
        {
          headerMenuConfig && headerMenuConfig.length > 0 ? (
            <StyledMenu 
              theme='light'
              onClick={this.handleClick} 
              selectedKeys={[this.state.current]} 
              style={{fontSize: '16px'}}
              mode="horizontal"
            >
            {headerMenuConfig.map((nav, idx) => {
                let subMenu = null;
                const linkProps = {};
                if (nav.children) {
                  subMenu = {items: []};
                  subMenu.label = T(nav.name);
                  nav.children.map(item => {
                    if (item.newWindow) {
                      subMenu.items.push({value: item.name, href: item.path, target: '_blank'});
                    } else if (item.external) {
                      subMenu.items.push({value: item.name, href: item.path});
                    } else {
                      subMenu.items.push({value: item.name, to: item.path});
                    }
                  });
                } else if (nav.newWindow) {
                  linkProps.href = nav.path;
                  linkProps.target = '_blank';
                } else if (nav.external) {
                  linkProps.href = nav.path;
                } else {
                  linkProps.to = nav.path;
                }
                if (subMenu !== null) {
                  return (<SubMenu title={<span>{subMenu.label}</span>}  key={idx}>                                                  
                            {subMenu.items.map((item, i) => 
                              <MenuItem  key={idx + '-' + i}>
                                {item.to ? (
                                  <Link to={item.to}>
                                    {item.value}
                                  </Link>
                                ) : (
                                  <a {...item}>
                                    {item.value}
                                  </a>
                                )}
                              </MenuItem>)}
                          </SubMenu>);
                }
                return (
                  <MenuItem key={idx}>
                    {linkProps.to ? (
                      <Link {...linkProps}>
                        {!isMobile ? T(nav.name) : null}
                      </Link>
                    ) : (
                      <a {...linkProps}>
                        {!isMobile ? T(nav.name) : null}
                      </a>
                    )}
                  </MenuItem>
                );
              })}
            </StyledMenu>
          ) : null
        }     
          
        </div>
        <div
          className="ice-design-layout-header-menu"
          style={{ display: 'flex' }}
        >
          <Select
            style={{ width: 100 }}
            placeholder={T("语言")}
            onChange={this.onChangeLanguage.bind(this)}
            dataSource={this.state.languages}
            defaultValue={this.state.defaultLang}
          />
          &nbsp;&nbsp;

          <Balloon trigger={defaultTrigger} closable={false}>
            {T('当前连接的节点')}:{this.state.nodeInfo}, ChainId:{this.state.chainId}
          </Balloon>
          &nbsp;&nbsp;
          <Button type="primary" className="btrigger" onClick={() => history.push('/AccountManager')}><Icon type="account" />{T('账号管理')}</Button>
          <Dialog
            visible={this.state.nodeConfigVisible}
            title={T("配置需连接的节点")}
            footerActions="ok"
            footerAlign="center"
            closeable="true"
            onOk={this.onConfigNodeOK.bind(this)}
            onCancel={() => this.setState({ nodeConfigVisible: false })}
            onClose={() => this.setState({ nodeConfigVisible: false })}
          >
            <Select
                style={{ width: 400 }}
                placeholder={T("选择节点")}
                onChange={this.onChangeNode.bind(this, 'nodeInfo')}
                value={this.state.nodeInfo}
                dataSource={this.state.nodes}
            />
            <br />
            <br />
            <Input hasClear
              disabled={this.state.customNodeDisabled}
              onChange={this.handleNodeInfoChange.bind(this)}
              style={{ width: 400 }}
              addonBefore="RPC URL"
              size="medium"
              defaultValue={this.state.nodeInfo}
              maxLength={150}
              hasLimitHint
            />
            {/* <br />
            <br />
            <Input hasClear
              onChange={this.handlePortChange.bind(this)}
              style={{ width: 400 }}
              addonBefore="RPC端口"
              size="medium"
              defaultValue={this.state.port}
              maxLength={5}
              hasLimitHint
              onPressEnter={this.onConfigNodeOK.bind(this)}
            /> */}
          </Dialog>

          {/* <Search
            style={{ fontSize: '12px' }}
            size="large"
            inputWidth={400}
            searchText="Search"
            placeholder="Search by Address / Txhash / Block / Token / Ens"
          /> */}
          

          {/* Header 右侧内容块 */}

          {/* <Balloon
            visible={false}
            trigger={
              <div
                className="ice-design-header-userpannel"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 12,
                }}
              >
                <IceImg
                  height={40}
                  width={40}
                  src={
                    profile.avatar ||
                    'https://img.alicdn.com/tfs/TB1L6tBXQyWBuNjy0FpXXassXXa-80-80.png'
                  }
                  className="user-avatar"
                />
                <div className="user-profile">
                  <span className="user-name" style={{ fontSize: '13px' }}>
                    {profile.name}
                  </span>
                  <br />
                  <span
                    className="user-department"
                    style={{ fontSize: '12px', color: '#999' }}
                  >
                    {profile.department}
                  </span>
                </div>
                <Icon
                  type="arrow-down-filling"
                  size="xxs"
                  className="icon-down"
                />
              </div>
            }
            closable={false}
            className="user-profile-menu"
          >
            <ul>
              <li className="user-profile-menu-item">
                <FoundationSymbol type="person" size="small" />我的主页
              </li>
              <li className="user-profile-menu-item">
                <FoundationSymbol type="repair" size="small" />设置
              </li>
              <li
                className="user-profile-menu-item"
                onClick={this.props.handleLogout}
              >
                <FoundationSymbol type="compass" size="small" />退出
              </li>
            </ul>
          </Balloon> */}
        </div>
      </Layout.Header>
    );
  }
}
