require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');

// Use native fetch (Node 18+) with fallback
if (!globalThis.fetch) {
  try { globalThis.fetch = require('node-fetch'); }
  catch { /* fallback handled */ }
}

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json({limit: '10mb'}));
app.use(express.static(path.join(__dirname, 'public')));

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const HF_TOKEN = process.env.HF_TOKEN || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

const MODELS = [
  // === Tier 1: Flagship (highest quality) ===
  { id: 'llama3.2', name: 'Llama 3.2', provider: 'ollama', size: '3B', description: 'Meta\'s latest — state-of-the-art 3B LLM, fast & capable', context: 8192, tier: 1, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'llama3.1:8b', name: 'Llama 3.1 (8B)', provider: 'ollama', size: '8B', description: 'Meta\'s powerful 8B model — strong reasoning & instruction following', context: 8192, tier: 1, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'mistral', name: 'Mistral v0.3', provider: 'ollama', size: '7B', description: 'Mistral AI\'s 7B — excellent reasoning & multilingual support', context: 8192, tier: 1, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'qwen2.5:7b', name: 'Qwen 2.5 (7B)', provider: 'ollama', size: '7B', description: 'Alibaba\'s top-tier 7B — up to 128K context, strong at coding & math', context: 32768, tier: 1, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'deepseek-r1:7b', name: 'DeepSeek R1 (7B)', provider: 'ollama', size: '7B', description: 'DeepSeek\'s reasoning model — chain-of-thought specialist', context: 32768, tier: 1, free: true, type: ['chat', 'arena', 'search'] },

  // === Tier 2: Efficient (fast & capable) ===
  { id: 'gemma2:2b', name: 'Gemma 2 (2B)', provider: 'ollama', size: '2B', description: 'Google\'s efficient 2B — surprisingly capable for its size', context: 8192, tier: 2, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'phi3.5:3.8b', name: 'Phi-3.5 (3.8B)', provider: 'ollama', size: '3.8B', description: 'Microsoft\'s compact powerhouse — punches above its weight', context: 4096, tier: 2, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'qwen2.5:3b', name: 'Qwen 2.5 (3B)', provider: 'ollama', size: '3B', description: 'Alibaba\'s light 3B — supports up to 32K context', context: 32768, tier: 2, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'llama3.2:1b', name: 'Llama 3.2 (1B)', provider: 'ollama', size: '1B', description: 'Meta\'s ultra-light 1B — fastest possible responses', context: 8192, tier: 2, free: true, type: ['chat', 'search'] },
  { id: 'gemma2:9b', name: 'Gemma 2 (9B)', provider: 'ollama', size: '9B', description: 'Google\'s 9B — strong alternative to Llama 3', context: 8192, tier: 2, free: true, type: ['chat', 'arena', 'search'] },

  // === Tier 3: Specialized ===
  { id: 'codellama', name: 'Code Llama', provider: 'ollama', size: '7B', description: 'Meta\'s code-specialist — generation, explanation, debugging', context: 16384, tier: 3, free: true, type: ['chat', 'search'] },
  { id: 'mixtral:8x7b', name: 'Mixtral 8x7B', provider: 'ollama', size: '47B', description: 'Mistral\'s MoE — GPT-3.5 class, needs 24GB+ RAM', context: 32768, tier: 3, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'falcon2:11b', name: 'Falcon 2 (11B)', provider: 'ollama', size: '11B', description: 'TII\'s Falcon 2 — strong multilingual & reasoning', context: 8192, tier: 3, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'starcoder2:3b', name: 'StarCoder 2 (3B)', provider: 'ollama', size: '3B', description: 'Code-focused 3B — fill-in-the-middle, multi-language', context: 16384, tier: 3, free: true, type: ['chat', 'search'] },
  { id: 'yi:6b', name: 'Yi (6B)', provider: 'ollama', size: '6B', description: '01.AI\'s Yi — strong bilingual (EN/ZH) general model', context: 4096, tier: 3, free: true, type: ['chat', 'search'] },
  { id: 'deepseek-coder:6.7b', name: 'DeepSeek Coder (6.7B)', provider: 'ollama', size: '6.7B', description: 'DeepSeek\'s code model — excels at coding tasks', context: 16384, tier: 3, free: true, type: ['chat', 'search'] },
  { id: 'phi3:14b', name: 'Phi-3 (14B)', provider: 'ollama', size: '14B', description: 'Microsoft\'s large Phi-3 — PhD-level reasoning', context: 4096, tier: 3, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'dbrx', name: 'DBRX', provider: 'ollama', size: '132B', description: 'Databricks\' MoE — extremely powerful, needs 48GB+', context: 32768, tier: 3, free: true, type: ['chat', 'arena'] },
  { id: 'command-r:35b', name: 'Command R+ (35B)', provider: 'ollama', size: '35B', description: 'Cohere\'s RAG-optimized model, needs 24GB+', context: 128000, tier: 3, free: true, type: ['chat', 'search'] },
  { id: 'solar:10.7b', name: 'Solar (10.7B)', provider: 'ollama', size: '10.7B', description: 'Upstage\'s efficient 10.7B — strong benchmark scores', context: 4096, tier: 3, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'nomic-embed-text', name: 'Nomic Embed Text', provider: 'ollama', size: '137M', description: 'Embedding model for semantic search & RAG', context: 2048, tier: 3, free: true, type: ['search'] },

  // === OpenRouter (free open-source models via API) — set OPENROUTER_API_KEY in .env ===
  { id: 'openrouter/free', name: 'Auto: Best Free (OR)', provider: 'openrouter', size: 'Auto', description: 'OpenRouter\'s best free model — always up-to-date, zero cost', context: 128000, tier: 1, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (OR)', provider: 'openrouter', size: '70B', description: 'Meta\'s Llama 3.3 70B via OpenRouter — completely free, state-of-the-art', context: 128000, tier: 1, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'deepseek/deepseek-v4-flash:free', name: 'DeepSeek V4 Flash (OR)', provider: 'openrouter', size: 'API', description: 'DeepSeek V4 Flash via OpenRouter — fast, powerful, free', context: 65536, tier: 1, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'nousresearch/hermes-3-llama-3.1-405b:free', name: 'Hermes 3 405B (OR)', provider: 'openrouter', size: '405B', description: 'NousResearch Hermes 3 405B via OpenRouter — massive model, free tier', context: 128000, tier: 1, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'meta-llama/llama-3.2-3b-instruct:free', name: 'Llama 3.2 3B (OR)', provider: 'openrouter', size: '3B', description: 'Meta\'s Llama 3.2 via OpenRouter — fast & free', context: 8192, tier: 1, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'qwen/qwen-2.5-7b-instruct', name: 'Qwen 2.5 7B (OR)', provider: 'openrouter', size: '7B', description: 'Alibaba\'s Qwen 2.5 via OpenRouter — strong coding & math', context: 32768, tier: 1, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'mistralai/mistral-7b-instruct-v0.1', name: 'Mistral 7B (OR)', provider: 'openrouter', size: '7B', description: 'Mistral 7B v0.1 via OpenRouter — excellent reasoning', context: 8192, tier: 2, free: true, type: ['chat', 'arena', 'search'] },

  // === Anthropic (Claude) — requires ANTHROPIC_API_KEY in .env ===
  { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4', provider: 'anthropic', size: 'API', description: 'Anthropic\'s Claude Sonnet — best-in-class reasoning & coding (needs API key)', context: 200000, tier: 1, free: false, type: ['chat', 'arena', 'search'] },
  { id: 'claude-haiku-3-5-20241022', name: 'Claude Haiku 3.5', provider: 'anthropic', size: 'API', description: 'Anthropic\'s Claude Haiku — fast, affordable, strong quality (needs API key)', context: 200000, tier: 2, free: false, type: ['chat', 'arena', 'search'] },

  // === HuggingFace ===
  { id: 'HuggingFaceH4/zephyr-7b-beta', name: 'Zephyr 7B', provider: 'huggingface', size: '7B', description: 'HF\'s aligned 7B assistant — helpful & harmless', context: 4096, tier: 1, free: true, type: ['chat', 'search'] },
  { id: 'microsoft/Phi-3.5-mini-instruct', name: 'Phi-3.5 Mini', provider: 'huggingface', size: '3.8B', description: 'Microsoft\'s 3.8B instruct via HF API', context: 4096, tier: 2, free: true, type: ['chat', 'search'] },
  { id: 'mistralai/Mistral-7B-Instruct-v0.3', name: 'Mistral 7B Instruct', provider: 'huggingface', size: '7B', description: 'Mistral 7B Instruct via HF Inference API', context: 8192, tier: 1, free: true, type: ['chat', 'search'] },
  { id: 'google/gemma-2-2b-it', name: 'Gemma 2 2B (HF)', provider: 'huggingface', size: '2B', description: 'Google\'s Gemma 2 via HuggingFace', context: 8192, tier: 2, free: true, type: ['chat', 'search'] },
  { id: 'meta-llama/Llama-3.2-3B-Instruct', name: 'Llama 3.2 3B (HF)', provider: 'huggingface', size: '3B', description: 'Meta\'s Llama 3.2 via HuggingFace', context: 8192, tier: 1, free: true, type: ['chat', 'arena', 'search'] },
  { id: 'Qwen/Qwen2.5-7B-Instruct', name: 'Qwen 2.5 7B (HF)', provider: 'huggingface', size: '7B', description: 'Alibaba\'s Qwen 2.5 via HuggingFace', context: 32768, tier: 1, free: true, type: ['chat', 'arena', 'search'] },
];

