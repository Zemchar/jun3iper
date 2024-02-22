import TWEEN from "@tweenjs/tween.js";
document.getElementById('cardSpin').addEventListener('click', function() {
    let card = document.getElementById('businessCard');
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