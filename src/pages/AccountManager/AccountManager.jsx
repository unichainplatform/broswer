import React, { Component } from 'react';
import AccountList from './components/AccountList';
import KeystoreManager from '../KeystoreManager';

export default class AccountManager extends Component {
  static displayName = 'AccountManager';

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="accountmanager-page">
        账户信息: <br/><br/>
        <AccountList />
        <br/><br/>密钥信息: <br/><br/>
        <KeystoreManager />
      </div>
    );
  }
}
