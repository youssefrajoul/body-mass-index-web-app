/**
 * Tableaux de donnees global
 */
let tabImc = [16.5, 18.5, 25, 30, 35, 40];
let tabDescription = ["denutrition", "maigreur", "poids normal", "surpoids", "obesite modree", "obesite severe", "obesite morbide ou massive"]
let tabIntervallesPoids = [];

/**
 * this function use description[]Array to give the user a description of his/her IMC
 * @param {*} imcUser 
 * @returns resultat is a description of the user's IMC
 */
function imcDescription(imcUser) {
    let resultat = "obesite morbide ou massive";
    for (let i = 0; i < tabImc.length; i++) {
        if (imcUser < tabImc[i]) {
            resultat = tabDescription[i];
            i = tabImc.length;
        }
    }
    return resultat;
}

/**
 * this function calculate the IMC of the user
 * @param {*} p the first parameter is the the weight of the user
 * @param {*} t the second parameter is the height of the user
 * @returns IMC the body mass index
 */
function calculerImc(p, t) {
    const imc = (Math.round((t / (p * p)) * 100) / 100).toFixed(1);
    return imc;
}

/**
 * this function shows all the tables
 * @param {*} quelTableau 1 for the first & 2 for the dynamic table
 * @param {*} colonne1DuTableau data of the first column "IMC ou Poids"
 */
function afficherTableau(quelTableau, colonne1DuTableau, imc) {
    if(quelTableau === 2) {
        $(".thead-tableau2").show();
    };
    for (let i = 1; i <= tabDescription.length; i++) { 
        const line = $("<tr>");
        if (i === 1) {
            line
                .append($("<td>")
                    .text(`moins de ${colonne1DuTableau[i - 1]}`))
                .append($("<td>")
                    .text(tabDescription[i - 1]));
            $(`.tableBody${quelTableau}`)
                .append(line);
        } else if (i === tabDescription.length) {
            line
                .append($("<td>").text(`${colonne1DuTableau[i - 2]}  et plus`))
                .append($("<td>").text(`${tabDescription[i - 1]}`));
            $(`.tableBody${quelTableau}`)
                .append(line);
        } else {
            line
                .append($("<td>").text(`${colonne1DuTableau[i - 2]} à ${colonne1DuTableau[i - 1]}`))
                .append($("<td>").text(tabDescription[i - 1]));
            $(`.tableBody${quelTableau}`)
                .append(line);
        };
    }
    $(`.tableBody2 tr:nth-child(${tabEvidence(imc)})`).addClass("categorie-en-evidence");
}

/**
 * Set tabIntervallesPoids data
 * @param {*} taille User's height 
 */
function generertabIntervallesPoids(taille) {
    for (let i = 0; i < tabDescription.length; i++) {
        tabIntervallesPoids[i] = (Math.round(((tabImc[i] * (taille * taille)) * 100) / 100));
    }
}

/**
 * 
 * @param {*} imcEvidence is the IMC of the user
 * @returns the position of the IMC among the table
 */
function tabEvidence(imcEvidence) {
    // declare and set the last element of the table "tabImc"
    let indiceCategorie = tabImc.length;
    for (let i = 0; i < tabImc.length; i++) {
        if (imcEvidence < tabImc[i]) {
            indiceCategorie = i;
            i = tabImc.length;
        }
    }
    return indiceCategorie + 1;
}

/**
 * This function get all data from Browser's local storage and show it in html
 */
function getAllStorage() {
    keys = Object.keys(localStorage);
    for (let i = 0; i < keys.length; i++) {
        $("#list-historique").append($("<p>").text(('IMC ' + (i + 1)) + " / " + (localStorage.getItem('IMC ' + (i + 1)))));
    };
}

/**
 * function to get date
 * @returns time 
 */
function time() {
    let date = new Date();
    let time = (date.getDate()) + "/" + (date.getMonth() + 1) + "/" + (date.getFullYear()) + " | " + (date.getHours()) + ":" + (date.getMinutes()) + ":" + (date.getSeconds());
    return time;
}

//instructions to set i equal to localStorage,length
keys = Object.keys(localStorage);
i = keys.length;

$(function () {
    $(".thead-tableau2").hide();
    afficherTableau(1, tabImc);
    $("#calcul").on("click", function () {
        $(this).attr('data-click-state', 1);
        $(".enteteTab2").remove();
        $(".tableBody2 > *").remove();
        let taille = $("#taille").val() / 100;
        let poids = $("#poids").val();
        let imc = calculerImc(taille, poids);
        generertabIntervallesPoids(taille);
        $(".afficheImc-paragraph").text(`Avec votre taille (${taille}m)  et votre poide (${poids})kg, votre IMC est de ${imc} et est considere comme ${imcDescription(imc)}. Avec votre taille, voici votre categorie d'IMC en fonction de votre poids:`);
        afficherTableau(2, tabIntervallesPoids, imc);
    });

    $("#enregistrer-button").on("click", function () {
        if ($("#calcul").attr('data-click-state') == 1) {
            let taille = $("#taille").val() / 100;
            let poids = $("#poids").val();
            let imc = calculerImc(taille, poids);
            //increment local storage key position
            i++;
            if (imc > 0) {
                localStorage.setItem(`IMC ${i}`, `Date: ${time()} / IMC: ${imc}`);
                alert(`IMC: ${imc} enregistré`);
            };
        };

    });
    $("#historique-button").on("click", function () {


        if ($(this).attr('data-click-state') == 0) {
            // Make historique-button ready to for user click
            $(this).attr('data-click-state', 1);
            $("#list-historique > *").remove();
            $("#supprimer-tout").remove();
            if (localStorage.length <= 0) {
                alert("Aucun Historique");
                $("#historique-button").attr('data-click-state', 0);
            };
            if (localStorage.length > 0) {
                $("#list-historique").before(`<button id="supprimer-tout" type="button" class="btn btn-outline-primary">supprimer-tout</button>`);
            };
            $("#supprimer-tout").on("click", function () {
                if (localStorage.length > 0) {
                    localStorage.clear();
                }
                $("#list-historique > *").remove();
                $("#supprimer-tout").remove();
                location.reload();
                // Make historique-button ready to for user click
                $("#historique-button").attr('data-click-state', 1);
            });
            getAllStorage().delay(800);
        }
        else {
            $(this).attr('data-click-state', 0);
            $("#list-historique > *").remove();
            $("#supprimer-tout").remove();
        };
    });
});