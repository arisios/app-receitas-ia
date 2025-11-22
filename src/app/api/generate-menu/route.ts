import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import type { UserPreferences, MenuResponse } from '@/lib/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const preferences: UserPreferences = await request.json()

    const prompt = `Você é um chef especialista em criar cardápios personalizados. Com base nas seguintes preferências do usuário, crie um cardápio com 6 pratos variados e deliciosos:

Restrições alimentares: ${preferences.dietary_restrictions.join(', ') || 'Nenhuma'}
Cozinhas preferidas: ${preferences.cuisine_preferences.join(', ')}
Nível de tempero: ${preferences.spice_level}
Orçamento: ${preferences.budget}
Tempo de preparo: ${preferences.cooking_time}
Tipo de refeição: ${preferences.meal_type}
Alergias: ${preferences.allergies.join(', ') || 'Nenhuma'}
Ingredientes favoritos: ${preferences.favorite_ingredients.join(', ')}
Ingredientes não desejados: ${preferences.disliked_ingredients.join(', ') || 'Nenhum'}
Porções: ${preferences.serving_size} pessoas

Retorne APENAS um JSON válido no seguinte formato (sem markdown, sem explicações):
{
  "dishes": [
    {
      "id": "1",
      "name": "Nome do Prato",
      "description": "Descrição apetitosa do prato",
      "ingredients": ["ingrediente1", "ingrediente2", "ingrediente3"],
      "preparation_time": "30 minutos",
      "difficulty": "Fácil",
      "cuisine_type": "Italiana",
      "dietary_info": ["Vegetariano", "Sem Glúten"],
      "estimated_price": "R$ 25-35",
      "calories": 450
    }
  ],
  "preferences_summary": "Resumo das preferências do usuário em 1-2 frases"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um chef especialista que cria cardápios personalizados. Sempre responda APENAS com JSON válido, sem markdown ou texto adicional.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2500,
    })

    const content = completion.choices[0].message.content
    if (!content) {
      throw new Error('Resposta vazia da OpenAI')
    }

    // Remove markdown se presente
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const menuData: MenuResponse = JSON.parse(cleanContent)

    return NextResponse.json(menuData)
  } catch (error) {
    console.error('Erro ao gerar cardápio:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar cardápio. Verifique suas credenciais da OpenAI.' },
      { status: 500 }
    )
  }
}
