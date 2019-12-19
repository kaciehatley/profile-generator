var inquirer = require("inquirer");
var fs = require('fs');
const axios = require("axios");
const util = require("util");
var pdf = require('html-pdf');

let generateHTML = require("./generateHTML");


const writeFileAsync = util.promisify(fs.writeFile);

const questions = ["What is your Github username?", "What is your favorite color?"];


function colorPrompt() {
    return inquirer
    .prompt([

        {
        type: "list",
        message: questions[1],
        name: "color",
        choices: [
            "green",
            "blue",
            "pink",
            "red"
        ]
        },
    ])

//             const data =
//             console.log(res.data.avatar_url);
//             console.log(res.data.name);
//             console.log(res.data.location);
//             console.log(res.data.html_url);
//             console.log(res.data.bio);
//             console.log(res.data.public_repos);
//             console.log(res.data.followers);
//             console.log(res.data.following);

}

async function dataPrompt() {

    const userNamePrompt = await inquirer.prompt({type: "input", message: questions[0], name: "username"})
   
    const gitHubData = await axios.get(`https://api.github.com/users/${userNamePrompt.username}`);

    return gitHubData;

}

async function init() {
    const colorData = await colorPrompt();
    const data = await dataPrompt();

    const html = await generateHTML.generateHTML(colorData, data);

    await writeFileAsync("index.html", html);

    var doc = fs.readFileSync('index.html', 'utf8');
    var options = { format: 'Letter', orientation: "portrait" };

    pdf.create(doc, options).toFile(data.data.name + '.pdf', function(err, res) {
      if (err) return console.log(err);
    });

}

init();
