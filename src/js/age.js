let age = document.getElementById("age");
age.innerText = "I am a " + timeSince(new Date(2005, 9, 2)) + " developer";
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " year old";
    }
}