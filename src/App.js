import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Navbar } from './components/layout/navbar/Navbar'
import Footer from './components/layout/footer/Footer'
import Home from './components/home-container/home/Home'
import PetDetails from './components/home-container/pet-details/PetDetails'
import CreatePet from './components/create-post/CreatePet'

const { BN, Long, bytes, units } = require('@zilliqa-js/util')
const { toBech32Address } = require('@zilliqa-js/crypto')
const { Zilliqa } = require('@zilliqa-js/zilliqa')
const { StatusType, MessageType } = require('@zilliqa-js/subscriptions')

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      contract_address: '0x20d0631603d22a36da435b13ffb086cc2a4f37e1',
      walletAddres: '0xeeBeB3539945e31799295DA26328E5c5eD99C5AF',
    }

    this.handleAddressChange = this.handleAddressChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleHelloChange = this.handleHelloChange.bind(this)
    this.setHello = this.setHello.bind(this)
    this.getHello = this.getHello.bind(this)
    this.connectZilpay = this.connectZilpay.bind(this)
    this.mintNFT = this.mintNFT.bind(this)
    this.sendMintNFT = this.sendMintNFT.bind(this)
  }

  componentDidMount() {}

  handleAddressChange(event) {
    this.setState({ contractAddress: event.target.value })
  }

  handleSubmit() {
    localStorage.setItem('contract_address', this.state.contractAddress)
  }

  handleHelloChange(event) {
    this.setState({ setHelloValue: event.target.value })
  }

  async setHello() {
    if (window.zilPay.wallet.isEnable) {
      this.updateWelcomeMsg()
    } else {
      const isConnect = await window.zilPay.wallet.connect()
      if (isConnect) {
        this.updateWelcomeMsg()
      } else {
        alert('Not able to call setHello as transaction is rejected')
      }
    }
  }

  async updateWelcomeMsg() {
    const zilliqa = window.zilPay
    let setHelloValue = this.state.setHelloValue
    let contractAddress = localStorage.getItem('contract_address')
    const CHAIN_ID = 333
    const MSG_VERSION = 1
    const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION)
    const myGasPrice = units.toQa('2000', units.Units.Li) // Gas Price that will be used by all transactions
    contractAddress = contractAddress.substring(2)
    const ftAddr = toBech32Address(contractAddress)

    const contract = zilliqa.contracts.at(ftAddr)

    try {
      const callTx = await contract.call(
        'setHello',
        [
          {
            vname: 'msg',
            type: 'String',
            value: setHelloValue,
          },
        ],
        {
          // amount, gasPrice and gasLimit must be explicitly provided
          version: VERSION,
          amount: new BN(0),
          gasPrice: myGasPrice,
          gasLimit: Long.fromNumber(10000),
        },
      )
    } catch (err) {
      console.log(err)
    }
  }

  async getHello() {
    if (window.zilPay.wallet.isEnable) {
      this.getWelcomeMsg()
    } else {
      const isConnect = await window.zilPay.wallet.connect()
      if (isConnect) {
        this.getWelcomeMsg()
      } else {
        alert('Not able to call setHello as transaction is rejected')
      }
    }
  }

  async mintNFT(token_uri) {
    if (window.zilPay.wallet.isEnable) {
      const addressTo = window.zilPay.wallet.defaultAccount.bech32
      console.log('Luis mintNFT  zil1a6ltx5uegh330xfftk3xx289chken3d0xnfa5w', addressTo)
      this.sendMintNFT(token_uri, addressTo)
    } else {
      alert('Please connect your ZilWallet!')
      // const isConnect = await window.zilPay.wallet.connect()
      // if (isConnect) {
      //   this.sendMintNFT()
      // } else {
      //   alert('Not able to call setHello as transaction is rejected')
      // }
    }
  }

  async sendMintNFT(token_uri, addressTo) {
    console.log('url, addressTo', token_uri, addressTo)
    const zilliqa = window.zilPay
    let contractAddress = this.state.contract_address
    const CHAIN_ID = 333
    const MSG_VERSION = 1
    const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION)
    const myGasPrice = units.toQa('2000', units.Units.Li) // Gas Price that will be used by all transactions
    contractAddress = contractAddress.substring(2)


    const ftAddr = toBech32Address(contractAddress)
    let userAddress = localStorage.getItem('userAddress')

    let smartContractState = await zilliqa.blockchain.getSmartContractState(
      contractAddress,
    )

    try {
      const contract = zilliqa.contracts.at(ftAddr)
      // const token_uri =
      //   'https://images.unsplash.com/photo-1620202674364-d83769d3f443?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80'

      const to = this.state.walletAddres

      const callTx = await contract.call(
        'Mint',
        [
          {
            vname: 'token_uri',
            type: 'String',
            value: token_uri,
          },
          {
            vname: 'to',
            type: 'ByStr20',
            value: to,
          },
        ],
        {
          version: VERSION,
          amount: new BN(0),
          gasPrice: myGasPrice,
          gasLimit: Long.fromNumber(10000),
        },
      )
      console.log(JSON.stringify(callTx.TranID))
      this.eventLogSubscription()
    } catch (err) {
      console.log(err)
    }
  }

  async getWelcomeMsg() {
    const zilliqa = window.zilPay
    let contractAddress = localStorage.getItem('contract_address')
    const CHAIN_ID = 333
    const MSG_VERSION = 1
    const VERSION = bytes.pack(CHAIN_ID, MSG_VERSION)
    const myGasPrice = units.toQa('2000', units.Units.Li) // Gas Price that will be used by all transactions
    contractAddress = contractAddress.substring(2)
    const ftAddr = toBech32Address(contractAddress)

    //
    let userAddress = localStorage.getItem('userAddress') //userAddress is retrieved from localStorage in this example

    let smartContractState = await zilliqa.blockchain.getSmartContractState(
      contractAddress,
    )
    console.log(
      '🚀 ~ file: App.js ~ line 121 ~ App ~ getWelcomeMsg ~ smartContractState',
      smartContractState,
    )
    // if (smartContractState) {
    //   let balances_map = smartContractState.result.balances_map
    //   userAddress = userAddress.toLowerCase()
    //   let userTokenBalance = balances_map[userAddress] //user's token balance
    // }
    //
    try {
      // const contract = zilliqa.contracts.at(ftAddr)
      // console.log('🚀 ~WHAT is contract', contract)
      // const callTx = await contract.call('getHello', [], {
      //   // amount, gasPrice and gasLimit must be explicitly provided
      //   version: VERSION,
      //   amount: new BN(0),
      //   gasPrice: myGasPrice,
      //   gasLimit: Long.fromNumber(10000),
      // })
      // console.log(JSON.stringify(callTx.TranID))
      // this.eventLogSubscription()
      // console.log('🚀 ~WHAT is contract', contract)
      // const callTx = await contract.call('getHello', [], {
      //   // amount, gasPrice and gasLimit must be explicitly provided
      //   version: VERSION,
      //   amount: new BN(0),
      //   gasPrice: myGasPrice,
      //   gasLimit: Long.fromNumber(10000),
      // })
      // console.log(JSON.stringify(callTx.TranID))
      // this.eventLogSubscription()
    } catch (err) {
      console.log(err)
    }
  }
  // Code that listens to websocket and updates welcome message when getHello() gets called.
  async eventLogSubscription() {
    const zilliqa = new Zilliqa('https://dev-api.zilliqa.com')
    const subscriber = zilliqa.subscriptionBuilder.buildEventLogSubscriptions(
      'wss://dev-ws.zilliqa.com',
      {
        // smart contract address you want to listen on
        addresses: [localStorage.getItem('contract_address')],
      },
    )

    subscriber.emitter.on(StatusType.SUBSCRIBE_EVENT_LOG, (event) => {
      // if subscribe success, it will echo the subscription info
      console.log('get SubscribeEventLog echo : ', event)
    })

    subscriber.emitter.on(MessageType.EVENT_LOG, (event) => {
      console.log('get new event log: ', JSON.stringify(event))
      // updating the welcome msg when a new event log is received related to getHello() transition
      if (event.hasOwnProperty('value')) {
        if (event.value[0].event_logs[0]._eventname == 'getHello') {
          let welcomeMsg = event.value[0].event_logs[0].params[0].value
          this.setState({ welcomeMsg: welcomeMsg })
          console.log('welcomeMsg', welcomeMsg)
        }
      }
    })
    await subscriber.start()
  }

  async connectZilpay(e) {
    e.preventDefault()
    try {
      await window.zilPay.wallet.connect()
      if (window.zilPay.wallet.isConnect) {
        this.setState({
          walletAddres: window.zilPay.wallet.defaultAccount.bech32,
        })
        localStorage.setItem('zilpay_connect', true)
        // window.location.reload(false)
      } else {
        alert('Zilpay connection failed, try again...')
      }
    } catch (error) {}
  }
  render() {
    console.log('this.state', this.state)

    return (
      <Router>
        <div className="cl">
          <Navbar
            connectZilpay={this.connectZilpay}
            walletAddres={this.state.walletAddres}
          />

          <Route exact path="/" component={Home} />
          <Switch>
            <Route exact path="/create-nft">
              <CreatePet mintNFT={this.mintNFT} />
            </Route>

            <Route path="/nft-details/:nfttId">
              <PetDetails />
            </Route>
          </Switch>
          <Footer />
        </div>
      </Router>
    )
  }
}
