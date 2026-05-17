// ===== Enmaa.ai v2.0 — Multi-Model AI Platform =====
// Standalone mode (no backend required) + live backend support

const MODELS = [
  // === Tier 1: Flagship ===
  { id:'llama3.2', name:'Llama 3.2', emoji:'🦙', provider:'ollama', size:'3B', desc:"Meta's latest — state-of-the-art 3B LLM, fast & capable", ctx:8192, tier:1, tags:['chat','arena','search'] },
  { id:'llama3.1:8b', name:'Llama 3.1 8B', emoji:'🦙', provider:'ollama', size:'8B', desc:"Meta's powerful 8B — strong reasoning & instruction following", ctx:8192, tier:1, tags:['chat','arena','search'] },
  { id:'mistral', name:'Mistral v0.3', emoji:'🌬️', provider:'ollama', size:'7B', desc:"Mistral AI's 7B — excellent reasoning & multilingual", ctx:8192, tier:1, tags:['chat','arena','search'] },
  { id:'qwen2.5:7b', name:'Qwen 2.5 7B', emoji:'🐉', provider:'ollama', size:'7B', desc:"Alibaba's 7B — up to 128K context, strong at coding & math", ctx:32768, tier:1, tags:['chat','arena','search'] },
  { id:'deepseek-r1:7b', name:'DeepSeek R1 7B', emoji:'🧠', provider:'ollama', size:'7B', desc:"DeepSeek's reasoning model — chain-of-thought specialist", ctx:32768, tier:1, tags:['chat','arena','search'] },
  // === Tier 2: Efficient ===
  { id:'gemma2:2b', name:'Gemma 2 2B', emoji:'💎', provider:'ollama', size:'2B', desc:"Google's efficient 2B — surprisingly capable for its size", ctx:8192, tier:2, tags:['chat','arena','search'] },
  { id:'phi3.5:3.8b', name:'Phi-3.5 3.8B', emoji:'🔵', provider:'ollama', size:'3.8B', desc:"Microsoft's compact powerhouse — punches above its weight", ctx:4096, tier:2, tags:['chat','arena','search'] },
  { id:'qwen2.5:3b', name:'Qwen 2.5 3B', emoji:'🐉', provider:'ollama', size:'3B', desc:"Alibaba's light 3B — supports up to 32K context", ctx:32768, tier:2, tags:['chat','arena','search'] },
  { id:'llama3.2:1b', name:'Llama 3.2 1B', emoji:'🦙', provider:'ollama', size:'1B', desc:"Meta's ultra-light 1B — fastest possible responses", ctx:8192, tier:2, tags:['chat','search'] },
  { id:'gemma2:9b', name:'Gemma 2 9B', emoji:'💎', provider:'ollama', size:'9B', desc:"Google's 9B — strong alternative to Llama 3", ctx:8192, tier:2, tags:['chat','arena','search'] },
  // === Tier 3: Specialized ===
  { id:'codellama', name:'Code Llama 7B', emoji:'💻', provider:'ollama', size:'7B', desc:"Meta's code specialist — generation, explanation, debugging", ctx:16384, tier:3, tags:['chat','search'] },
  { id:'mixtral:8x7b', name:'Mixtral 8x7B', emoji:'🌬️', provider:'ollama', size:'47B', desc:"Mistral's MoE — GPT-3.5 class, needs 24GB+ RAM", ctx:32768, tier:3, tags:['chat','arena','search'] },
  { id:'falcon2:11b', name:'Falcon 2 11B', emoji:'🦅', provider:'ollama', size:'11B', desc:"TII's Falcon 2 — strong multilingual & reasoning", ctx:8192, tier:3, tags:['chat','arena','search'] },
  { id:'starcoder2:3b', name:'StarCoder 2 3B', emoji:'⭐', provider:'ollama', size:'3B', desc:"Code-focused 3B — fill-in-the-middle, multi-language", ctx:16384, tier:3, tags:['chat','search'] },
  { id:'yi:6b', name:'Yi 6B', emoji:'🎯', provider:'ollama', size:'6B', desc:"01.AI's Yi — strong bilingual (EN/ZH) general model", ctx:4096, tier:3, tags:['chat','search'] },
  { id:'deepseek-coder:6.7b', name:'DeepSeek Coder 6.7B', emoji:'🧠', provider:'ollama', size:'6.7B', desc:"DeepSeek's code model — excels at coding tasks", ctx:16384, tier:3, tags:['chat','search'] },
  { id:'phi3:14b', name:'Phi-3 14B', emoji:'🔵', provider:'ollama', size:'14B', desc:"Microsoft's large Phi-3 — PhD-level reasoning", ctx:4096, tier:3, tags:['chat','arena','search'] },
  { id:'solar:10.7b', name:'Solar 10.7B', emoji:'☀️', provider:'ollama', size:'10.7B', desc:"Upstage's efficient 10.7B — strong benchmark scores", ctx:4096, tier:3, tags:['chat','arena','search'] },
  { id:'command-r:35b', name:'Command R+ 35B', emoji:'🎯', provider:'ollama', size:'35B', desc:"Cohere's RAG-optimized model, needs 24GB+", ctx:128000, tier:3, tags:['chat','search'] },
  // === OpenRouter (free open-source models via API) ===
  { id:'openrouter/free', name:'Auto: Best Free (OR)', emoji:'🔄', provider:'openrouter', size:'Auto', desc:"OpenRouter's best free model — always up-to-date, zero cost", ctx:128000, tier:1, tags:['chat','arena','search'] },
  { id:'meta-llama/llama-3.3-70b-instruct:free', name:'Llama 3.3 70B (OR)', emoji:'🔄', provider:'openrouter', size:'70B', desc:"Meta's Llama 3.3 70B via OpenRouter — completely free, state-of-the-art", ctx:128000, tier:1, tags:['chat','arena','search'] },
  { id:'deepseek/deepseek-v4-flash:free', name:'DeepSeek V4 Flash (OR)', emoji:'🔄', provider:'openrouter', size:'API', desc:"DeepSeek V4 Flash via OpenRouter — fast, powerful, free", ctx:65536, tier:1, tags:['chat','arena','search'] },
  { id:'nousresearch/hermes-3-llama-3.1-405b:free', name:'Hermes 3 405B (OR)', emoji:'🔄', provider:'openrouter', size:'405B', desc:"NousResearch Hermes 3 405B via OpenRouter — massive model, free tier", ctx:128000, tier:1, tags:['chat','arena','search'] },
  { id:'meta-llama/llama-3.2-3b-instruct:free', name:'Llama 3.2 3B (OR)', emoji:'🔄', provider:'openrouter', size:'3B', desc:"Meta's Llama 3.2 via OpenRouter — fast & free", ctx:8192, tier:1, tags:['chat','arena','search'] },
  { id:'qwen/qwen-2.5-7b-instruct', name:'Qwen 2.5 7B (OR)', emoji:'🔄', provider:'openrouter', size:'7B', desc:"Alibaba's Qwen 2.5 via OpenRouter — strong coding & math", ctx:32768, tier:1, tags:['chat','arena','search'] },
  { id:'mistralai/mistral-7b-instruct-v0.1', name:'Mistral 7B (OR)', emoji:'🔄', provider:'openrouter', size:'7B', desc:"Mistral 7B v0.1 via OpenRouter — excellent reasoning", ctx:8192, tier:2, tags:['chat','arena','search'] },
  // === Anthropic (Claude) ===
  { id:'claude-sonnet-4-20250514', name:'Claude Sonnet 4', emoji:'✨', provider:'anthropic', size:'API', desc:"Anthropic's best — state-of-the-art reasoning & coding (needs API key)", ctx:200000, tier:1, tags:['chat','arena','search'] },
  { id:'claude-haiku-3-5-20241022', name:'Claude Haiku 3.5', emoji:'✨', provider:'anthropic', size:'API', desc:"Anthropic's fastest — great quality, low cost (needs API key)", ctx:200000, tier:2, tags:['chat','arena','search'] },
  // === HuggingFace ===
  { id:'HuggingFaceH4/zephyr-7b-beta', name:'Zephyr 7B', emoji:'🤗', provider:'hf', size:'7B', desc:"HF's aligned 7B assistant — helpful & harmless", ctx:4096, tier:1, tags:['chat','search'] },
  { id:'microsoft/Phi-3.5-mini-instruct', name:'Phi-3.5 (HF)', emoji:'🤗', provider:'hf', size:'3.8B', desc:"Microsoft's 3.8B instruct via HF API", ctx:4096, tier:2, tags:['chat','search'] },
  { id:'mistralai/Mistral-7B-Instruct-v0.3', name:'Mistral 7B (HF)', emoji:'🤗', provider:'hf', size:'7B', desc:"Mistral 7B Instruct via HF Inference API", ctx:8192, tier:1, tags:['chat','search'] },
  { id:'meta-llama/Llama-3.2-3B-Instruct', name:'Llama 3.2 (HF)', emoji:'🤗', provider:'hf', size:'3B', desc:"Meta's Llama 3.2 via HuggingFace", ctx:8192, tier:1, tags:['chat','arena','search'] },
  { id:'Qwen/Qwen2.5-7B-Instruct', name:'Qwen 2.5 (HF)', emoji:'🤗', provider:'hf', size:'7B', desc:"Alibaba's Qwen 2.5 via HuggingFace", ctx:32768, tier:1, tags:['chat','arena','search'] },
];

