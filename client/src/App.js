import React from "react";
import {ethers} from "ethers";
import abi from "./utils/WavePortal.json";
import './App.css';

function App() {

  const [currentAccount, setCurrentAccount] = React.useState("");
  const [waveCount, setWaveCount] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [allWaves, setAllWaves] = React.useState([]);
  const contractAddress = "0x5cA08FEf9CD62c5F6b1E14586dcC40f34a546880";
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
        initCount();
        getAllWaves();
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
        getAllWaves();
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

        const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
        console.log("Mining ",waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined ",waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Retreived total wave count...", count.toNumber());

        setWaveCount(count.toNumber());
        getAllWaves();
      }
    } catch(error) {
      console.log(error);
    }
  }

  const getAllWaves = async() => {
    try {
      const {ethereum} = window;
      
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];

        waves.forEach(wave => {
          wavesCleaned.push({
            address : wave.sender,
            message : wave.message,
            timestamp : new Date(wave.time * 1000)
          });
        });
        setAllWaves(wavesCleaned);

      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch(error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    CheckIfWalletIsConnected();
    // initCount();
    // eslint-disable-next-line
  },[]);

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  }

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hey there!
        </div>

        <div className="bio">
          I'm Etisha! Welcome to my wave portal. How are you doing today?
        </div>

        <div className="details">
          <p>Write your message below:</p>
          <textarea
            className="details-input-box"
            type="text"
            id="message"
            name="message"
            onChange={handleMessageChange}
            value={message} 
          />
          <button className="waveButton" onClick={wave}>
            👋 Wave at Me
          </button>
        </div> 
        

        {!currentAccount && 
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        }

        {currentAccount &&
          <div className="bio">
            Total number of people who have waved : {waveCount}
          </div>
        }

        {allWaves.map((wave, index) => {
          return (
            <div className="wave-details" key={index}>
              <div><font color="#f5c77e">From:</font> {wave.address}</div>
              <div><font color="#f5c77e">Time:</font> {wave.timestamp.toString()}</div>
              <div><font color="#f5c77e">Message:</font> {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}

export default App;