function getProvider(modelId) {
  return MODELS.find(m => m.id === modelId)?.provider || 'ollama';
}

async function ollamaChat(modelId, messages) {
  const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({model: modelId, messages, stream: false})
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Ollama (${res.status}): ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.message.content;
}

async function hfChat(modelId, messages) {
  const prompt = messages.map(m => {
    if (m.role === 'system') return `<|system|>\n${m.content}\n`;
    if (m.role === 'user') return `<|user|>\n${m.content}\n`;
    return `<|assistant|>\n${m.content}\n`;
  }).join('') + '<|assistant|>\n';

  const headers = {'Content-Type': 'application/json'};
  if (HF_TOKEN) headers['Authorization'] = `Bearer ${HF_TOKEN}`;

  const res = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      inputs: prompt,
      parameters: {max_new_tokens: 1536, temperature: 0.7, top_p: 0.95, return_full_text: false}
    })
  });
  if (!res.ok) {
    if (res.status === 503) throw new Error('HF_MODEL_LOADING');
    const text = await res.text();
    throw new Error(`HF (${res.status}): ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  const text = Array.isArray(data) ? data[0]?.generated_text || '' : data.generated_text || '';
  return text.trim();
}

async function anthropicChat(modelId, messages) {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not set. Add it to .env file.');
  }

  const sysMsg = messages.find(m => m.role === 'system');
  const chatMessages = messages.filter(m => m.role !== 'system').map(m => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: m.content
  }));

  const body = {
    model: modelId,
    max_tokens: 4096,
    messages: chatMessages
  };
  if (sysMsg) body.system = sysMsg.content;

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.content[0]?.text || '';
}

async function openrouterChat(modelId, messages) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not set. Add it to .env file.');
  }

  const sysMsg = messages.find(m => m.role === 'system');
  const chatMessages = messages.filter(m => m.role !== 'system');

  const body = {
    model: modelId,
    max_tokens: 4096,
    messages: [{role: 'system', content: sysMsg ? sysMsg.content : 'You are a helpful assistant.'}, ...chatMessages]
  };

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Enmaa.ai'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenRouter (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = await res.json();
  return data.choices[0]?.message?.content || '';
}

async function queryModel(modelId, messages) {
  const provider = getProvider(modelId);
  if (provider === 'huggingface') return hfChat(modelId, messages);
  if (provider === 'anthropic') return anthropicChat(modelId, messages);
  if (provider === 'openrouter') return openrouterChat(modelId, messages);
  return ollamaChat(modelId, messages);
}

async function fetchInstalledOllamaModels() {
  try {
    if (typeof fetch !== 'function') return [];
    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {signal: AbortSignal.timeout(3000)});
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || []).map(m => ({
      id: m.name.replace(':latest', '').split(':')[0],
      name: m.name.split(':')[0].charAt(0).toUpperCase() + m.name.split(':')[0].slice(1),
      local: true,
      size: m.size
    }));
  } catch { return []; }
}

app.get('/api/models', async (req, res) => {
  try {
    const local = await fetchInstalledOllamaModels();
    const localSet = new Set(local.map(m => m.id));
    const merged = MODELS.map(m => ({
      ...m,
      installed: m.provider === 'ollama' ? localSet.has(m.id) || localSet.has(m.id.split(':')[0]) : undefined
    }));
    res.json({models: merged, installed: local});
  } catch (e) {
    res.json({models: MODELS, installed: []});
  }
});

app.post('/api/chat', async (req, res) => {
  const { modelId, messages } = req.body;
  if (!modelId || !messages) return res.status(400).json({error: 'Missing parameters'});

  try {
    const text = await queryModel(modelId, messages);
    res.json({response: text, model: modelId});
  } catch (e) {
    const msg = e.message;
    if (msg === 'HF_MODEL_LOADING') {
      return res.json({response: '⏳ Model is loading on HuggingFace servers. Please wait ~30s and try again.', model: modelId, error: 'loading'});
    }
    if (msg.includes('ECONNREFUSED') || msg.includes('fetch failed') || msg.includes('connect')) {
      return res.json({
        response: '⚠️ **Ollama is not running.**  \nInstall & start it:\n```bash\nollama pull llama3.2\nollama serve\n```\nThen refresh this page.',
        model: modelId,
        error: 'offline'
      });
    }
    res.json({response: `⚠️ ${msg}`, model: modelId, error: 'api_error'});
  }
});

app.post('/api/arena', async (req, res) => {
  const { modelA, modelB, messages } = req.body;
  if (!modelA || !modelB || !messages) return res.status(400).json({error: 'Missing parameters'});

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'X-Accel-Buffering': 'no'
  });

  const results = {};
  let finished = 0;

  const run = async (modelId, label) => {
    try {
      const text = await queryModel(modelId, messages);
      results[label] = text.trim();
      res.write(`data: ${JSON.stringify({label, text: text.trim(), done: true})}\n\n`);
    } catch (e) {
      results[label] = `⚠️ Error: ${e.message}`;
      res.write(`data: ${JSON.stringify({label, text: `⚠️ ${e.message}`, done: true, error: true})}\n\n`);
    }
    finished++;
    if (finished >= 2) {
      res.write('data: [DONE]\n\n');
      res.end();
    }
  };

  Promise.all([run(modelA, 'A'), run(modelB, 'B')]);
});

app.post('/api/search', async (req, res) => {
  const { query, model } = req.body;
  if (!query) return res.status(400).json({error: 'Missing query'});

  try {
    const modelId = model || 'llama3.2';
    const enc = encodeURIComponent(query);
    const [wikiRes] = await Promise.all([
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${enc}`, {headers: {'User-Agent': 'EnmaaAI/1.0'}}).catch(() => null)
    ]);

    let wikiData = null, wikiContent = '';
    if (wikiRes && wikiRes.ok) {
      wikiData = await wikiRes.json();
      wikiContent = wikiData.extract || '';
    }

    const searchResults = wikiData ? [{
      title: wikiData.title,
      description: (wikiData.extract || '').slice(0, 300),
      url: `https://en.wikipedia.org/wiki/${enc}`,
      source: 'Wikipedia'
    }] : [];

    const sys = 'You are Enmaa AI, an expert educational research assistant. Synthesize clear, well-structured research summaries with markdown. Include overview, key concepts, takeaways, and further reading.';
    const user = `Topic: ${query}\n\nContext:\n${wikiContent.slice(0, 4000)}\n\nProvide a comprehensive educational summary with markdown formatting.`;

    let synthesis = '';
    try {
      synthesis = await queryModel(modelId, [
        {role: 'system', content: sys},
        {role: 'user', content: user}
      ]);
    } catch {
      synthesis = wikiContent || `## Research: ${query}\n\nAI synthesis unavailable. See sources below.`;
    }

    res.json({results: searchResults, synthesis, wikiUrl: wikiData?.content_urls?.desktop?.page || null});
  } catch (e) {
    res.json({results: [], synthesis: `## "${query}"\n\nResearch unavailable. Please try again.`, error: e.message});
  }
});

