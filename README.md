# 🌦️ Clima Agora — CEP, Clima e Alertas Oficiais

Aplicação web front-end que, a partir de um único CEP, encadeia quatro APIs públicas para entregar endereço, temperatura em tempo real, previsão dos próximos 7 dias e alertas meteorológicos oficiais do INMET — tudo sem backend e sem cadastro.

`html` `css` `javascript` `fetch-api` `viacep` `nominatim` `open-meteo` `inmet` `geocoding` `weather-app`

## 🔗 Demo

https://previsaotempo-consumoapi.netlify.app/

## ✨ Funcionalidades

- Busca de endereço e código IBGE do município a partir do CEP, via [API ViaCEP](https://viacep.com.br/)
- Geocodificação automática (cidade/UF → latitude/longitude) via [API Nominatim](https://nominatim.org/) (OpenStreetMap) — o usuário não precisa saber nem digitar coordenadas
- Temperatura atual em tempo real e previsão dos próximos 7 dias (máxima, mínima e chance de chuva), via [API Open-Meteo](https://open-meteo.com/)
- Alertas meteorológicos oficiais do INMET para o município consultado, via a API pública [radarmeteorologico.com.br](https://radarmeteorologico.com.br/api-publica)
- Validação de CEP no front-end antes da requisição
- Tratamento de erro de rede/API com feedback visual para o usuário
- Interface responsiva, tipografia DM Sans / Space Grotesk

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript (Fetch API, `async/await`) — sem frameworks

## 🔌 APIs consumidas

| API | Uso |
|---|---|
| [ViaCEP](https://viacep.com.br/) | Endereço e código IBGE a partir do CEP |
| [Nominatim](https://nominatim.org/) (OpenStreetMap) | Geocodificação (cidade/UF → latitude/longitude) |
| [Open-Meteo](https://open-meteo.com/) | Temperatura atual e previsão dos próximos 7 dias |
| [radarmeteorologico.com.br](https://radarmeteorologico.com.br/api-publica) | Alertas oficiais do INMET por município |

## 🚀 Como rodar localmente

```bash
git clone https://github.com/KelBaker/Consumo-API---Previsao-tempo.git
cd Consumo-API---Previsao-tempo
```

Depois é só abrir o `index.html` no navegador (ou usar a extensão **Live Server** do VSCode para hot-reload).

## 🔭 Possíveis melhorias

- Corrigir a exibição das colunas de endereço em telas pequenas (hoje só o logradouro aparece no mobile)
- Estado de carregamento no botão enquanto as buscas estão em andamento
- Suportar múltiplos alertas simultâneos por região (hoje exibe apenas o primeiro encontrado)
- Cache local das últimas buscas

## 📄 Licença

Este projeto está sob a licença MIT — veja o arquivo [LICENSE](LICENSE) para mais detalhes.
