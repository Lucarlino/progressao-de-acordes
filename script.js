// Dados das escalas e progressões
const musicTheory = {
    notes: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    
    scales: {
        major: [0, 2, 4, 5, 7, 9, 11],
        minor: [0, 2, 3, 5, 7, 8, 10]
    },
    
    degrees: {
        major: {
            'I': { type: '', symbol: 'I', function: 'Tônica' },
            'ii': { type: 'm', symbol: 'ii', function: 'Super tônica' },
            'iii': { type: 'm', symbol: 'iii', function: 'Mediante' },
            'IV': { type: '', symbol: 'IV', function: 'Subdominante' },
            'V': { type: '', symbol: 'V', function: 'Dominante' },
            'vi': { type: 'm', symbol: 'vi', function: 'Relativo menor' },
            'vii°': { type: 'dim', symbol: 'vii°', function: 'Sensível' }
        },
        minor: {
            'i': { type: 'm', symbol: 'i', function: 'Tônica' },
            'ii°': { type: 'dim', symbol: 'ii°', function: 'Super tônica' },
            'III': { type: '', symbol: 'III', function: 'Mediante' },
            'iv': { type: 'm', symbol: 'iv', function: 'Subdominante' },
            'v': { type: 'm', symbol: 'v', function: 'Dominante' },
            'VI': { type: '', symbol: 'VI', function: 'Relativo maior' },
            'VII': { type: '', symbol: 'VII', function: 'Sensível' }
        }
    },
    
    progressions: {
        pop: [
            ['I', 'V', 'vi', 'IV'],
            ['vi', 'IV', 'I', 'V'],
            ['I', 'vi', 'IV', 'V']
        ],
        rock: [
            ['I', 'IV', 'V'],
            ['I', 'V', 'IV'],
            ['I', 'IV', 'I', 'V']
        ],
        jazz: [
            ['ii', 'V', 'I'],
            ['vi', 'ii', 'V', 'I'],
            ['I', 'vi', 'ii', 'V']
        ],
        blues: [
            ['I', 'IV', 'I', 'V', 'IV', 'I', 'V'],
            ['I', 'IV', 'V', 'IV'],
            ['I', 'I', 'I', 'I', 'IV', 'IV', 'I', 'I', 'V', 'IV', 'I', 'V']
        ],
        minor: [
            ['i', 'VI', 'III', 'VII'],
            ['i', 'iv', 'VII', 'III'],
            ['i', 'VII', 'VI', 'V'],
            ['i', 'III', 'VII', 'iv']
        ],
        random: [
            ['I', 'IV', 'vi', 'V'],
            ['vi', 'III', 'VII', 'IV'],
            ['I', 'V', 'vi', 'iii', 'IV']
        ]
    },
    
    analysis: {
        pop: "Progressão típica do pop - cativante e fácil de memorizar. Perfeita para hooks e refrões.",
        rock: "Clássico do rock'n'roll - energia direta e poderosa. Ideal para riffs marcantes.",
        jazz: "Essência do jazz - sofisticação harmônica e movimento cromático. Excelente para improvisação.",
        blues: "Alma do blues - emotiva e cheia de feeling. Base da música moderna.",
        minor: "Progressão em escala menor - emotiva e melancólica. Ideal para músicas com sentimento profundo.",
        random: "Combinação criativa - explora novas possibilidades harmônicas."
    }
};

// Estado da aplicação
let currentProgression = [];
let currentKey = 'C';
let currentScale = 'major';
let isPlaying = false;

// Elementos DOM
const generateBtn = document.getElementById('generate-btn');
const playBtn = document.getElementById('play-btn');
const newBtn = document.getElementById('new-btn');
const resultDiv = document.getElementById('result');
const chordsDiv = document.getElementById('chords');
const degreesDiv = document.getElementById('degrees');
const analysisText = document.getElementById('analysis-text');
const exampleBtns = document.querySelectorAll('.example-btn');

// Inicialização do sintetizador SIMPLIFICADA
let synth;

// Função para inicializar o áudio (deve ser chamada por uma interação do usuário)
function initAudio() {
    if (!synth) {
        synth = new Tone.Synth().toDestination();
        console.log('Áudio inicializado');
    }
    return Tone.start();
}

// Função para obter a nota base do índice
function getNoteIndex(note) {
    return musicTheory.notes.indexOf(note);
}

