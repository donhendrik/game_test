let search_input = document.getElementById("searchbar");

window.addEventListener("load", function() { // beim Laden Suchleiste fokussieren
    show_streak();
    show_previous_guesses();
    search_input.focus();
    //char_picker();
   
});


const arr = [["Eren Yaeger", "Male", "20", "Shiganshina Arc"], ["ertest", "asd", "234", "asdasd"],["Armin Arlert", "Male", "19", "Shiganshina Arc"], ["Historia Reiss", "Female", "20", "Rise"], ["Moritz Markert", "Male", "29", "bitch ass Arc"]];
let picked_char = arr[2];


var guesses = [];


search_input.addEventListener("input", search_suggest); // bei jedem Input neue Vorschläge
search_input.addEventListener("keydown", function(e) { // Tasten im Input-Feld
    if (e.key === "Enter") {
        take_guess();
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault(); // Pfeiltasten bewegen nicht mehr Stelle im Input
        navigate_suggestions(e);
    }
});

let searchbox = document.body.getElementsByClassName("searchbox")[0]; //Focus-Handling
search_input.addEventListener("focusout", function() {
    setTimeout(delete_suggestions, 0); // wichtig, um Fehler mit Buttons zu vermeiden
})
search_input.addEventListener("focusin", search_suggest);

let selected_char = null; // gewählter Charakter-Button


function char_picker() { // würfelt zu erratenden Charakter aus

    char_index = Math.floor(Math.random() * 3);
    picked_char = arr[char_index]; // wird in arr abgespeichert, sodass indexes nicht verrutschen
    console.log(picked_char[0]);
}

function search_suggest() { // Suchvorschläge


    var suggestions = document.getElementById("suggestions"); // Löschen der vorherigen Vorschläge
    while (suggestions.firstChild) {
        suggestions.removeChild(suggestions.firstChild);
    }

    if (no_matches = document.getElementById("no_matches")) {
        no_matches.remove();
    }

    selected_char = null; // Resetten des ausgewählten Buttons
    var search_input = document.getElementById("searchbar"); 
    var input = search_input.value.toLowerCase();
    var matches = [];
   
    if (input !== "") { // Vergleich mit charakter array
        for (let i=0; i<arr.length; i++) {
            if (arr[i][0].toLowerCase().startsWith(input)) {
                matches.push([arr[i][0], i]);
            }
        }
        sugg_arr = [];
        texte = []
        for (let i=0; i<matches.length; i++) { // jeder Trefer wird zu Element
            var sugg = document.createElement("li");
            var text = document.createElement("p");
            sugg_arr.push(sugg); // array, da anscheinend immer das letzte sugg sonst angesprochen wird
            texte.push(text);
            texte[i].textContent =  matches[i][0];
            sugg_arr[i].appendChild(texte[i]);
            sugg_arr[i].setAttribute("class", "char_list") // um ansprechbar zu sein in css
            suggestions.appendChild(sugg_arr[i]); // an die div dafür anhängen
            sugg_arr[i].addEventListener("click", function() { 
                selected_char = sugg_arr[i];
                take_guess();
            })
            sugg_arr[i].setAttribute("tabindex", "0"); // um anwählbar zu sein
            sugg_arr[i].setAttribute("data-reference-position", matches[i][1]);
        }

        if (matches.length == 0) {
            var no_matches  = document.createElement("div"); // falls keine Matches gefunden werden, eine Textbox, die das sagt
            var text = document.createElement("p");
            text.textContent = "Keinen Charakter gefunden!";
            no_matches.appendChild(text);
            no_matches.setAttribute("class", "no_matches");
            no_matches.setAttribute("id", "no_matches");
            searchbox.appendChild(no_matches);
        }
    }
   

}



function delete_suggestions() { //versteckt suggestions
    if(!searchbox.contains(document.activeElement)) { 
        suggestions = document.getElementById("suggestions");
        while (suggestions.firstChild) {

            suggestions.removeChild(suggestions.firstChild);

        }
    }
}



