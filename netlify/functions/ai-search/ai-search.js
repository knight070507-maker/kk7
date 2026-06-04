const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

exports.handler = async function (event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    var body = JSON.parse(event.body || '{}');
    var query = body.query || '';

    if (!query || query.trim().length < 2) {
      return { statusCode: 400, headers: headers, body: JSON.stringify({ error: '请输入产品名称' }) };
    }

    var aiResp = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + DEEPSEEK_API_KEY,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{
          role: 'user',
          content: '用户搜索了护肤品："' + query + '"。\n\n' +
            '第一步：判断这个产品是否真实存在。如果这不是一个市面上真实存在的护肤品（可能是拼写错误、编造的名称、或者不存在的产品），你必须返回：\n' +
            '{"exists":false,"message":"没有找到名为「' + query + '」的产品，你是不是想找以下产品？","suggestions":["建议1（真实存在的相似产品）","建议2","建议3"]}\n' +
            'suggestions里列出3个真实存在的、名称相近或同类型的热门产品。\n\n' +
            '第二步：如果产品真实存在，按以下JSON格式分析：\n' +
            '{"exists":true,"productName":"产品名","brand":"品牌","category":"类别(cleanser/toner/serum/moisturizer/sunscreen/mask/other)","summary":"一句话总结","suitableFor":["肤质"],"targets":["针对问题"],"pros":["优点"],"cons":["缺点"],"priceTier":"budget/mid/premium/luxury","valueRating":"great-value/fair/overpriced/not-worth-it","valueNote":"性价比点评","ingredients":[{"name":"成分中文名","nameEn":"英文","riskLevel":0,"isIrritant":false,"isComedogenic":false,"function":"功能","simpleExplanation":"生活化解释50-80字"}]}\n\n' +
            '规则：\n' +
            '1. 名称相似但指代不明的（如只写品牌名没写具体产品），返回exists:false并给出该品牌的热门产品建议\n' +
            '2. 明显是拼写错误的，返回exists:false并给出正确的产品名建议\n' +
            '3. 完全编造的产品名，返回exists:false\n' +
            '4. 只返回JSON，不要任何解释文字\n' +
            '5. riskLevel: 0=安全 1=低风险 2=中风险 3=高风险'
        }],
        temperature: 0.3,
        max_tokens: 4096,
      }),
    });

    var data = await aiResp.json();
    var text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '{}';

    var jsonStr = text;
    var match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match) jsonStr = match[1];

    var result = JSON.parse(jsonStr.trim());

    if (result.exists === false) {
      return { statusCode: 200, headers: headers, body: JSON.stringify(result) };
    }

    // 分析存在，补充统计
    if (result.ingredients) {
      result.harmfulCount = result.ingredients.filter(function (i) { return i.riskLevel >= 2; }).length;
      result.irritantCount = result.ingredients.filter(function (i) { return i.isIrritant; }).length;
      result.comedogenicCount = result.ingredients.filter(function (i) { return i.isComedogenic; }).length;
      var hasRisk3 = result.ingredients.some(function (i) { return i.riskLevel === 3; });
      result.overallRating = hasRisk3 ? 'warning' : result.harmfulCount >= 3 ? 'warning' : result.harmfulCount >= 1 ? 'caution' : 'safe';
    }

    return { statusCode: 200, headers: headers, body: JSON.stringify(result) };
  } catch (e) {
    return { statusCode: 500, headers: headers, body: JSON.stringify({ error: '分析失败: ' + e.message }) };
  }
};
