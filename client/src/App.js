import React from "react";
import {ethers} from "ethers";
import abi from "./utils/WavePortal.json";
import './App.css';

function App() {

  const [currentAccount, setCurrentAccount] = React.useState("");
  const [waveCount, setWaveCount] = React.useState("");
  const contractAddress = "0x2a95f5C619630A50B0a596e6010bc899725e549E"
  const contractABI = abi.abi;

  const CheckIfWalletIsConnected = async() => {
    try {
      const {ethereum} = window;

      if(!ethereum) {
        console.log("Make sure you have Metamask!");
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts"});

      if(accounts.length !== 0){
        console.log("Found an authorized account: ",accounts[0]);
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No authorized account found");
      }
    } catch(error) {
      console.log(error);
    }
  }

  const connectWallet = async() => {
    try {
      const {ethereum} = window;

      if(!ethereum){
        alert("Get Metamask!");
      }
        const accounts = await ethereum.request({ method: "eth_requestAccounts"});
        console.log("Account connected ",accounts[0]);
        setCurrentAccount(accounts[0]);
      
    } catch(error) {
      console.log(error);
    }
  }

  const initCount = async() => {
    try {
      const {ethereum} = window;
      
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        setWaveCount(count.toNumber());
      }
    } catch(error) {
      console.log(error);
    }
  }

  const wave = async() => {
    try {
      const {ethereum} = window;
      
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        console.log("Retreived total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave();
        console.log("Mining ",waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined ",waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retreived total wave count...", count.toNumber());

        setWaveCount(count.toNumber());
      }
    } catch(error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    CheckIfWalletIsConnected();
    initCount();
    // eslint-disable-next-line
  },[]);

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I'm Etisha! Welcome to my wave portal. How are you doing today?
          <br/><br/>
          Total number of people who have waved : {waveCount}
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && 
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        }
      </div>
    </div>
  );
}

export default App;
