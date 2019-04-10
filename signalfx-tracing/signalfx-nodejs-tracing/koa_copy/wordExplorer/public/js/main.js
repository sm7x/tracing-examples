
function update_word() {
    // TODO: make ajax call to /wordExplorer/words/${response.word}
    $.ajax({url: "/wordExplorer/api/words/" + response.word, success: function(result){
        console.log(result);
     }});
}

function ding() {
    alert('dong!');
}

$($('#delete')[0]).on("click", ding);

$($('#update')[0]).on("click", update_word);
// add update_word as an event handler to the button