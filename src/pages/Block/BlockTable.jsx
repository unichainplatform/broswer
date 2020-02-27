import React, { Component } from 'react';
import { Search, Grid } from "@icedesign/base";
import IceContainer from '@icedesign/container';
import * as unichain from 'unichain-web3'
import ReactJson from 'react-json-view';

import { Feedback } from '@icedesign/base';
import BigNumber from "bignumber.js";
import TransactionList from '../../TransactionList';
import { T } from '../../utils/lang';

const { Row, Col } = Grid;

export default class BlockTable extends Component {
  static displayName = 'BlockTable';

  constructor(props) {
    super(props);
    this.state = {
        filter: [
            {
              text: T("区块高度"),
              value: "height"
            },
            {
              text: T("区块Hash值"),
              value: "hash"
            }
        ],
        value: "",
        blockInfo: {},
        txNum: '',
        transactions: [],
        assetInfos: {},
        onePageNum: 10,
        txFrom: {},
    };
  }

  componentDidMount = async () => {
    //var blockInfo = await unichain.uni.getBlockByNum(0, true);
    //this.setState({ blockInfo, txFrom: {blockHeight: blockInfo.number} });
  }

  onSearch = async (value) => {
    var blockInfo = {};
    var blockInfo2 = {};
    if (value.key.indexOf("0x") == 0) {
      blockInfo = await unichain.uni.getBlockByHash(value.key, true);
      blockInfo2 = await unichain.uni.getBlockByNum(blockInfo.number, false);
      if (blockInfo.hash != blockInfo2.hash) {
        Feedback.toast.prompt(T('注意：此区块已被回滚'));
      }
    } else {
      blockInfo = await unichain.uni.getBlockByNum(value.key, true);
    }

    if (blockInfo != null) {
      this.setState({ blockInfo, txFrom: {blockHeight: blockInfo.number}, txNum: blockInfo.transactions.length });
    } else {
        Feedback.toast.prompt(T('区块不存在'));
    }
  }

  // value为filter的值，obj为search的全量值
  onFilterChange(value, obj) {
        console.log(`filter is: ${value}`);
        console.log("fullData: ", obj);
  }

  getReadableNumber = (value, assetID) => {
    let {assetInfos} = this.state;
    var decimals = assetInfos[assetID].decimals;

    var renderValue = new BigNumber(value);
    renderValue = renderValue.shiftedBy(decimals * -1);
    
    BigNumber.config({ DECIMAL_PLACES: 6 });
    renderValue = renderValue.toString(10);
    return renderValue;
  }
  onChange = (currentPage) => {
    var startNo = (currentPage - 1) * this.state.onePageNum;
    var transactions = this.state.transactions.slice(startNo, startNo + this.state.onePageNum);
    this.setState({
      transactionsOnePage: transactions,
    });
  }

  render() {
    return (
      <div>
        <IceContainer>
          <Row style={{ justifyContent: 'center' }}>
            <Col span="24" s="10" l="10">
                <Search
                    size="large"
                    autoWidth="true"
                    onSearch={this.onSearch.bind(this)}
                    placeholder="height/hash"
                    onFilterChange={this.onFilterChange.bind(this)}
                />
            </Col>
          </Row>
        </IceContainer>

        <IceContainer style={styles.container}>
            <h4 style={styles.title}>{T('区块原始信息')}</h4>
            <ReactJson
              src={this.state.blockInfo}
            />
          </IceContainer>

          <br/>
          <br/>
          <TransactionList txFrom={this.state.txFrom}/>
      </div>
    );
  }
}

const styles = {
    container: {
      margin: '0',
      padding: '0',
      height: 'auto',
    },
    title: {
      margin: '0',
      padding: '15px 20px',
      fonSize: '16px',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      color: 'rgba(0,0,0,.85)',
      fontWeight: '500',
      borderBottom: '1px solid #eee',
    },
    summary: {
      padding: '20px',
    },
    item: {
      height: '40px',
      lineHeight: '40px',
    },
    label: {
      display: 'inline-block',
      fontWeight: '500',
      minWidth: '74px',
      width: '150px',
    },
  };