// Função para gerar acordes da escala
function generateScaleChords(key, scaleType) {
    const keyIndex = getNoteIndex(key);
    const scaleIntervals = musicTheory.scales[scaleType];
    const scaleDegrees = musicTheory.degrees[scaleType];
    
    const chords = {};
    
    Object.keys(scaleDegrees).forEach((degree, index) => {
        const interval = scaleIntervals[index];
        const noteIndex = (keyIndex + interval) % 12;
        const note = musicTheory.notes[noteIndex];
        const chordType = scaleDegrees[degree].type;
        
        let chordSymbol = note;
        
        if (chordType === 'm') {
            chordSymbol += 'm';
        } else if (chordType === 'dim') {
            chordSymbol += 'dim';
        }
        
        chords[degree] = chordSymbol;
    });
    
    console.log(`Escala ${scaleType} em ${key}:`, chords);
    return chords;
}

// Função para gerar progressão
function generateProgression() {
    const key = document.getElementById('key').value;
    const scale = document.getElementById('scale').value;
    const style = document.getElementById('style').value;
    const length = parseInt(document.getElementById('length').value);
    
    currentKey = key;
    currentScale = scale;
    
    const scaleChords = generateScaleChords(key, scale);
    
    let progressionFormula;
    if (scale === 'minor' && musicTheory.progressions.minor) {
        const minorProgressions = musicTheory.progressions.minor;
        progressionFormula = minorProgressions[Math.floor(Math.random() * minorProgressions.length)];
    } else {
        const styleProgressions = musicTheory.progressions[style] || musicTheory.progressions.pop;
        progressionFormula = styleProgressions[Math.floor(Math.random() * styleProgressions.length)];
    }
    
    while (progressionFormula.length < length) {
        progressionFormula = progressionFormula.concat(progressionFormula);
    }
    progressionFormula = progressionFormula.slice(0, length);
    
    currentProgression = progressionFormula.map(degree => {
        const chordInfo = scaleChords[degree];
        
        return {
            chord: chordInfo || degree,
            degree: degree,
            function: musicTheory.degrees[scale][degree]?.function || 'Acorde'
        };
    });
    
    console.log('Progressão gerada:', currentProgression);
    displayProgression();
    displayAnalysis(scale === 'minor' ? 'minor' : style);
    resultDiv.classList.remove('hidden');
}

// Função para exibir progressão
function displayProgression() {
    chordsDiv.innerHTML = '';
    degreesDiv.innerHTML = '';
    
    currentProgression.forEach(item => {
        const chordElement = document.createElement('div');
        chordElement.className = 'chord';
        chordElement.textContent = item.chord;
        chordElement.title = item.function;
        chordsDiv.appendChild(chordElement);
        
        const degreeElement = document.createElement('div');
        degreeElement.className = 'degree';
        degreeElement.textContent = item.degree;
        degreesDiv.appendChild(degreeElement);
    });
}

// Função para exibir análise
function displayAnalysis(style) {
    const analysis = musicTheory.analysis[style] || musicTheory.analysis.pop;
    analysisText.textContent = analysis;
}

// FUNÇÃO SEGURA para extrair a nota fundamental do acorde
function getRootNote(chordSymbol) {
    if (!chordSymbol || typeof chordSymbol !== 'string') {
        return 'C';
    }
    
    // Mapa de fallback para graus romanos
    const romanToNote = {
        'I': 'C', 'II': 'D', 'III': 'E', 'IV': 'F', 'V': 'G', 'VI': 'A', 'VII': 'B',
        'i': 'C', 'ii': 'D', 'iii': 'E', 'iv': 'F', 'v': 'G', 'vi': 'A', 'vii': 'B'
    };
    
    // Se for um grau romano, usar o mapa
    if (romanToNote[chordSymbol]) {
        return romanToNote[chordSymbol];
    }       
    
    // Lista explícita de notas válidas
    const validNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // Tentar encontrar uma nota válida no início da string
    for (const note of validNotes) {
        if (chordSymbol.startsWith(note)) {
            return note;
        }
    }
    
    // Se não encontrou, tentar a primeira letra se for C,D,E,F,G,A,B
    const firstChar = chordSymbol.charAt(0).toUpperCase();
    if (['C','D','E','F','G','A','B'].includes(firstChar)) {
        return firstChar;
    }
    
    // Fallback final
    return 'C';
}

// Função para determinar a oitava
function getOctave(note) {
    return 3;
}

