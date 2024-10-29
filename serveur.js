const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Chemin vers le fichier d'historique de Chrome

// console.log(process.env.LOCALAPPDATA);
// const historyPath = path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'User Data', 'Profile 1', 'History');

// Chemin vers le fichier d'historique de Chrome
const fs = require('fs');

// Chemin vers le dossier Chrome User Data
const userDataPath = path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'User Data');

// Trouve le profil Chrome en vérifiant le premier dossier "Profile *" dans "User Data"
const profileFolder = fs.readdirSync(userDataPath).find(folder => folder.startsWith('Profile'));

// Vérifie si un profil a été trouvé
if (!profileFolder) {
    console.error("Aucun profil Chrome trouvé dans le dossier User Data.");
    process.exit(1);
}

// Chemin du fichier d'historique pour le profil détecté
const historyPath = path.join(userDataPath, profileFolder, 'History');
console.log("Chemin d'accès à l'historique:", historyPath);

// Création d'une connexion à la base de données SQLite
console.log("Chemin d'accès à l'historique:", historyPath);

let db = new sqlite3.Database(historyPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.log('Connect verif');
        console.error(err.message);
    } else {
        console.log('Connecté à la base de données historique de Chrome.');
    }
});

// Requête pour vider l'historique
const query2 = `delete FROM urls `; // Limité à 10 entrées pour cet exemple

db.all(query2, [], (err, rows) => {
    if (err) {
        throw err;
    }
   
});


// Requête pour récupérer l'historique
const query = `SELECT url, title, visit_count, last_visit_time 
               FROM urls 
               ORDER BY last_visit_time DESC 
              `; // Limité à 10 entrées pour cet exemple

db.all(query, [], (err, rows) => {
    if (err) {
        throw err;
    }
    // Affiche les résultats
    rows.forEach((row) => {
        console.log(`test view ${row.title} - ${row.url}`);
    });
});



// Ferme la base de données
db.close((err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connexion à la base de données fermée.');
    }
});
