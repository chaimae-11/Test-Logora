
const express = require('express'); 
const axios = require('axios'); 
const app = express(); 
const PORT = 3000; 

// Middleware pour le traitement des requêtes JSON
app.use(express.json());

// Endpoint pour la prédiction de modération
app.post('/api/moderation/predict', async (req, res) => {
  try {
    // Extraction des données de la requête
    const { text, language } = req.body;
    // Envoi d'une requête POST au service de modération avec les données extraites
    const response = await axios.post('https://moderation.logora.fr/predict', { text, language });
    // Envoi de la réponse du service de modération au client
    res.json(response.data);
  } catch (error) {
    res.status(error.response.status || 500).json({ erreur: error.message });
  }
});

// Endpoint pour l'évaluation du score de modération
app.post('/api/moderation/score', async (req, res) => {
  try {
    // Extraction des données de la requête
    const { text, language } = req.body;
    // Envoi d'une requête POST au service de modération avec les données extraites
    const response = await axios.post('https://moderation.logora.fr/score', { text, language });
    // Envoi de la réponse du service de modération au client
    res.json(response.data);
  } catch (error) {
    // En cas d'erreur, envoi d'un code d'erreur approprié avec un message d'erreur JSON
    res.status(error.response.status || 500).json({ erreur: error.message });
  }
});

// Démarrage du serveur et affichage d'un message dans la console pour indiquer qu'il est en cours d'exécution
app.listen(PORT, () => {
  console.log(`Le serveur fonctionne sur le port ${PORT}`);
});

// Exportation de l'application Express pour les tests
module.exports = app;
