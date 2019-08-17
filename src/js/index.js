var contract;
var userAccount;
var contractAddress = "0x1150aFBE434Db783fD62e0Bff2D74217f53EF262";

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

    // Listen for the `NewZombie` event, and update the UI
    await contract.events.NewZombie({
        fromBlock: 0
    }, function (error, event) {
        contract.methods.ownerOf(event.returnValues.zombieId).call().then((owner) => {
            if (owner === userAccount) {
                document.getElementById('signUp').classList.add('hide');
                document.getElementById('yourZombies').classList.remove('hide');
                let ret = event.returnValues;
                contract.methods.zombies(ret.zombieId).call().then((zombie) => {
                    generateZombie(ret.zombieId, 
                        ret.name, ret.dna, 
                    'zombieList',
                    zombie.readyTime,
                    zombie.level);
                });
            }
        }, false);
        //console.log(event);
    })
        .on('error', console.error);
    generateZombie(-1, "NO NAME", "0000000000000000", 'preview');
    displayZombieDetailsOnPreview(calcZombieDetails(-1, "NO NAME", '0000000000000000'));
}

window.addEventListener('load', () => {
    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        console.log('metamask not found');
    }
    startApp();
})

$("#btnCreateZombie").click(async function (e) {
    var name = $("#nameInput").val()
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



function onReadyTime(strTime){
    intTime = parseInt(strTime);
    var date = new Date();
    if(date.getTime() > intTime)
        return " Yes";
    var d = new Date( intTime );
    var year  = d.getFullYear();
    var d = new Date( intTime );
    var y = new Date( intTime * 1000 );
    var year  = y.getFullYear();
    var month = d.getMonth() + 1;
    var day  = d.getDate();
    var hour = ( '0' + d.getHours() ).slice(-2);
    var min  = ( '0' + d.getMinutes() ).slice(-2);
    var sec   = ( '0' + d.getSeconds() ).slice(-2);

    return( year + '/' + month + '/' + day + ' ' + hour + ':' + min + ':' + sec );
}

// detect name input at real time 
// then, display the preview of the named zombie  
//============================================================
$(function () {
    var $input = $('#nameInput');
    $input.on('input', function (event) {
        var name = $input.val();
        // get DNA from SC
        contract.methods.generateRandomDna(name).call().then((dna) => {
            var preview = document.getElementById('preview');
            while (preview.firstChild) preview.removeChild(preview.firstChild);

            displayZombieDetailsOnPreview(calcZombieDetails(-1, name, dna));
            generateZombie(-1, name, dna, 'preview');
        }, false);

    });
});

function displayZombieDetailsOnPreview(zombieDetails) {
    document.getElementById('dna').textContent =
        "頭部の遺伝子: " + zombieDetails.headChoice;
    document.getElementById('eyes').textContent =
        "目の遺伝子: " + zombieDetails.eyeChoice;
    document.getElementById('shirts').textContent =
        "シャツの遺伝子: " + zombieDetails.shirtChoice;
    document.getElementById('skinColor').textContent =
        "肌の色の遺伝子: " + zombieDetails.skinColorChoice;
    document.getElementById('eyesColor').textContent =
        "目の色の遺伝子: " + zombieDetails.eyeColorChoice;
    document.getElementById('clothesColor').textContent =
        "服の色の遺伝子: " + zombieDetails.clothesColorChoice;
    
}

// TEST
//generateZombie(1, "a", "2053823161706508");
//generateZombie(1, "a", "4871286036524799");