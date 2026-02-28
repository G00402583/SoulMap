import { NextRequest, NextResponse } from 'next/server';

const STYLE_ENHANCERS: Record<string, string> = {
  Dramatic:
    'dramatic lighting, high contrast shadows, intense atmosphere, cinematic tension, dark storm clouds, chiaroscuro lighting, powerful emotional weight',
  Dreamy:
    'soft ethereal bokeh, pastel dreamlike hues, magical floating particles, gentle diffused light, otherworldly mist, enchanted atmosphere, fairytale quality',
  Nostalgic:
    'warm sepia-tinged tones, vintage film grain texture, softly faded edges, golden hour amber light, timeless analog photography feel, hazy memory quality',
  Epic:
    'sweeping wide-angle vista, majestic heroic scale, breathtaking grandeur, dramatic golden clouds, awe-inspiring panorama, cinematic scope, legendary framing',
  Intimate:
    'close intimate framing, warm candlelight glow, soft gentle shadows, quiet personal moment, shallow depth of field, tender emotional warmth',
};

const TYPE_ENHANCERS: Record<string, string> = {
  Memory: 'a captured personal memory, a lived moment from the past, emotional resonance of lived experience',
  'Future Goal':
    'an aspirational future vision, a dream realized, hopeful forward-looking optimism, possibility made tangible',
  'Alternate Life':
    'a parallel universe divergent path, an alternate timeline what-if scenario, roads not taken made visible',
};

export async function POST(request: NextRequest) {
  try {
    const { description, momentType, cinematicStyle } = await request.json();

    if (!description || !momentType || !cinematicStyle) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }

    const styleHints = STYLE_ENHANCERS[cinematicStyle] ?? '';
    const typeHints = TYPE_ENHANCERS[momentType] ?? '';

    const enhancedPrompt = `A cinematic film still, award-winning photography, highly detailed, photorealistic, deeply emotional atmosphere. Scene: ${description}. This is ${typeHints}. Visual style: ${styleHints}. Composed with expert cinematography, striking color grading, professional lighting, 8K resolution, compelling artistic composition. No text, no watermarks.`;

    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'hd',
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      const message = errorData?.error?.message ?? 'OpenAI request failed';
      return NextResponse.json({ error: message }, { status: openaiResponse.status });
    }

    const data = await openaiResponse.json();
    const imageUrl = data.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL in response' }, { status: 500 });
    }

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({ imageUrl: dataUrl });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    console.error('Generate moment error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
