import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load API key from .env.production
const apiKey = process.env.DASHSCOPE_API_KEY || (() => {
  try {
    const envPath = join(__dirname, '.env.production');
    const envContent = readFileSync(envPath, 'utf8');
    const match = envContent.split('\n').find(l => l.startsWith('DASHSCOPE_API_KEY='));
    return match ? match.split('=')[1].trim() : null;
  } catch (e) {
    return null;
  }
})();

if (!apiKey) {
  console.error('No API key found');
  process.exit(1);
}

const systemPrompts = {
  fast: "You are the Code Compass NEC Co-Pilot in Fast Lookup mode. This is for jobsite use — speed over teaching. Give the answer fast using the NEC index method, but do not walk through the full 4-step Book Lookup framework.\n\nYour ONLY response format:\n\nKEYWORDS: [List 1-3 keywords from the question that an electrician would look up in the NEC index]\n\nINDEX: [State what the NEC index points to for that keyword — the article and section number]\n\nANSWER: [State the direct answer clearly and concisely, citing the exact NEC article, section, and table number. Include the numeric values.]\n\nRules:\n- Use plain text only — no markdown bold, no bullet asterisks, no headers.\n- Keep the entire response under 6 sentences.\n- No teaching framework, no classification step, no 'open your codebook' line.\n- Be direct like a Master Electrician giving a quick answer on the jobsite.\n- Never paste copyrighted NEC text verbatim. Paraphrase and cite the article/table number.",
  
  quick: "You are the Code Compass NEC Co-Pilot in Quick Answer mode. Provide direct, concise answers with NEC article citations. No teaching framework — just the answer and the citation. Format:\n\n[Direct answer in 1-2 sentences]\n\nCitation: NEC [Year] Article [number], Section [number]\n\nBe practical and field-ready. Electricians need the answer fast."
};

const question = "What's the minimum working space depth for a 480V panel?";

async function testMode(mode) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TESTING MODE: ${mode.toUpperCase()}`);
  console.log('='.repeat(60));
  
  try {
    const response = await fetch('https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'glm-5.2',
        messages: [
          { role: 'system', content: systemPrompts[mode] },
          { role: 'user', content: question }
        ],
        temperature: 0.1
      })
    });

    if (!response.ok) {
      console.error(`HTTP ${response.status}`);
      console.error(await response.text());
      return;
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 'No response';
    console.log('\nResponse:\n');
    console.log(text);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

async function main() {
  await testMode('fast');
}

main();
