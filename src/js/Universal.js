import TWEEN from "@tweenjs/tween.js";
document.getElementById('cardSpin').addEventListener('click', function() {
    let card = document.getElementById('businessCard');
    document.getElementById('cardSpin').innerText = (card.classList.contains('animate'))? 'Let me give you my card...' :'I\'ll need that back...';
    if(card.classList.contains('straightened')) {
        card.classList.remove('straightened');
    }
    if(card.classList.contains('exit')) {
        card.classList.remove('exit'); // remove the class before adding it again
        void card.offsetWidth; // trigger a reflow
        card.classList.add('animate');
    } else if (card.classList.contains('animate')) {
        let random = ((Math.random() >=0.5)? 1: -1)* Math.round(Math.random() * 18 +6)
        card.style = `--deg: ${random}deg`;
        card.classList.remove('animate'); // remove the class before adding it again
        void card.offsetWidth; // trigger a reflow
        card.classList.add('exit');
    } else {
        let random = ((Math.random() >= 0.5)? 1: -1)* Math.round(Math.random() * 18 +6)
        card.style = `--deg: ${random}deg`;
        card.classList.add('animate');
    }
});

document.getElementById('straighten').addEventListener('click', function() {
    document.getElementById('businessCard').classList.toggle('straightened');
})

document.getElementById('flipper').addEventListener('click', function() {
    document.getElementById('cardFront').style.display = (document.getElementById('cardFront').style.display === 'none')? 'block': 'none';
    document.getElementById('cardBack').style.display = (document.getElementById('cardBack').style.display === 'none')? 'block': 'none';

})
let copycounter =0;
let timeout;
document.getElementById('mail').addEventListener('click', function() {
    copycounter++;
        navigator.clipboard.writeText('juniper@circuit-cat.com');
        if(copycounter < 10) {
            document.getElementById('mail').innerText = 'Copied!';
        } else if (copycounter < 15) {
            document.getElementById('mail').innerText = 'Overcopied!';
        } else if (copycounter < 23) {
            document.getElementById('mail').innerText = 'Copytacular!';
        } else if (copycounter < 38) {
            document.getElementById('mail').innerText = 'COPYTROCITY!!';
        } else if(copycounter < 56) {
            document.getElementById('mail').innerText = 'COPYCATACLYSM!!!!';
        } else if(copycounter < 70) {
            document.getElementById('mail').innerText = 'COPYPOCALYPSE!!!!!!';
        } else if (copycounter < 100) {
            document.getElementById('mail').innerText = 'you can stop now :)';
        } else if (copycounter > 105){
            copycounter = 0;
        }
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            document.getElementById('mail').innerText = 'juniper@circuit-cat.com';
        }, 1000);
})