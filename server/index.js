const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

const API_key = process.env.X_Api_Key;

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

const apiClient = axios.create({
    baseURL: 'https://api.pokemontcg.io/v2/cards',
    headers: {
        'X-Api-Key': API_key
    }
});

app.get('/homePokemon', async (req, res) => {
    try {
        const pageSize = 20;
        const page = req.query.page || 1;
        const response = await apiClient.get('/', { params: { pageSize, page } });
        cards = response.data.data; // Atualiza as cartas globais
        const currentPage = parseInt(page);
        const totalPages = Math.ceil(response.data.totalCount / pageSize);
        res.render('homePokemon', { cards, currentPage, totalPages });
    } catch (error) {
        console.error('Erro ao buscar as cartas:', error);
        res.render('erro', { mensagem: 'Erro ao buscar as cartas' });
    }
});

app.post('/searchPokemon', async (req, res) => {
    const namePokemon = req.body.pokemonName.toLowerCase();
    const pageSize = 20; 
    const page = req.query.page || 1; 
    try {
        const response = await apiClient.get('/');
        const allcards = response.data.data;
        const cardFiltered = allcards.filter(card => card.name.toLowerCase().includes(namePokemon));
        const totalCount = cardFiltered.length; 
        const totalPages = Math.ceil(totalCount / pageSize);
        const currentPage = parseInt(page);
        res.render('searchPokemon', { cards: cardFiltered, currentPage, totalPages, page });
    } catch (error) {
        console.error('Erro ao buscar as cartas:', error);
        res.render('erro', { mensagem: 'Erro ao buscar as cartas' });
    }
});

const port = 5000;
    app.listen(port, () => {
        console.log(`Servidor está rodando em http://localhost:${port}`);
    });
