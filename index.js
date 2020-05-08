#!/usr/bin/env node

//console.log("Hello, Node.JS!");

//console.log("yes!! frist test is good!!!!! :D ");

const readlineSync = require("readline-sync");
const {
    getCode,
    getName,
    getData,
    getNames
} = require("country-list");
const axios = require("axios");
let countryCode;
const chalk = require("chalk");
const ora = require("ora");
const figlet = require("figlet");

// Demander à l'utilisateur d'entrer un nom de pays valide, la fonction continue de demander jusqu'à ce que le nom soit correct
function getUserCountryCode() {
    let countryCode = getCode(
        readlineSync.question("hey, enter a country name : ")
    );
    while (countryCode == null) {
        console.log("Sorry country not found! try again..");
        countryCode = getCode(
            readlineSync.question(" hey, enter a country name : ")
        );
    }
    return countryCode;
}

// Obtenir l'argument donné par l'utilisateur à partir de la commande de la console
// Exemple $ holidates switzerland
if (process.argv[2]) {
    countryCode = getCode(process.argv[2]);
}

if (countryCode == null) {
    countryCode = getUserCountryCode();
}
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
// GET /PublicHolidays/{Year}/{CountryCode}

const request =
    "https://date.nager.at/api/v2/publicholidays/" +
    currentYear +
    "/" +
    countryCode;

function dateAndName(item, index) {
    console.log(
        chalk.red(item.date) + chalk.blue(" : ") + chalk.greenBright(item.name)
    );
}

// en utilisant la requête avec axios pour obtenir la réponse de l'API
figlet(countryCode + " " + "holidays in" + " " + currentYear, function (
    err,
    data
) {
    if (err) {
        console.log("Something went wrong");
        console.dir(err);
        return;
    }
    console.log(data);
});
const spinner = ora("Checkin database").succeed();
if (countryCode) {
    axios
        .get(request)
        .then(function (response) {
            // gérer le succès
            let countryHolidays = response.data;
            countryHolidays.forEach(dateAndName);
        })
        .catch(function (error) {
            // gérer l'erreure
            console.log("error");
        })
        .finally(function () {
            // toujours executer
        });
}