// ===== CONTENT DATABASE =====
const CONTENT = {
  qc: {
    match: q => /quantum/i.test(q),
    title: 'Quantum Computing',
    chat: `## Quantum Computing

**Quantum computing** harnesses quantum mechanics to process information in revolutionary ways.

### Core Concepts
- **Qubits** — Exist in superposition (0 *and* 1 simultaneously)
- **Entanglement** — Correlated qubits share state instantly across distance
- **Interference** — Amplify correct answers, cancel incorrect ones

### Why It Matters
| Classical | Quantum |
|-----------|---------|
| Bits: 0 or 1 | Qubits: 0 *and* 1 |
| Sequential | Parallel |
| Moore's Law slowing | Exponential speedup |

### Applications
1. 🔐 **Cryptography** — Shor's algorithm breaks RSA
2. 💊 **Drug Discovery** — Simulate molecules exactly
3. 📦 **Optimization** — Supply chain, logistics
4. 🤖 **AI/ML** — Quantum neural networks

> *"Nature isn't classical, dammit, and if you want to make a simulation of nature, you'd better make it quantum mechanical."* — Feynman

*Ask me about superposition, entanglement, or quantum gates!*`,
    research: { title:'Quantum Computing', summary:`## Quantum Computing: Research Summary

### Overview
Quantum computing leverages superposition and entanglement to solve certain problems exponentially faster than classical computers.

### Key Concepts
- **Superposition**: Qubits exist in multiple states simultaneously
- **Entanglement**: Non-local correlations between qubits
- **Quantum Gates**: Operations that evolve qubit states
- **Decoherence**: The main challenge — qubits losing quantum properties

### Current Hardware
| Technology | Leader | Status |
|-----------|--------|--------|
| Superconducting | IBM, Google | 1000+ qubits |
| Trapped Ion | IonQ, Quantinuum | High fidelity |
| Photonic | Xanadu, PsiQuantum | Room temp |
| Topological | Microsoft | Theoretical |

### Impact Areas
1. **Cryptography** — Shor's algorithm threatens RSA
2. **Drug Discovery** — Exact molecular simulation
3. **Optimization** — Logistics, portfolio management
4. **Machine Learning** — Quantum kernel methods

### Further Reading
- Nielsen & Chuang, "Quantum Computation and Quantum Information"
- IBM Quantum Learning
- arXiv: quant-ph`, sources:[
  {t:'Quantum Computing — Wikipedia', u:'https://en.wikipedia.org/wiki/Quantum_computing', s:'Wikipedia'},
  {t:'IBM Quantum', u:'https://www.ibm.com/quantum', s:'IBM'},
  {t:'Google Quantum AI', u:'https://quantumai.google/', s:'Google'},
  {t:'Nature Quantum Information', u:'https://www.nature.com/subjects/quantum-information', s:'Nature'}]}
  },

  ai: {
    match: q => /artificial intelligence|ai|machine learning|\bml\b/i.test(q) && !/quantum/i.test(q),
    title: 'Artificial Intelligence',
    chat: `## Artificial Intelligence

**AI** is the simulation of human intelligence by machines.

### Major Branches
- **Machine Learning** — Algorithms that learn from data
- **Deep Learning** — Multi-layer neural networks
- **NLP** — Understanding/generating language
- **Computer Vision** — Interpreting visual data

### AI Types
| Type | Memory | Example |
|------|--------|---------|
| Reactive | None | DeepBlue |
| Limited | Past data | Self-driving |
| AGI | Full | *Future* |

### Open-Source Revolution
Models like **Llama**, **Mistral**, **Qwen**, and **DeepSeek** have democratized AI — powerful intelligence, free for everyone.

> *"The question isn't what AI can do, but what we choose to do with it."*

*Ask me about neural networks, NLP, or AI ethics!*`,
    research: { title:'Artificial Intelligence', summary:`## AI Research Summary

### Overview
Artificial Intelligence encompasses systems that perceive, reason, learn, and act. The field has progressed dramatically with deep learning and large language models.

### Key Developments
- **2012**: Deep learning breakthrough (AlexNet)
- **2017**: Transformer architecture
- **2020**: GPT-3, scaling laws
- **2022-23**: ChatGPT, open-source LLMs
- **2024-26**: Multimodal, agents, reasoning

### Open-Source Landscape
Open models now rival proprietary ones, making AI accessible for education and research worldwide.

### Ethical Framework
1. **Fairness** — Mitigate bias
2. **Transparency** — Explainable AI
3. **Safety** — Value alignment
4. **Access** — Democratize benefits

### Further Reading
- Russell & Norvig, "AIMA"
- Stanford AI Index Report
- arXiv: cs.AI`, sources:[
  {t:'AI — Wikipedia', u:'https://en.wikipedia.org/wiki/Artificial_intelligence', s:'Wikipedia'},
  {t:'Stanford AI Index', u:'https://aiindex.stanford.edu/', s:'Stanford'},
  {t:'DeepLearning.AI', u:'https://www.deeplearning.ai/', s:'DeepLearning.AI'},
  {t:'HuggingFace Papers', u:'https://huggingface.co/papers', s:'HF'}]}
  },

  nn: {
    match: q => /neural network|deep learning|backpropagation|cnn|transformer/i.test(q),
    title: 'Neural Networks',
    chat: `## Neural Networks

Inspired by the brain, neural networks are the foundation of modern AI.

### The Neuron
\`inputs → weight × sum → activation → output\`

### Architecture
- **Input Layer** — Raw data
- **Hidden Layers** — Learn features
- **Output Layer** — Prediction

### Key Types
| Type | Use Case |
|------|----------|
| CNN | Images, video |
| RNN/LSTM | Sequences, text |
| Transformer | NLP, vision |
| GNN | Graphs, relations |

> *"Deep learning is representation learning with multiple levels of abstraction."* — Yann LeCun

*Ask me about CNNs, transformers, or training!*`,
    research: { title:'Neural Networks', summary:`## Neural Networks Research

### Overview
Neural networks are computing systems inspired by biological brains, forming the backbone of modern deep learning.

### How They Work
1. **Forward pass**: Data flows through layers
2. **Loss calculation**: Measure prediction error
3. **Backpropagation**: Compute gradients
4. **Optimization**: Update weights (SGD, Adam)

### Architectures
- **CNNs**: Spatial hierarchies for images
- **RNNs/LSTMs**: Sequential processing
- **Transformers**: Attention mechanisms
- **GANs**: Generative adversarial training

### Key Insight
Scale (data + compute) dramatically improves performance. This is the "scaling law" behind modern AI.

### Further Reading
- Goodfellow, "Deep Learning"
- Stanford CS231n, CS224n
- 3Blue1Brown series`, sources:[
  {t:'Deep Learning — Wikipedia', u:'https://en.wikipedia.org/wiki/Deep_learning', s:'Wikipedia'},
  {t:'Stanford CS231n', u:'https://cs231n.stanford.edu/', s:'Stanford'},
  {t:'3Blue1Brown Neural Networks', u:'https://www.3blue1brown.com/topics/neural-networks', s:'3B1B'}]}
  },

  relativity: {
    match: q => /relativity|einstein|spacetime|e=mc/i.test(q),
    title: 'Theory of Relativity',
    chat: `## Theory of Relativity

Einstein revolutionized our understanding of space, time, and gravity.

### Special Relativity (1905)
- Light speed is constant for all observers
- **Time dilation**: Moving clocks tick slower
- **Length contraction**: Objects shorten at speed
- **E = mc²**: Mass-energy equivalence

### General Relativity (1915)
- Gravity = **curvature of spacetime**
- Mass warps spacetime → objects follow curves
- Predicts: black holes, gravitational waves, lensing

### Confirmed Predictions
1. Light bending (1919 eclipse)
2. Gravitational redshift
3. Gravitational waves (LIGO 2015 — Nobel 2017)
4. Black hole imaging (EHT 2019)

> *"Time and space are modes by which we think, not conditions in which we live."* — Einstein`,
    research: { title:'Theory of Relativity', summary:`## Relativity Research Summary

### Overview
Einstein's theories of relativity transformed physics, replacing Newtonian notions of absolute space and time.

### Special Relativity
Two postulates:
1. **Principle of relativity**: Physics same in all inertial frames
2. **Constant light speed**: c is invariant

Consequences: time dilation, length contraction, relativity of simultaneity.

### General Relativity
Spacetime curvature = gravity. The Einstein field equations describe how mass-energy shapes geometry.

### Modern Applications
- GPS corrections (needs relativity!)
- Cosmology (expansion, Big Bang)
- Black hole physics
- Gravitational wave astronomy

### Further Reading
- Einstein's original papers
- "The Elegant Universe" — Brian Greene
- PBS Space Time series`, sources:[
  {t:'Relativity — Wikipedia', u:'https://en.wikipedia.org/wiki/Theory_of_relativity', s:'Wikipedia'},
  {t:'Einstein Online', u:'https://www.einstein-online.info/', s:'Einstein Online'},
  {t:'PBS Space Time', u:'https://www.youtube.com/c/pbsspacetime', s:'PBS'}]}
  },

  climate: {
    match: q => /climate|global warming|greenhouse|co2|carbon/i.test(q),
    title: 'Climate Change',
    chat: `## Climate Change

### Current State
🌡️ **+1.2°C** above pre-industrial levels
🌊 **3.7 mm/yr** sea level rise
☁️ **420 ppm** CO₂ (highest in 2M+ years)

### Key Solutions

**Energy Transition**
| Source | Today | 2050 Potential |
|--------|:-----:|:--------------:|
| Solar | 4.5% | 40%+ |
| Wind | 7.3% | 35%+ |
| Nuclear | 10% | Stable |
| Hydro | 16% | Limited |

**Carbon Removal**
- Direct Air Capture (DAC)
- Reforestation
- Bioenergy + CCS
- Ocean alkalinization

**Individual Action** → Systemic Change

> *"We're the first generation to feel climate change and the last who can do something about it."*

*Ask me about solutions, policy, or what you can do!*`,
    research: { title:'Climate Change Solutions', summary:`## Climate Research Summary

### State of the Climate
- Global temperature: +1.2°C
- CO₂: 420 ppm (highest in 2+ million years)
- Arctic sea ice declining 12% per decade

### Solutions Portfolio
1. **Renewable energy** — Solar costs down 90% in a decade
2. **Electrification** — Transport, heating, industry
3. **Carbon removal** — DAC, reforestation, enhanced weathering
4. **Policy** — Carbon pricing, green investment, international agreements

### Urgency
IPCC: Need 45% CO₂ reduction by 2030, net-zero by 2050.

### Further Reading
- IPCC AR6
- Project Drawdown
- "The Ministry for the Future" — KSR`, sources:[
  {t:'IPCC', u:'https://www.ipcc.ch/', s:'IPCC'},
  {t:'NASA Climate', u:'https://climate.nasa.gov/', s:'NASA'},
  {t:'Project Drawdown', u:'https://drawdown.org/', s:'Drawdown'},
  {t:'IEA', u:'https://www.iea.org/', s:'IEA'}]}
  },

  dna: {
    match: q => /dna|gene|genetic|crispr|genome/i.test(q),
    title: 'DNA & Genetics',
    chat: `## DNA: The Blueprint of Life

### Structure
- **Double helix** — Two complementary strands
- **4 bases**: Adenine (A), Thymine (T), Guanine (G), Cytosine (C)
- **Base pairing**: A↔T, G↔C

### Central Dogma
\`DNA → (transcription) → RNA → (translation) → Protein\`

### Human Genome
📏 3 billion base pairs
🧬 ~20,000 protein-coding genes
👥 99.9% identical between humans

### CRISPR Gene Editing
A revolutionary tool adapted from bacterial immune systems:
- **Guide RNA** targets specific DNA
- **Cas9** cuts at that location
- Cell repairs — either disrupt or insert

> *"We've gone from reading the genome to writing it."*

*Ask me about CRISPR, genetic disorders, or epigenetics!*`,
    research: { title:'DNA & Gene Editing', summary:`## Genetics Research Summary

### DNA Structure
Watson-Crick double helix model (1953). Four nucleotide bases encode genetic information.

### CRISPR-Cas9
- Discovered: Bacterial immune system
- Adapted: Genome editing (Nobel 2020)
- Mechanism: Guide RNA + Cas9 nuclease
- Applications: Medicine, agriculture, research

### Ethical Considerations
- Germline editing implications
- Equity of access
- Off-target effects
- Regulation varies globally

### Further Reading
- "A Crack in Creation" — Doudna
- Innovative Genomics Institute
- Nature CRISPR collection`, sources:[
  {t:'CRISPR — Wikipedia', u:'https://en.wikipedia.org/wiki/CRISPR_gene_editing', s:'Wikipedia'},
  {t:'Broad Institute CRISPR', u:'https://www.broadinstitute.org/crispr', s:'Broad'},
  {t:'Nature CRISPR', u:'https://www.nature.com/collections/crispr', s:'Nature'}]}
  },

  evolution: {
    match: q => /evolution|natural selection|darwin|survival of the fittest/i.test(q),
    title: 'Evolution by Natural Selection',
    chat: `## Evolution by Natural Selection

Darwin's theory explains the diversity of life.

### Key Principles
1. **Variation** — Individuals differ
2. **Inheritance** — Traits pass to offspring
3. **Differential survival** — Some traits increase survival
4. **Adaptation** — Population changes over generations

### Evidence
- 🦴 **Fossil record** — Transitional forms
- 🧬 **DNA** — Universal genetic code
- 🗺️ **Biogeography** — Species distribution
- 👁️ **Vestigial structures** — Evolutionary leftovers

### Common Misconception
> *"Evolution isn't 'survival of the fittest' — it's survival of the *fit enough* to reproduce."*

*Ask me about human evolution, natural selection examples, or speciation!*`
  },

  photosynthesis: {
    match: q => /photosynthesis|chlorophyll|calvin cycle|light reaction/i.test(q),
    title: 'Photosynthesis',
    chat: `## Photosynthesis

Plants convert light → chemical energy.

### The Equation
\`6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂\`

### Two Stages
**1. Light-Dependent Reactions**
- In thylakoid membranes
- Capture light via chlorophyll
- Produce ATP + NADPH
- Release O₂

**2. Calvin Cycle**
- In stroma
- Fixes CO₂ into glucose
- Uses ATP + NADPH

### Why It Matters
- Produces **oxygen** we breathe
- **Base of food chains**
- Removes **CO₂** from atmosphere
- Creates **biomass** for ecosystems

*Ask me about C3 vs C4 plants or artificial photosynthesis!*`
  },

  blockchain: {
    match: q => /blockchain|bitcoin|cryptocurrency|ethereum|web3|decentralized/i.test(q),
    title: 'Blockchain Technology',
    chat: `## Blockchain Technology

A **distributed ledger** that records transactions across many computers.

### How It Works
1. Transaction is broadcast
2. Network validates
3. Block created with hash
4. Block added to chain (permanent)
5. Transaction confirmed

### Key Concepts
- **Decentralization** — No single authority
- **Immutability** — Cannot alter past records
- **Consensus** — Proof of Work, Proof of Stake
- **Smart Contracts** — Self-executing code

### Beyond Crypto
- Supply chain tracking
- Digital identity
- Voting systems
- Tokenization of assets

> *"Blockchain is the technology. Bitcoin is merely the first mainstream manifestation of its potential."*

*Ask me about consensus mechanisms, smart contracts, or DeFi!*`
  },

  default: {
    title: 'General Knowledge',
    chat: `## Let's Explore Your Question!

### Approaching This Topic
Here's a framework to help understand this subject:

**1. Foundations** — What are the core principles?
**2. Connections** — How does it relate to other fields?
**3. Applications** — Where is this knowledge used?
**4. Depth** — What are the open questions?

### Learning Tips
- 📖 Start with overview sources (Wikipedia, Khan Academy)
- 🔬 Find recent papers on Google Scholar
- 🤔 Use the **Feynman Technique**: explain it simply
- 💬 Discuss with peers and teachers

### Enmaa.ai Can Help
- Try **Research Mode** for deep summaries
- Use **Arena Mode** to compare model perspectives
- Ask follow-up questions for deeper dives

*What aspect would you like to explore further?*`,
    research: { title:'Research Topic', summary:`## Research Summary

### Overview
A synthesized overview of the topic based on available educational resources.

### Key Points
1. Understanding fundamentals provides a strong foundation
2. Cross-disciplinary connections enrich comprehension
3. Practical applications demonstrate real-world relevance

### Recommendations
- Consult primary sources for authoritative information
- Compare multiple perspectives for balanced understanding
- Apply knowledge through projects and discussions

### Further Reading
- Wikipedia for initial orientation
- Google Scholar for academic papers
- Library databases for in-depth resources`, sources:[
  {t:'Wikipedia', u:'https://www.wikipedia.org/', s:'Wikipedia'},
  {t:'Google Scholar', u:'https://scholar.google.com/', s:'Google Scholar'},
  {t:'Khan Academy', u:'https://www.khanacademy.org/', s:'Khan Academy'}]}
  }
};