app.post('/api/suggest', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.json([]);
  try {
    const enc = encodeURIComponent(query);
    const r = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${enc}&limit=8&namespace=0&format=json`);
    const d = await r.json();
    res.json((d[1] || []).map((t, i) => ({title: t, url: d[3]?.[i] || `https://en.wikipedia.org/wiki/${encodeURIComponent(t)}`})));
  } catch { res.json([]); }
});

app.get('/api/health', (req, res) => {
  res.json({status: 'ok', name: 'Enmaa.ai', version: '2.0.0', models: MODELS.length});
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  const tier1 = MODELS.filter(m => m.tier === 1).map(m => m.name);
  console.log(`\n  ╔══════════════════════════════════╗`);
  console.log(`  ║       ✦ Enmaa.ai v2.0 ✦        ║`);
  console.log(`  ║  Multi-Model AI Platform        ║`);
  console.log(`  ╚══════════════════════════════════╝`);
  console.log(`  ───────────────────────────────────`);
  console.log(`  ➜  Server:    http://localhost:${PORT}`);
  console.log(`  ➜  Arena:     http://localhost:${PORT}/#arena`);
  console.log(`  ➜  Research:  http://localhost:${PORT}/#search`);
  console.log(`  ───────────────────────────────────`);
  console.log(`  📦 ${MODELS.length} open-source models available`);
  console.log(`  ⭐ Tier 1: ${tier1.join(', ')}`);
  console.log(`  ───────────────────────────────────`);
  if (!HF_TOKEN) console.log(`  💡 Set HF_TOKEN in .env for HF models`);
  console.log(`  ───────────────────────────────────\n`);
});
