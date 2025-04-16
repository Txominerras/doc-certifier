import pkg from 'hardhat';
const { ethers } = pkg;


async function main() {
    const DocumentRegistryFactory = await ethers.getContractFactory('DocumentRegistry');
    const contract = await DocumentRegistryFactory.deploy();
  
    await contract.waitForDeployment(); 
  
    const contractAddress = await contract.getAddress();
    console.log(`Contrat deployed: ${contractAddress}`);
  }
  
  main().catch((error) => {
    console.error("Error deploying:", error); 
    process.exitCode = 1;
  });