function navigate_suggestions(e) { // tastennavigierung der suggestions mit pfeilen und enter
    if (selected_char == null) { // selected_char, da mit Fokus die Searchbar aus dem Fokus gerät
        if (e.key === "ArrowDown") {
            if (document.getElementsByClassName("char_list").length > 0) {
            selected_char = document.getElementsByClassName("char_list")[0];
            selected_char.setAttribute("data-selected", "true"); // Attribut für css -> outline usw definieren, damit Nutzer sieht was gerade ausgewählt ist
            }
        }
    }
    else {
        if (e.key === "ArrowUp") {
            if (selected_char.previousElementSibling != null) {
            selected_char.removeAttribute("data-selected");
            selected_char = selected_char.previousElementSibling;
            selected_char.setAttribute("data-selected", "true");
            }
            else {
                selected_char.removeAttribute("data-selected");
                selected_char=null;
            }
        } 
        
     
        else if (e.key === "ArrowDown") {
            if (selected_char.nextElementSibling != null) {
            selected_char.removeAttribute("data-selected");
            selected_char = selected_char.nextElementSibling;
            selected_char.setAttribute("data-selected", "true");
            } else {
                selected_char.removeAttribute("data-selected");
                selected_char = document.getElementsByClassName("char_list")[0];
                selected_char.setAttribute("data-selected", "true");
            }
        }
        else if (e.key === "Enter") {
            take_guess;
        }
    }
}

function take_guess(optional_index) { //optional_index für Cookie der vorherigen Guesses

    var guessed_char_index; //index im array für geratenen charakter

    if (optional_index) {

        guessed_char_index = optional_index;

    } else {

        if (selected_char == null) {
            if (document.getElementsByClassName("char_list").length > 0) {
                guessed_char_index = document.getElementsByClassName("char_list")[0].getAttribute("data-reference-position"); //referenzierte index-positiotn wird abgerufen
            }
            else {
                return;
            }
        } else {
            guessed_char_index = selected_char.getAttribute("data-reference-position");
        }

    }
    
   
    var guess_div = document.createElement("DIV"); // box für einzelnen versuch
    guess_div.setAttribute("class", "guess");

    var box_name = document.createElement("DIV"); //einzelene attribut boxen
    var box_gender = document.createElement("DIV");
    var box_age = document.createElement("DIV");
    var box_arc = document.createElement("DIV");

    var text_name = document.createElement("p"); //text-objekte, da zentrierung leichter
    var text_gender = document.createElement("p");
    var text_age = document.createElement("p");
    var text_arc = document.createElement("p");

    box_name.setAttribute("class", "guess_square");
    box_gender.setAttribute("class", "guess_square");
    box_age.setAttribute("class", "guess_square");
    box_arc.setAttribute("class", "guess_square");

    var boxes = [box_name, box_gender, box_age, box_arc];
    var texte = [text_name, text_gender, text_age, text_arc];

    var guessbox = document.getElementsByClassName("guessbox")[0];
    guessbox.appendChild(guess_div);


    for (let i = 0; i<arr[0].length; i++) {
        
        texte[i].textContent = arr[guessed_char_index][i];
        boxes[i].appendChild(texte[i]);

        if (i==3) {
            boxes[i].classList.add("arcbox");
        }

        if (picked_char[i] == arr[guessed_char_index][i]) { // vergleich mit lösung
            boxes[i].classList.add("correct");
        } else {
            boxes[i].classList.add("incorrect");
            if (!isNaN(texte[i].textContent)) {
                const arrow = document.createElement("i");

                if (boxes[i] > picked_char[i]) {
                    arrow.classList.add("arrow", "down");
                    boxes[i].appendChild(arrow);
                    
                }
                else {
                    arrow.classList.add("arrow", "up");
                    boxes[i].appendChild(arrow);    
                }
            }
        }

        guess_div.appendChild(boxes[i]);
     
                
    }

    

    if (arr[guessed_char_index][0] == picked_char[0]) { // VERHALTEN BEI RICHTIGER LÖSUNG
        add_guesses(guessed_char_index);
        finish_game();
        

    } else {
        add_guesses(guessed_char_index);
        arr.splice(guessed_char_index, 1); // geratener charakter wird entfernt mit index

        search_input.value = null;
        search_suggest(); // vorschläge mit neuer auswahl
    }

   
}

