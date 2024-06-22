# Código Fonte

Mantenha neste diretório todo o código fonte do projeto.

Se necessário, descreva neste arquivo aspectos relevantes da estrutura de diretórios criada para organização do código.

Uma sugestão da estrutura de diretórios para o projeto é a seguinte:

```plaintext
codigo/  (essa pasta aqui)
│
├── index.html
│
├── assets/
│   ├── css/
│   │   ├── styles.css
│   │   └── (outros arquivos .css)
│   │
│   ├── js/
│   │   ├── main.js
│   │   └── (outros arquivos .js)
│   │
│   ├── images/
│   │   ├── logo.png
│   │   └── (outras imagens)
│   │
│   └── fonts/
│       ├── font1.ttf
│       └── (outras fontes)
│
├── pages/
│   ├── about.html
│   ├── contact.html
│   └── (outras páginas)
│
└── README.md
```

Utilize a pasta pages para manter um arquivo para cada pessoa por artefato (sprints 2 e 3) e, com isso, isolar as alterações de cada pessoa, facilitando o trabalho de gestão do código.


--- INDEX.JS REPLIT
const express = require('express');
const jsonServer = require('json-server');
const cors = require('cors');
const fetch = require('node-fetch');

const PORT = process.env.PORT || 3000;
const MY_API_GOOGLE = process.env['API_GOOGLE_KEY'];
const MY_API_RECEITAWS = process.env['chave-api-dados'];

const app = express();
const router = jsonServer.router('./db/db.json');
const middlewares = jsonServer.defaults();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(middlewares);

// Configuração dos cabeçalhos CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  next();
});

// Rota para geocodificação
app.get("/geocode", async (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.status(400).json({ error: 'Endereço não fornecido' });
  }

  try {
    const { latitude, longitude } = await geocode(address);
    res.json({ latitude, longitude });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/checkCnpj", async (req, res) => {
  const cnpj = req.query.cnpj;
  if (!cnpj) {
    return res.status(400).json({ error: 'CNPJ não fornecido' });
  }

  try {
    const cnpjData = await checkCnpj(cnpj);
    res.json(cnpjData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function geocode(address) {
  const params = new URLSearchParams({
    key: MY_API_GOOGLE,
    address: address,
  });

  const baseUrlGoogle = 'https://maps.googleapis.com/maps/api/geocode/json';
  const url = `${baseUrlGoogle}?${params.toString()}`;

  const response = await fetch(url);

  if (response.ok) {
    const data = await response.json();
    if (data.status === 'OK') {
      const geometry = data.results[0].geometry;
      const latitude = geometry.location.lat;
      const longitude = geometry.location.lng;
      return { latitude, longitude };
    } else {
      throw new Error('Não foi possível geocodificar o endereço');
    }
  } else {
    throw new Error('Erro ao conectar com o servidor de geocodificação');
  }
}

async function checkCnpj(cnpj) {
  const url = 'https://www.receitaws.com.br/v1/cnpj/' + cnpj;

  const response = await fetch(url, { headers: { 'key': MY_API_RECEITAWS } });

  if (response.ok) {
    const data = await response.json();
    if (data.status === 'OK') {
      return data;
    } else {
      throw new Error('Não foi possível obter as informações do CNPJ');
    }
  } else {
    throw new Error('Erro ao conectar com o servidor da receita WS');
  }
}

// Integrando o JSON Server com o Express na rota '/api'
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

