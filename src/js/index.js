var contract;
var userAccount;
var contractAddress = "0x92Df726D3D5844afA62F2878Ce4C96BB6C307f03";

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

    contract = await new web3.eth.Contract(contractABI, contractAddress);

await contract.events.NewZombie({
    fromBlock: 0
}, function(error, event){
contract.methods.ownerOf(event.returnValues.zombieId).call().then((owner) => {
    if(owner === userAccount)
 generateZombie(event.returnValues.zombieId, event.returnValues.name, event.returnValues.dna)
        }, false);
         //console.log(event);
         })
.on('error', console.error);

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
$("#ourButton").click(async function (e) {
    var name = $("#nameInput").val()
    // Call our contract's `createRandomZombie` function:
    await contract.methods.createRandomZombie(name).send({ from: userAccount })
        .on("transactionHash", (txHash) => {
            alert("Txhash: " + txHash);
        })
        .on("receipt", (receipt) => {
            console.log(receipt);
        })
        .on("error", (error) => {
            console.log(error);
        });
})

/*
// Listen for the `NewZombie` event, and update the UI
var event = ZombieOwnership.NewZombie(function(error, result) {
 if (error) return
 generateZombie(result.zombieId, result.name, result.dna)
})
*/

// take the Zombie dna, and update our image
function generateZombie(id, name, dna) {
    // calc Zombie Details from dna
    //=======================================================================
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
        hadhadCat: (parseInt(dnaStr) % 100 === 99) ,
        zombieName: name,
        zombieDescription: "A Level 1 CryptoZombie",
    }

    // create Zombie from zombieDetails
    //=======================================================================

    // clone from model
    let model = document.getElementById('model');
    model.classList.remove('hide'); 
    let newZombie = model.cloneNode(true);

    for (let i = 1; i <= 7; ++i) { // for 7 head parts
        let headPart = newZombie.getElementsByClassName('head-part-' + i)[0];
        if (i === zombieDetails.headChoice) {
            headPart.classList.remove('hide');
        }
        else {
            headPart.classList.add('hide');
        }
    }
    for (let i = 1; i <= 11; ++i) { // for 11 eye parts
        let eyePart = newZombie.getElementsByClassName('eye-part-' + i)[0];
        if (i === zombieDetails.eyeChoice) {
            eyePart.classList.remove('hide');
        }
        else {
            eyePart.classList.add('hide');
        }
    }
    for (let i = 1; i <= 6; ++i) { // for 6 shirt parts
        let shirtPart = newZombie.getElementsByClassName('shirt-part-' + i)[0];
        if (i === zombieDetails.shirtChoice) {
            shirtPart.classList.remove('hide');
        }
        else {
            shirtPart.classList.add('hide');
        }
    }
    let skins = newZombie.getElementsByClassName('skin');
    for (let i = 0; i < skins.length; ++i)
        skins[i].setAttribute("style", "filter:hue-rotate(" + zombieDetails.skinColorChoice + "deg)");

    let eyes = newZombie.getElementsByClassName('eye');
    for (let i = 0; i < eyes.length; ++i)
        eyes[i].setAttribute("style", "filter:hue-rotate(" + zombieDetails.eyeColorChoice + "deg)");

    let clothes = newZombie.getElementsByClassName('cloth');
    for (let i = 0; i < clothes.length; ++i)
        clothes[i].setAttribute("style", "filter:hue-rotate(" + zombieDetails.clothesColorChoice + "deg)");

        if(zombieDetails.hadhadCat){
            newZombie.getElementsByClassName('cat-legs')[0].classList.remove('hide');
            let target = newZombie.getElementsByClassName('legs');
            for(let i = 0; i < target.length; ++i) target[i].classList.add('hide');
        }
    document.getElementById('zombieList').appendChild(newZombie);
    model.classList.add('hide'); // model no longer needed
    return zombieDetails
}

//generateZombie(1, "a", "2053823161706508");
//generateZombie(1, "a", "4871286036524799");