const TRENDING = [
  {q:'Quantum Computing', e:'⚛️'},
  {q:'Artificial Intelligence', e:'🤖'},
  {q:'Neural Networks', e:'🧠'},
  {q:'CRISPR Gene Editing', e:'🧬'},
  {q:'Climate Change Solutions', e:'🌱'},
  {q:'DNA & Genetics', e:'🧪'},
  {q:'Theory of Relativity', e:'🌌'},
  {q:'Blockchain Technology', e:'⛓️'}
];

const SUGGESTIONS = [
  'Explain quantum computing',
  'How do neural networks work?',
  'What is CRISPR?',
  'Explain relativity simply',
  'How does AI learn?',
  'What causes climate change?',
  'How does DNA work?',
  'What is blockchain?'
];

// ===== APPLICATION =====
const App = {
  state: {
    page: 'home',
    theme: localStorage.getItem('en-theme') || 'dark',
    defaultModel: localStorage.getItem('en-model') || 'llama3.2',
    live: false
  },

  init() {
    this.applyTheme();
    this.nav();
    this.settings();
    this.chat();
    this.arena();
    this.search();
    this.renderModels();
    this.ping();
    this.particles();
  },

  ping() {
    fetch('/api/health').then(r => {
      if (r.ok) {
        this.state.live = true;
        document.querySelectorAll('.status-dot').forEach(d => d.className = 'status-dot online');
      }
    }).catch(() => {});
  },

  particles() {
    const c = document.getElementById('particles');
    if (!c) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
      p.style.animationDuration = (15 + Math.random() * 25) + 's';
      p.style.animationDelay = (Math.random() * 20) + 's';
      p.style.opacity = 0.1 + Math.random() * 0.3;
      c.appendChild(p);
    }
  },

  // ===== THEME =====
  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.state.theme);
    document.querySelectorAll('.theme-opt').forEach(o => o.classList.toggle('active', o.dataset.t === this.state.theme));
  },
  toggleTheme() {
    this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('en-theme', this.state.theme);
    this.applyTheme();
  },

  // ===== NAV =====
  nav() {
    document.querySelectorAll('[data-page]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        this.go(el.dataset.page);
      });
    });

    document.getElementById('mobileBtn')?.addEventListener('click', () => {
      document.querySelector('.nav-links').classList.toggle('open');
    });

    // Hash routing
    const checkHash = () => {
      const h = location.hash.slice(1);
      if (['home','chat','arena','search'].includes(h)) this.go(h);
    };
    window.addEventListener('hashchange', checkHash);
    checkHash();
  },

  go(page) {
    if (page === this.state.page) return;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const p = document.getElementById(`p-${page}`);
    const l = document.querySelector(`[data-page="${page}"]`);
    if (p) p.classList.add('active');
    if (l) l.classList.add('active');
    this.state.page = page;
    document.querySelector('.nav-links')?.classList.remove('open');
    window.scrollTo({top:0,behavior:'smooth'});

    // Update URL hash without triggering hashchange
    if (page !== 'home') history.replaceState(null, '', `#${page}`);
    else history.replaceState(null, '', '/');
  },

  // ===== SETTINGS =====
  settings() {
    document.getElementById('settingsBtn').addEventListener('click', () => {
      document.getElementById('settingsOverlay').classList.add('active');
      document.getElementById('settingsPanel').classList.add('open');
    });
    document.querySelectorAll('.close-settings').forEach(el => {
      el.addEventListener('click', () => {
        document.getElementById('settingsOverlay').classList.remove('active');
        document.getElementById('settingsPanel').classList.remove('open');
      });
    });
    document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
    document.querySelectorAll('.theme-opt').forEach(b => {
      b.addEventListener('click', () => {
        document.querySelectorAll('.theme-opt').forEach(o => o.classList.remove('active'));
        b.classList.add('active');
        this.state.theme = b.dataset.t;
        localStorage.setItem('en-theme', this.state.theme);
        this.applyTheme();
      });
    });
    document.getElementById('defaultModel').addEventListener('change', e => {
      this.state.defaultModel = e.target.value;
      localStorage.setItem('en-model', e.target.value);
      const cs = document.getElementById('chatModel');
      if (cs) cs.value = e.target.value;
    });
  },

  // ===== MODELS =====
  renderModels() {
    const g = document.getElementById('modelsGrid');
    if (!g) return;
    const emoji = m => m.emoji || (m.provider === 'hf' ? '🤗' : '🖥️');
    g.innerHTML = MODELS.sort((a,b) => a.tier - b.tier).map(m => `
      <div class="mc">
        <div class="mc-h">
          <h4>${emoji(m)} ${m.name}</h4>
          <span class="mc-prov">${m.provider === 'hf' ? '🤗 HF' : '🖥️ Local'}</span>
        </div>
        <p>${m.desc}</p>
        <div class="mc-tags">
          <span class="tag-free">✓ Free</span>
          <span class="tag-ctx">${(m.ctx).toLocaleString()} ctx</span>
          <span class="tag-size">${m.size}</span>
          ${(m.tags||[]).map(t => `<span class="tag-type ${t}">${t}</span>`).join('')}
        </div>
        ${m.tier === 1 ? '<div class="mc-badge">⭐ Featured</div>' : ''}
      </div>
    `).join('');
  },

  // ===== MATCHING =====
  findChat(query) {
    for (const k in CONTENT) {
      if (CONTENT[k].match && CONTENT[k].match(query)) return CONTENT[k].chat || CONTENT[k].research?.summary || CONTENT.default.chat;
    }
    return CONTENT.default.chat;
  },

  findResearch(query) {
    for (const k in CONTENT) {
      if (CONTENT[k].match && CONTENT[k].match(query) && CONTENT[k].research) return CONTENT[k].research;
    }
    return CONTENT.default.research;
  },

  // ===== MARKDOWN =====
  md(text) {
    if (!text) return '';
    let h = text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    h = h.replace(/^### (.+)$/gm,'<h3>$1</h3>');
    h = h.replace(/^## (.+)$/gm,'<h2>$1</h2>');
    h = h.replace(/^# (.+)$/gm,'<h1>$1</h1>');
    h = h.replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>');
    h = h.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
    h = h.replace(/\*(.+?)\*/g,'<em>$1</em>');
    h = h.replace(/```(\w*)\n?([\s\S]*?)```/g,'<pre><code>$2</code></pre>');
    h = h.replace(/`([^`]+)`/g,'<code>$1</code>');
    h = h.replace(/^> (.+)$/gm,'<blockquote>$1</blockquote>');
    h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
    h = h.replace(/^- (.+)$/gm,'<li>$1</li>');
    h = h.replace(/((?:<li>.*<\/li>\n?)+)/g,'<ul>$1</ul>');
    h = h.replace(/^\d+\. (.+)$/gm,'<li>$1</li>');
    h = h.replace(/\|(.+)\|(.+)\|/g,'<tr><td>$1</td><td>$2</td></tr>');
    h = h.replace(/<tr>.*?<\/tr>/g,'<table>$&</table>');

    const r = /^<\/?(h[1-3]|ul|ol|li|pre|blockquote|hr|p|table|tr|td|th)/;
    const lines = h.split('\n');
    let inP = false, out = [];
    for (const line of lines) {
      const l = line.trim();
      if (!l) { if (inP) { out.push('</p>'); inP = false; } continue; }
      if (r.test(l)) { if (inP) { out.push('</p>'); inP = false; } out.push(l); }
      else { if (!inP) { out.push('<p>'); inP = true; } out.push(l); }
    }
    if (inP) out.push('</p>');
    return out.join('\n');
  },

  // ===== CHAT =====
  chat() {
    const input = document.getElementById('chatInput');
    const send = document.getElementById('sendBtn');

    input.addEventListener('input', () => {
      send.disabled = !input.value.trim();
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 120) + 'px';
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); const t = input.value.trim(); if (t) this.chatSend(t); }
    });

    send.addEventListener('click', () => { const t = input.value.trim(); if (t) this.chatSend(t); });

    document.querySelectorAll('.suggestion-chip').forEach(c => {
      c.addEventListener('click', () => this.chatSend(c.dataset.p));
    });

    document.getElementById('newChatBtn').addEventListener('click', () => this.chatNew());

    const cs = document.getElementById('chatModel');
    if (cs) cs.value = this.state.defaultModel;
  },

  chatNew() {
    const m = document.getElementById('chatMessages');
    m.innerHTML = `
      <div class="welcome">
        <div class="welcome-icon">✦</div>
        <h2>Enmaa Chat</h2>
        <p>Powered by open-source AI models for education & research.</p>
        <div class="welcome-suggestions">
          ${SUGGESTIONS.map(s => `<button class="suggestion-chip" data-p="${s}">${s}</button>`).join('')}
        </div>
      </div>
    `;
    document.querySelectorAll('.suggestion-chip').forEach(c => c.addEventListener('click', () => this.chatSend(c.dataset.p)));
  },

  chatSend(text) {
    const input = document.getElementById('chatInput');
    const m = document.getElementById('chatMessages');
    const model = MODELS.find(m => m.id === (document.getElementById('chatModel')?.value || this.state.defaultModel));
    const name = model ? model.name : 'Enmaa AI';

    const w = m.querySelector('.welcome');
    if (w) w.remove();

    this.chatAdd('user', text, '👤', m);
    input.value = '';
    document.getElementById('sendBtn').disabled = true;
    input.style.height = 'auto';

    const el = this.chatAdd('assistant', '', '✦', m);
    const bubble = el.querySelector('.msg-b');
    bubble.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
    m.scrollTop = m.scrollHeight;

    if (this.state.live) {
      this.chatLive(text, model?.id || 'llama3.2', model?.provider || 'ollama', bubble, m);
      return;
    }

    setTimeout(() => {
      bubble.innerHTML = this.md(this.findChat(text));
      m.scrollTop = m.scrollHeight;
    }, 600 + Math.random() * 400);
  },

  async chatLive(text, modelId, provider, bubble, m) {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({modelId, messages:[{role:'user',content:text}]})
      });
      const d = await res.json();
      bubble.innerHTML = this.md(d.response);
    } catch {
      bubble.innerHTML = this.md(this.findChat(text));
    }
    m.scrollTop = m.scrollHeight;
  },

  chatAdd(role, content, avatar, container) {
    const d = document.createElement('div');
    d.className = `msg ${role}`;
    d.innerHTML = `<div class="msg-a">${avatar}</div><div class="msg-b">${content || ''}</div>`;
    container.appendChild(d);
    return d;
  },

  // ===== ARENA =====
  arena() {
    document.getElementById('arenaBtn').addEventListener('click', () => this.arenaGo());
    document.getElementById('arenaInput').addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); const t = e.target.value.trim(); if (t) this.arenaGo(); }
    });
    document.querySelectorAll('.vote-btn').forEach(b => {
      b.addEventListener('click', function() { this.classList.toggle('voted'); });
    });
    this.populateSelects();
  },

  populateSelects() {
    const opts = MODELS.filter(m => m.tags.includes('arena')).map(m =>
      `<option value="${m.id}">${m.emoji || ''} ${m.name}</option>`
    ).join('');
    const s1 = document.getElementById('arenaA');
    const s2 = document.getElementById('arenaB');
    if (s1) s1.innerHTML = opts;
    if (s2) s2.innerHTML = opts;
    if (s2) {
      const idx = Math.min(1, s2.options.length - 1);
      s2.selectedIndex = idx;
    }
  },

  arenaGo() {
    const prompt = document.getElementById('arenaInput').value.trim();
    if (!prompt) return;

    const mA = document.getElementById('arenaA').value;
    const mB = document.getElementById('arenaB').value;
    const nA = document.getElementById('arenaA').selectedOptions[0]?.text?.replace(/^[^\s]+\s/,'') || 'Model A';
    const nB = document.getElementById('arenaB').selectedOptions[0]?.text?.replace(/^[^\s]+\s/,'') || 'Model B';

    document.getElementById('arenaLoad').style.display = 'flex';
    document.getElementById('arenaResults').style.display = 'none';
    document.getElementById('arenaBtn').disabled = true;
    document.getElementById('arenaBtn').textContent = '⏳ Thinking...';

    document.getElementById('progA').textContent = `${nA}: Processing...`;
    document.getElementById('progB').textContent = `${nB}: Processing...`;
    document.getElementById('fillA').style.width = '0%';
    document.getElementById('fillB').style.width = '0%';

    document.getElementById('resNameA').textContent = nA;
    document.getElementById('resNameB').textContent = nB;
    document.getElementById('resBodyA').innerHTML = '<p class="res-ph">Waiting...</p>';
    document.getElementById('resBodyB').innerHTML = '<p class="res-ph">Waiting...</p>';

    if (this.state.live) {
      this.arenaLive(prompt, mA, mB, nA, nB);
      return;
    }

    setTimeout(() => {
      document.getElementById('fillA').style.width = '100%';
      document.getElementById('progA').textContent = `${nA}: Complete ✓`;
      document.getElementById('resBodyA').innerHTML = this.md(this.findChat(prompt));
      setTimeout(() => {
        document.getElementById('fillB').style.width = '100%';
        document.getElementById('progB').textContent = `${nB}: Complete ✓`;
        document.getElementById('resBodyB').innerHTML = this.md(this.findChat(prompt + ' (different perspective)'));
        document.getElementById('arenaLoad').style.display = 'none';
        document.getElementById('arenaResults').style.display = 'grid';
        document.getElementById('arenaBtn').disabled = false;
        document.getElementById('arenaBtn').textContent = '⚔️ Battle Again!';
      }, 700);
    }, 1200);
  },

  async arenaLive(prompt, mA, mB, nA, nB) {
    try {
      const res = await fetch('/api/arena', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({modelA:mA, modelB:mB, messages:[{role:'user',content:prompt}]})
      });
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = '';
      while (true) {
        const {done, value} = await reader.read();
        if (done) break;
        buf += dec.decode(value, {stream:true});
        const lines = buf.split('\n');
        buf = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const d = line.slice(6).trim();
            if (d === '[DONE]') continue;
            try {
              const msg = JSON.parse(d);
              if (msg.done) {
                document.getElementById(`resBody${msg.label}`).innerHTML = this.md(msg.text);
                document.getElementById(`fill${msg.label}`).style.width = '100%';
                document.getElementById(`prog${msg.label}`).textContent = `${msg.label === 'A' ? nA : nB}: Complete ✓`;
              }
            } catch {}
          }
        }
      }
    } catch (e) {
      document.getElementById('resBodyA').innerHTML = `<p>⚠️ ${e.message}</p>`;
      document.getElementById('resBodyB').innerHTML = `<p>⚠️ ${e.message}</p>`;
    }
    document.getElementById('arenaLoad').style.display = 'none';
    document.getElementById('arenaResults').style.display = 'grid';
    document.getElementById('arenaBtn').disabled = false;
    document.getElementById('arenaBtn').textContent = '⚔️ Battle Again!';
  },

  // ===== SEARCH =====
  search() {
    const input = document.getElementById('searchInput');
    const sug = document.getElementById('searchSuggest');
    let timer;

    input.addEventListener('input', () => {
      clearTimeout(timer);
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { sug.classList.remove('active'); return; }
      timer = setTimeout(() => {
        const matches = Object.values(TRENDING).filter(t => t.q.toLowerCase().includes(q));
        if (matches.length) {
          sug.innerHTML = matches.map(t => `<div class="sug-item" data-q="${t.q}"><span>📄</span> ${t.q}</div>`).join('');
          sug.classList.add('active');
          sug.querySelectorAll('.sug-item').forEach(i => {
            i.addEventListener('click', () => { input.value = i.dataset.q; sug.classList.remove('active'); App.searchDo(input.value); });
          });
        } else sug.classList.remove('active');
      }, 250);
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); sug.classList.remove('active'); const t = input.value.trim(); if (t) this.searchDo(t); }
    });

    document.getElementById('searchBtn').addEventListener('click', () => {
      sug.classList.remove('active');
      const t = input.value.trim();
      if (t) this.searchDo(t);
    });

    document.querySelectorAll('.trend-chip').forEach(c => {
      c.addEventListener('click', () => { input.value = c.dataset.q; this.searchDo(c.dataset.q); });
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.search-box-wrap') && !e.target.closest('#searchSuggest')) sug.classList.remove('active');
    });
  },

  searchDo(query) {
    const res = document.getElementById('searchResults');
    const syn = document.getElementById('researchSyn');
    const src = document.getElementById('sourcesList');
    const model = document.getElementById('searchModel').value;

    res.style.display = 'block';
    syn.innerHTML = `<div class="syn-load"><div class="spinner"></div><p>🔍 Researching "${query}"...</p></div>`;
    src.innerHTML = '';
    window.scrollTo({top: res.offsetTop - 80, behavior:'smooth'});

    if (this.state.live) {
      this.searchLive(query, model, syn, src);
      return;
    }

    setTimeout(() => {
      const data = this.findResearch(query);
      syn.innerHTML = `<div class="syn-c">${this.md(data.summary)}</div>`;
      src.innerHTML = (data.sources || []).map(s =>
        `<div class="src-item"><a href="${s.u}" target="_blank" rel="noopener">${s.t} <span class="src-badge">${s.s}</span></a></div>`
      ).join('') || '<p style="color:var(--t3)">Research synthesized by Enmaa.ai.</p>';
    }, 1000 + Math.random() * 500);
  },

  async searchLive(query, model, syn, src) {
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({query, model})
      });
      const d = await res.json();
      syn.innerHTML = `<div class="syn-c">${this.md(d.synthesis)}</div>`;
      src.innerHTML = (d.results || []).map(s =>
        `<div class="src-item"><a href="${s.url}" target="_blank" rel="noopener">${s.title} <span class="src-badge">${s.source}</span></a><p>${s.description || ''}</p></div>`
      ).join('');
    } catch {
      const data = this.findResearch(query);
      syn.innerHTML = `<div class="syn-c">${this.md(data.summary)}</div>`;
      src.innerHTML = (data.sources || []).map(s =>
        `<div class="src-item"><a href="${s.u}" target="_blank">${s.t} <span class="src-badge">${s.s}</span></a></div>`
      ).join('');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
