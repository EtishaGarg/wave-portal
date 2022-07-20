const main = async() => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    const waveContract = await waveContractFactory.deploy({
        value : hre.ethers.utils.parseEther("0.1"),
    });
    await waveContract.deployed();

    console.log("Contract deployed to: ", waveContract.address);
    console.log("Contract deployed by: ", owner.address);

    // Get contract balance
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance: ",hre.ethers.utils.formatEther(contractBalance));

    let waveCount;
    waveCount = await waveContract.getTotalWaves();

    let waveTxn = await waveContract.wave("Hi! How are you?");
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();

    //Calling wave function twice from same account to see the error

    waveTxn = await waveContract.wave("Hi!");
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();

    //Random person calling the wave function

    waveTxn = await waveContract.connect(randomPerson).wave("Another message!");
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();

    // Get contract balance to see what happens
    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log("Contract balance: ",hre.ethers.utils.formatEther(contractBalance));

    waveArray = await waveContract.getAllWaves();
    console.log(waveArray);
};

const runMain = async() => {
    try {
        await main();
        process.exit(0); // exit Node process without error
    } catch(error) {
        console.log(error);
        process.exit(1); // exit Node process while indicating "Uncaught Fatal Exception" error
    }
};

runMain();