// FUNÇÃO SIMPLIFICADA para tocar progressão
async function playProgression() {
    if (isPlaying) {
        return; // Evitar múltiplos cliques
    }
    
    try {
        // Inicializar áudio na primeira interação
        await initAudio();
        
        isPlaying = true;
        playBtn.classList.add('loading');
        playBtn.textContent = '🎵 Tocando...';
        clearChordHighlights();

        console.log('Iniciando reprodução...');
        
        // Tocar cada acorde sequencialmente
        for (let i = 0; i < currentProgression.length; i++) {
            const chord = currentProgression[i];
            
            // Extrair a nota fundamental
            const rootNote = getRootNote(chord.chord);
            const octave = getOctave(rootNote);
            const fullNote = rootNote + octave;
            
            console.log(`Tocando acorde ${i + 1}: "${chord.chord}" -> Nota: ${fullNote}`);
            
            // Destacar visualmente
            highlightPlayingChord(i);
            
            // Tocar a nota
            synth.triggerAttackRelease(fullNote, "1n");
            
            // Aguardar antes do próximo acorde
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Remover destaque
            clearChordHighlights();
            
            // Pequena pausa entre acordes
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Resetar estado
        isPlaying = false;
        playBtn.classList.remove('loading');
        playBtn.textContent = '🎵 Tocar Progressão';
        console.log('Reprodução concluída');

    } catch (error) {
        console.error('Erro ao tocar progressão:', error);
        isPlaying = false;
        playBtn.classList.remove('loading');
        playBtn.textContent = '🎵 Tocar Progressão';
        
        // Mensagem de erro amigável
        if (error.message.includes('user didn\'t interact')) {
            alert('⚠️ Clique primeiro em "Gerar Progressão" para ativar o áudio, depois em "Tocar Progressão".');
        } else {
            alert('Erro ao reproduzir áudio. Recarregue a página e tente novamente.');
        }
    }
}

// Função para destacar acorde sendo tocado
function highlightPlayingChord(index) {
    const chordElements = document.querySelectorAll('.chord');
    const degreeElements = document.querySelectorAll('.degree');
    
    // Remover todos os destaques
    chordElements.forEach(el => el.classList.remove('playing'));
    degreeElements.forEach(el => el.classList.remove('playing'));
    
    // Destacar atual
    if (chordElements[index]) {
        chordElements[index].classList.add('playing');
    }
    if (degreeElements[index]) {
        degreeElements[index].classList.add('playing');
    }
}

// Função para limpar destaques
function clearChordHighlights() {
    const chordElements = document.querySelectorAll('.chord');
    const degreeElements = document.querySelectorAll('.degree');
    
    chordElements.forEach(el => el.classList.remove('playing'));
    degreeElements.forEach(el => el.classList.remove('playing'));
}

// Função para carregar exemplo
function loadExample(progressionFormula) {
    const key = document.getElementById('key').value;
    const scale = document.getElementById('scale').value;
    
    currentKey = key;
    currentScale = scale;
    
    const scaleChords = generateScaleChords(key, scale);
    const progressionArray = progressionFormula.split('-');
    
    currentProgression = progressionArray.map(degree => {
        return {
            chord: scaleChords[degree] || degree,
            degree: degree,
            function: musicTheory.degrees[scale][degree]?.function || 'Acorde'
        };
    });
    
    console.log('Exemplo carregado:', currentProgression);
    displayProgression();
    analysisText.textContent = "Progressão clássica - amplamente utilizada na música popular.";
    resultDiv.classList.remove('hidden');
}

// Event Listeners
generateBtn.addEventListener('click', function() {
    generateProgression();
    // Inicializar áudio silenciosamente quando gerar primeira progressão
    initAudio().catch(console.error);
});

playBtn.addEventListener('click', playProgression);
newBtn.addEventListener('click', generateProgression);

exampleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const progression = e.target.dataset.progression;
        loadExample(progression);
        // Inicializar áudio silenciosamente quando carregar exemplo
        initAudio().catch(console.error);
    });
});

// Gerar primeira progressão ao carregar a página
window.addEventListener('load', function() {
    console.log('Página carregada - gerando primeira progressão');
    generateProgression();
});

// Adicionar evento de clique no documento para ativar áudio
document.addEventListener('click', function() {
    // Tentar inicializar áudio em qualquer clique na página
    initAudio().catch(console.error);
}, { once: true });