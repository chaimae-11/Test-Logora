const axios = require('axios');
const express = require('express');
const supertest = require('supertest');

const app = require('./server.js'); 

describe('Test des endpoints de modération', () => {
  // Test pour l'endpoint de prédiction de modération
  it('Devrait prédire la modération avec succès', async () => {
    const mockData = {
      text: 'Contenu à modérer',
      language: 'fr-FR' 
    };

    // Mock de la réponse de l'API Logora pour la prédiction de modération
    axios.post = jest.fn().mockResolvedValue({ data: { prediction: 'modéré' } });

    const response = await supertest(app)
      .post('/api/moderation/predict')
      .send(mockData);

    expect(response.status).toBe(200);
    expect(response.body.prediction).toBe('modéré');
  });

  // Test pour l'endpoint d'évaluation du score de modération
  it('Devrait évaluer le score de modération avec succès', async () => {
    const mockData = {
      text: 'Contenu à modérer',
      language: 'fr' // Remplacez par la langue appropriée si nécessaire
    };

    // Mock de la réponse de l'API Logora pour l'évaluation du score de modération
    axios.post = jest.fn().mockResolvedValue({ data: { score: 0.85 } });

    const response = await supertest(app)
      .post('/api/moderation/score')
      .send(mockData);

    expect(response.status).toBe(200);
    expect(response.body.score).toBeCloseTo(0.85);
  });

  // Test pour vérifier la gestion des erreurs
  it('Devrait gérer les erreurs correctement', async () => {
    const mockData = {
      text: 'Contenu à modérer',
      language: 'fr-FR' 
    };

    // Mock de la réponse d'erreur de l'API Logora
    axios.post = jest.fn().mockRejectedValue({ response: { status: 500, data: { erreur: 'Erreur de l\'API Logora' } } });

    const response = await supertest(app)
      .post('/api/moderation/predict')
      .send(mockData);

    expect(response.status).toBe(500);
    expect(response.body.erreur).toBe('Erreur de l\'API Logora');
  });
});
