const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process'); // Importer le module child_process

// Fonction pour obtenir le chemin de l'historique Chrome
const getChromeHistoryPath = () => {
    const userDataPath = path.join(process.env.LOCALAPPDATA, 'Google', 'Chrome', 'User Data');
    const profileFolder = fs.readdirSync(userDataPath).find(folder => folder.startsWith('Profile'));
    if (profileFolder) {
        return path.join(userDataPath, profileFolder, 'History');
    }
    return null;
};

// Fonction pour obtenir le chemin de l'historique Firefox
const getFirefoxHistoryPath = () => {
    const firefoxProfilePath = path.join(process.env.APPDATA, 'Mozilla', 'Firefox', 'Profiles');
    const profiles = fs.readdirSync(firefoxProfilePath);
    if (profiles.length > 0) {
        const profileFolder = profiles[0]; // Prenons le premier profil
        return path.join(firefoxProfilePath, profileFolder, 'places.sqlite');
    }
    return null;
};

// Fonction pour obtenir le chemin de l'historique Edge
// const getEdgeHistoryPath = () => {
//     const userDataPath = path.join(process.env.LOCALAPPDATA, 'Microsoft', 'Edge', 'User Data');
//     const profileFolder = fs.readdirSync(userDataPath).find(folder => folder.startsWith('Profile'));
//     if (profileFolder) {
//         return path.join(userDataPath, profileFolder, 'History');
//     }
//     return null;
// };

// Fonction pour récupérer l'historique
const getHistory = () => {
    const chromeHistoryPath = getChromeHistoryPath();
    const firefoxHistoryPath = getFirefoxHistoryPath();
    // const edgeHistoryPath = getEdgeHistoryPath();

    let db;
    if (chromeHistoryPath) {
        db = new sqlite3.Database(chromeHistoryPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
                return 'Erreur de connexion à l\'historique Chrome.';
            }
        });
    } else if (firefoxHistoryPath) {
        db = new sqlite3.Database(firefoxHistoryPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
                return 'Erreur de connexion à l\'historique Firefox.';
            }
        });
    } //else if (edgeHistoryPath) {
        // db = new sqlite3.Database(edgeHistoryPath, sqlite3.OPEN_READWRITE, (err) => {
        //     if (err) {
        //         console.error(err.message);
        //         return 'Erreur de connexion à l\'historique Edge.';
        //     }
        // });
    //} 
    else {
        return 'Aucun historique trouvé pour Chrome, Firefox ou Edge.';
    }

    const query = `SELECT url, title, visit_count, last_visit_time 
                   FROM urls 
                   ORDER BY last_visit_time DESC`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return 'Erreur lors de la récupération de l\'historique.';
        }
        console.log(rows); // Affiche les résultats
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
    });
};

// Fonction pour vider l'historique
const clearHistory = () => {
    const chromeHistoryPath = getChromeHistoryPath();
    const firefoxHistoryPath = getFirefoxHistoryPath();
    // const edgeHistoryPath = getEdgeHistoryPath();

    let db;
    if (chromeHistoryPath) {
        db = new sqlite3.Database(chromeHistoryPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
                return 'Erreur de connexion à l\'historique Chrome.';
            }
        });
    } else if (firefoxHistoryPath) {
        db = new sqlite3.Database(firefoxHistoryPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error(err.message);
                return 'Erreur de connexion à l\'historique Firefox.';
            }
        });
     } //else if (edgeHistoryPath) {
    //     db = new sqlite3.Database(edgeHistoryPath, sqlite3.OPEN_READWRITE, (err) => {
    //         if (err) {
    //             console.error(err.message);
    //             return 'Erreur de connexion à l\'historique Edge.';
    //         }
    //     });
    // } 
    else {
        return 'Aucun historique trouvé pour Chrome, Firefox ou Edge.';
    }

    const deleteQuery = `DELETE FROM urls`; // Cette requête peut être différente pour Firefox et Edge

    db.run(deleteQuery, [], (err) => {
        if (err) {
            console.error(err.message);
            return 'Erreur lors de la suppression de l\'historique.';
        }
        console.log('Historique vidé avec succès.'); // Message de succès
    });

    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
    });
};

// Fonction pour fermer et rouvrir Chrome et Edge
const restartBrowsers = () => {
    exec('taskkill /F /IM chrome.exe', (err) => { // Ferme Chrome
        if (err) {
            console.error('Erreur lors de la fermeture de Chrome:', err);
            return;
        }
        console.log('Chrome fermé avec succès.');

        // exec('taskkill /F /IM msedge.exe', (err) => { // Ferme Edge
        //     if (err) {
        //         console.error('Erreur lors de la fermeture de Edge:', err);
        //         return;
        //     }
        //     console.log('Edge fermé avec succès.');

        //     // Attendre un moment avant de rouvrir les navigateurs
        //     setTimeout(() => {
        //         exec('start chrome', (err) => { // Ouvre Chrome
        //             if (err) {
        //                 console.error('Erreur lors de l\'ouverture de Chrome:', err);
        //                 return;
        //             }
        //             console.log('Chrome ouvert avec succès.');
        //         });

        //         exec('start msedge', (err) => { // Ouvre Edge
        //             if (err) {
        //                 console.error('Erreur lors de l\'ouverture de Edge:', err);
        //                 return;
        //             }
        //             console.log('Edge ouvert avec succès.');
        //         });
        //     }, 1000); // Attendre 1 seconde
        // });
    });
};

// Exemple d'utilisation
getHistory(); // Pour récupérer l'historique
clearHistory(); // Pour vider l'historique
restartBrowsers(); // Pour fermer et rouvrir Chrome et Edge
