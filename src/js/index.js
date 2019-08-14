var contract;
var userAccount;
var contractAddress = "0x9D6bC5b641c107926E11e039C0Fc7E683a454F36";

async function startApp() {
    await web3.eth.getAccounts((error, accounts) => {
        if (accounts[0] !== userAccount) {
            userAccount = accounts[0];
        }
    })
    var accountInterval = setInterval(async () => {
        await web3.eth.getAccounts(async (error, accounts) => {
            if (accounts[0] != userAccount) {
                userAccount = accounts[0];
            }
        })
    }, 100);

    contract = new web3.eth.Contract(contractABI, contractAddress);
}
    window.addEventListener('load', () => {
        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            console.log('metamask not found');
        }
    console.log('tes');
        startApp();
    })
// some sort of event listener to take the text input:
$("#ourButton").click(async function(e) {
  var name = $("#nameInput").val()
  // Call our contract's `createRandomZombie` function:
  /*
  await contract.methods.createRandomZombie(name).send({ from: userAccount})
        .on("transactionHash", (txHash) => {
            alert("Txhash: " + txHash);
        })
        .on("receipt", (receipt) => {
            console.log(receipt);
        })
        .on("error", (error) => {
            console.log(error);
        });
        */
   contract.methods.ownerOf(0).call().then((fortune) => {
     console.log(fortune);
            }, false);

})

 /********
// Listen for the `NewZombie` event, and update the UI
var event = ZombieOwnership.NewZombie(function(error, result) {
  if (error) return
  generateZombie(result.zombieId, result.name, result.dna)
})

// take the Zombie dna, and update our image
function generateZombie(id, name, dna) {
  let dnaStr = String(dna)
  // pad DNA with leading zeroes if it's less than 16 characters
  while (dnaStr.length < 16)
    dnaStr = "0" + dnaStr

  let zombieDetails = {
    // first 2 digits make up the head. We have 7 possible heads, so % 7
    // to get a number 0 - 6, then add 1 to make it 1 - 7. Then we have 7
    // image files named "head1.png" through "head7.png" we load based on
    // this number:
    headChoice: dnaStr.substring(0, 2) % 7 + 1,
    // 2nd 2 digits make up the eyes, 11 variations:
    eyeChoice: dnaStr.substring(2, 4) % 11 + 1,
    // 6 variations of shirts:
    shirtChoice: dnaStr.substring(4, 6) % 6 + 1,
    // last 6 digits control color. Updated using CSS filter: hue-rotate
    // which has 360 degrees:
    skinColorChoice: parseInt(dnaStr.substring(6, 8) / 100 * 360),
    eyeColorChoice: parseInt(dnaStr.substring(8, 10) / 100 * 360),
    clothesColorChoice: parseInt(dnaStr.substring(10, 12) / 100 * 360),
    zombieName: name,
    zombieDescription: "A Level 1 CryptoZombie",
  }
  return zombieDetails
}
 * 
 */