// solicitação viacep
async function buscarCEP(cep) {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        // ViaCEP não devolve erro HTTP pra CEP inexistente, só { erro: true }
        if (data.erro) {
            alert('CEP não encontrado. Verifique e tente novamente.');
            return null;
        }

        return data;
    } catch (error) {
        // a ViaCEP às vezes falha antes de devolver JSON (CEP fora de qualquer
        // faixa válida, ou falha de rede) — nos dois casos, avisa o usuário
        console.error('Erro ao buscar informações de CEP:', error);
        alert('Não foi possível verificar esse CEP. Ele pode não existir, ou houve uma falha de rede.');
        return null;
    }
}

// solicitação nominatim
async function buscarCoordenadas(localidade, uf) {
    try {
        const query = encodeURIComponent(`${localidade}, ${uf}, Brasil`);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`);
        const data = await response.json();

        if (data.length > 0) {
            return { latitude: data[0].lat, longitude: data[0].lon };
        }
        return null;
    } catch (error) {
        console.error('Erro ao buscar coordenadas:', error);
        return null;
    }
}

// solicitação alertas INMET (via radarmeteorologico.com.br)
async function buscarAlertaINMET(uf, ibge) {
    try {
        const response = await fetch(`https://radarmeteorologico.com.br/api/v1/alertas?uf=${uf}`);
        const data = await response.json();

        const alertaLocal = data.alertas.find(alerta => alerta.geocodes.includes(Number(ibge)));
        return alertaLocal || null;
    } catch (error) {
        console.error('Erro ao buscar alerta do INMET:', error);
        return null;
    }
}

// deixa a primeira letra maiúscula ("terça-feira" -> "Terça-feira")
function capitalizar(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// converte "2026-09-01 00:01" em "Terça-feira, 01/09 às 00:01"
function formatarDataAlerta(dataString) {
    const [data, hora] = dataString.split(' ');
    const [ano, mes, dia] = data.split('-');
    const nomeDia = capitalizar(new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'long' }));
    return `${nomeDia}, ${dia}/${mes} às ${hora}`;
}

function exibirAlertaINMET(alerta) {
    const container = document.getElementById('alerta-inmet');

    if (alerta) {
        const periodo = `${formatarDataAlerta(alerta.inicio)} até ${formatarDataAlerta(alerta.fim)}`;
        const rotuloPeriodo = alerta.futuro ? 'Previsto para' : 'Válido de';

        container.classList.add('alerta-ativo');
        container.innerHTML = `
            <div class="alerta-header">
                <span class="alerta-icone">⚠️</span>
                <div>
                    <span class="alerta-evento">${alerta.evento}</span>
                    <span class="alerta-severidade">${alerta.severidade}</span>
                </div>
            </div>
            <p class="alerta-risco">${alerta.riscos[0]}</p>
            <span class="alerta-periodo">📅 ${rotuloPeriodo} ${periodo}</span>
        `;
    } else {
        container.classList.remove('alerta-ativo');
        container.innerHTML = `<p>✅ Nenhum alerta oficial do INMET para a sua região no momento.</p>`;
    }
}

// solicitação openmeteo (temperatura atual + previsão dos próximos dias)
async function buscarPrevisaoTempo(latitude, longitude) {
    try {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`);
        const data = await response.json();

        if (data.current_weather) {
            const temperaturaAtual = data.current_weather.temperature;

            document.getElementById('temperatura-atual').textContent = `${temperaturaAtual}°C`;
            document.querySelector('.tempo-resultado p').textContent = `Temperatura atual na região: ${temperaturaAtual}°C`;

            if (data.daily) {
                exibirPrevisaoSemanal(data.daily);
            }

            return temperaturaAtual;
        } else {
            throw new Error('Dados de temperatura não encontrados');
        }
    } catch (error) {
        console.error('Erro ao buscar previsão do tempo:', error);
        document.querySelector('.tempo-resultado p').textContent = 'Não foi possível obter a previsão do tempo.';
        return null;
    }
}

// escolhe um emoji simples de acordo com a chance de chuva do dia
function iconePorChanceDeChuva(chuva) {
    if (chuva >= 60) return '🌧️';
    if (chuva >= 30) return '⛅';
    return '☀️';
}

// monta os cards de "próximos dias" a partir do bloco `daily` da Open-Meteo
function exibirPrevisaoSemanal(daily) {
    const cards = daily.time.map((data, i) => {
        // "T12:00:00" evita o bug clássico de fuso: sem isso, o JS interpretaria
        // a data como meia-noite UTC, que em horário de Brasília "volta" um dia
        const nomeDia = new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short' });
        const max = Math.round(daily.temperature_2m_max[i]);
        const min = Math.round(daily.temperature_2m_min[i]);
        const chuva = daily.precipitation_probability_max[i];

        return `
            <div class="dia-previsao">
                <span class="dia-nome">${i === 0 ? 'Hoje' : nomeDia}</span>
                <span class="dia-icone">${iconePorChanceDeChuva(chuva)}</span>
                <span class="dia-temp">${max}° / ${min}°</span>
                <span class="dia-chuva">💧 ${chuva}%</span>
            </div>
        `;
    }).join('');

    document.getElementById('previsao-semanal').innerHTML = cards;
}

const botaoConsultar = document.querySelector('.formulario button');
const botaoTexto = document.getElementById('botao-texto');

document.getElementById('form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cep = document.getElementById('cep').value;
    const cepSemHifen = cep.replace('-', '');

    if (cepSemHifen.length !== 8 || isNaN(cepSemHifen)) {
        alert('CEP inválido. Formato esperado: 00000000.');
        return;
    }

    botaoConsultar.disabled = true;
    botaoTexto.textContent = 'Buscando...';

    try {
        const endereco = await buscarCEP(cepSemHifen);

        if (endereco) {
            document.querySelectorAll('.cep-resultado p')[0].textContent = endereco.logradouro || 'N/A';
            document.querySelectorAll('.cep-resultado p')[1].textContent = endereco.bairro || 'N/A';
            document.querySelectorAll('.cep-resultado p')[2].textContent = `${endereco.localidade}/${endereco.uf}`;

            const alertaINMET = await buscarAlertaINMET(endereco.uf, endereco.ibge);
            exibirAlertaINMET(alertaINMET);

            const coordenadas = await buscarCoordenadas(endereco.localidade, endereco.uf);

            if (coordenadas) {
                await buscarPrevisaoTempo(coordenadas.latitude, coordenadas.longitude);
            }
        }
    } finally {
        botaoConsultar.disabled = false;
        botaoTexto.textContent = 'Consultar informações';
    }
});
