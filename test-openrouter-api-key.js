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
        model: 'openrouter/polaris-alpha',
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