function scroll_to_next_game() { // erzeugt button für nächstes spiel


    while(searchbox.firstChild) {
            searchbox.removeChild(searchbox.firstChild);
        }
    searchbox.remove();

    var nextg_container = document.createElement("DIV");
    var nextg_button = document.createElement("DIV");
    var button_text = document.createElement("p");
    var success_text = document.createElement("p");

    nextg_container.setAttribute("class", "nextg_container");
    nextg_button.setAttribute("class", "nextg_button");

    button_text.textContent = "Nächstes Spiel";
    success_text.textContent = "Glückwunsch! Du hast den heutigen Charakter, "+picked_char[0]+", erraten!";

    nextg_button.addEventListener("click", function() {
        window.location.href = "next.html";
    })

    var layout = document.getElementsByClassName("layout")[0];

    nextg_button.appendChild(button_text);
    nextg_container.appendChild(success_text);
    nextg_container.appendChild(nextg_button);
    layout.appendChild(nextg_container);

    
}



function finish_game() {

    add_confetti();
    set_streak();
    set_guessed_today();
    show_streak();
    scroll_to_next_game();

}

function check_cookie(name) { // funktion liest cookie mit parameterwert als namen und gibt den jeweiligen Wert des cookies zurück

    let cookies = decodeURIComponent(document.cookie).split(";");
    var value;

    for (let i=0; i<cookies.length; i++) {

        if (cookies[i].includes(name)) {
            value = cookies[i].substring(cookies[i].indexOf("=")+1);
            return value;
        }

    }

    return null;


}

function add_guesses (index){ // hier werden bisher abgegebene Versuche gespeichert in einem Cookie

    guesses.push(index); // joa

    var cookie_value = "";
        for (let i=0; i<guesses.length; i++) {

            if (i == guesses.length-1) {

                cookie_value = cookie_value + guesses[i];

            }
            else {

                cookie_value = cookie_value + guesses[i] + ","; // indexes mit kommas getrennt

            }

        }

    var current_date = new Date();
    current_date.setHours(23);
    current_date.setMinutes(59);
    document.cookie = "guesses=" + cookie_value + "; expires=" + current_date + ";";

}

function add_confetti() {

    if (!check_cookie("guessed_today")) { // damit das nur beim ersten Mal passiert

        confetti({particleCount:100, origin: {x:-0.3, y:1.3}, angle: 35, startVelocity: 90});
        confetti({particleCount:100, origin: {x:1.3, y:1.3}, angle: 145, startVelocity: 90});

    }

}

function show_previous_guesses() {
    if (check_cookie("guesses")) { // bisschen unschön, derzeit wird jedes Mal der Cookie komplett neu geschrieben, da er in take_guess neu gefüllt wird

        // es werden nun alle Tipps im Schnelldurchlauf nochmal abgegeben, damit man wieder auf demselben Stand ist

        var cookie_guesses = check_cookie("guesses").split(",");
        for (let i=0; i<cookie_guesses.length; i++) {
            take_guess(cookie_guesses[i]);

        }
    }
}

function set_guessed_today() { // "guessed_today" cookie. -> Man kann nur einmal spielen, die Konfetti animation wird sich beim erneut laden gespart etc. Läuft bis Tagesende

    if (!check_cookie("guessed_today")) {  

        var current_date = new Date();
        current_date.setHours(23);
        current_date.setMinutes(59);
        document.cookie = "guessed_today=true; expires="+current_date+";";
      

    }

}


function set_streak() { // Streak halt, läuft bis Ende des nächsten Tages, da sie da noch erhalten sein muss zum fortführen

     if (!check_cookie("guessed_today")) {

        var streak;

        if (check_cookie("streak")) {

            streak = Number(check_cookie("streak"))+1;
            console.log(streak);

        }
        else {

            streak = 1;

        }

          
        var current_date = new Date();
        current_date.setHours(23);
        current_date.setMinutes(59);

        current_date.setDate(current_date.getDate() +1);
        current_date = current_date.toUTCString();


        //document.cookie = "streak=1; expires="+current_date+";";
        document.cookie = "streak="+streak+"; expires="+current_date+";";

     }
}

function show_streak() { // Text, der die Streak zeigt

    let streak_box = document.getElementsByClassName("streak_box")[0];

    while (streak_box.firstChild) { // muss gelöscht werden, da streak bei lösung aktualisiert wird

        document.getElementsByClassName("streak_box")[0].removeChild(streak_box.firstChild);

    }

    let streak_value = 0;
    if (check_cookie("streak")) {

        streak_value = check_cookie("streak");

    }
    
    let streak_text = document.createElement("p");
        
    streak_text.textContent = "Deine derzeitige Streak: " + streak_value;

    document.getElementsByClassName("streak_box")[0].appendChild(streak_text);

    
}