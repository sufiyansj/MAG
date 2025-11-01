const OPENROUTER_API_KEY = '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';

async function testOpenRouterAPI() {
  console.log('Testing OpenRouter API with current key...');
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'Grok Chat App',
      },
      body: JSON.stringify({
        model: 'minimax/minimax-m2:free',
        messages: [
          {
            role: 'user',
            content: 'Hello, respond with just "API key is working"'
          }
        ],
        max_tokens: 10,
        temperature: 0.1,
      }),
    });

    const data = await response.json();
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ OpenRouter API key is working!');
    } else {
      console.log('❌ OpenRouter API key test failed');
      if (response.status === 401) {
        console.log('🔐 This is an authentication error - the API key is invalid');
      }
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testOpenRouterAPI();