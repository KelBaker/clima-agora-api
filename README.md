# 🌦️ DncWeather — Consulta de CEP e Previsão do Tempo

Aplicação web front-end que consome duas APIs públicas para buscar o endereço a partir de um CEP e exibir a previsão de temperatura da região, sem necessidade de backend.

`html` `css` `javascript` `fetch-api` `viacep` `open-meteo` `web-scraping-free` `weather-app`

## 🔗 Demo

https://previsaotempo-consumoapi.netlify.app/

## ✨ Funcionalidades

- Busca de endereço (logradouro, bairro, cidade/UF) a partir do CEP, via [API ViaCEP](https://viacep.com.br/)
- Consulta da temperatura atual por latitude/longitude, via [API Open-Meteo](https://open-meteo.com/)
- Validação de CEP, latitude e longitude no front-end antes da requisição
- Tratamento de erro de rede/API com feedback visual para o usuário
- Interface responsiva com tipografia do Google Fonts (Inter Tight)

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript (Fetch API, `async/await`)

## 🚀 Como rodar localmente

```bash
git clone https://github.com/KelBaker/Consumo-API---Previsao-tempo.git
cd Consumo-API---Previsao-tempo
```

Depois é só abrir o `index.html` no navegador (ou usar a extensão **Live Server** do VSCode para hot-reload).

## 🔭 Possíveis melhorias

- Obter latitude/longitude automaticamente a partir do CEP (hoje são digitadas manualmente)
- Exibir previsão para os próximos dias, não só a temperatura atual
- Cache local das últimas buscas

## 📄 Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](LICENSE) para mais detalhes.
