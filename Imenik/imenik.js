var currentFocus;

/*  The autocomplete function takes the text field element. Funkcija autocomplete preuzima element tekstualnog polja.
    inp - element polja za unos teksta.*/

function autocomplete(inp) {
    /*Funkcija uklanjanja „aktivne“ klase iz svih autocomplete items.
    autocompleteList - niz autocomplete rezultata */
    function removeActive(autocompleteList) {

        if (!autocompleteList) return;
        for (var i = 0; i < autocompleteList.length; i++)
            autocompleteList[i].classList.remove("autocomplete-active");
    }

    /* Klasifikuje stavku u fokusu kao aktivnu*/
    function addActive(autocompleteList) {

        if (!autocompleteList) return false;

        removeActive(autocompleteList); /*pocinje uklanjanjem „aktivne“ klase na svim stavkama:*/

        if (currentFocus >= autocompleteList.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (autocompleteList.length - 1);
        /*dodaje klasu autocomplete-active*/
        autocompleteList[currentFocus].classList.add("autocomplete-active");
    }

    /*Zatvara sve autocomplete liste u dokumentu, osim one koja je data kao argument.
      elmnt - autocomplete lista koja ne sme biti zavorena 
    */
    function closeAllLists(elmnt) {

        var x = document.getElementsByClassName("autocomplete-items");

        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /* Dobija nove vrednosti svaki put kada se input „inp“ polje menja.*/
    function onInputChange() {
        var b, i;
        var val = inp.value;
        console.log(val);
        closeAllLists(); // Zatvara svaku vec otvorenu listu od autocompleted values.
        currentFocus = -1; // Setuje trenutni focus na pocetak. 
        if (!val) {
            return false;
        }

        /*kreira DIV element koji ce sadrzati items (vrednosti):*/
        var container = document.createElement("DIV");
        container.setAttribute("id", inp.id + "autocomplete-list");
        container.setAttribute("class", "autocomplete-items");
        inp.parentNode.appendChild(container); // Dodaje DIV element kao child u autocomplete container

        /*AJAX REQUEST.

         var xhttp = new XMLHttpRequest();
         xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
               SetUpDropDownMenu(responseText);
            }
          };
         xhttp.open("GET", "imenik.txt", true);
         xhttp.send();
*/
        function SetUpDropDownMenu(responseText) {
            var responseText = "0000001 | Pera | Peric | Despota Stefana 22 | Beograd | 011/222-333-444-4 | pera@gmail.com \n" +
                "0000002 | Mihajlo | Blanusa | Dusana Silnog 44 | Stara Pazova | 011/222-555-777-2 | mihajlo@ptt.rs \n"
            "0000003 | Haris | Zacirovic | Omladinska  22 | Novi Pazar | 020/222-333-444-9 | hari@gmail.com \n";

            var lines = responseText.split("\n");
            for (var i = 0; i < lines.length; i++) {
                if (lines[i].includes(val)) {
                    /* Za svaku stavku u nizu koji sadrži pretraženi val kreira DIV element*/

                    result = document.createElement("DIV");

                    result.innerHTML = lines[i];

                    /* Insertuje polje za unos koje će imati vrednost trenutne stavke niza:*/
                    result.innerHTML += "<input type='hidden' value='" + lines[i] + "'>";

                    /* Funkcija se izvrsava kada neko klikne na vrednost predmeta (DIV element):*/
                    result.addEventListener("click", function(e) {
                        /* umetnite vrednost za autocomplete tekstualno polje:*/
                        inp.value = this.getElementsByTagName("input")[0].value;
                        /*zatvara listu od autocompleted vrednosti, ili bilo koje druge otvorene liste automatski autocompleted vrednosti:*/
                        closeAllLists();
                    });
                    container.appendChild(result);
                }
            }
        }

        SetUpDropDownMenu("dsiaidj");


    }

    inp.addEventListener("input", onInputChange);

    /*Funkcija se izvrsava kada se klikne*/
    // document.addEventListener("click", function (e) {
    //     closeAllLists(e.target);
    // });

    /*Funkcija se izvrsava kada se pritisne key na tastatutri:*/
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /* Ako pritisnete taster strelicu (DOWN key), povećava se promenljiva currentFocus*/
            currentFocus++;
            /*Trenutan item je visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up key
            /*Ako pritisnete taster strelicu (UP key), smanjujue se promenljiva currentFocus:*/
            currentFocus--;
            /* Trenutan item je visible:*/
            addActive(x);
        } else if (e.keyCode == 13) { //enter
            /* Ako pritisnete ENTER, sprecava se da forma bude submitted*/
            e.preventDefault();
            if (currentFocus > -1) {
                /* simulira click na "activnu" stavku:*/
                if (x) x[currentFocus].click();
            }
        }
    });
}