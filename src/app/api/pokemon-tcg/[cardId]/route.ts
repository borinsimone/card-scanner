import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const POKEMON_TCG_BASE_URL = 'https://api.pokemontcg.io/v2'

export async function GET(request: NextRequest, { params }: { params: { cardId: string } }) {
  const { cardId } = params

  if (!cardId) {
    return NextResponse.json({ error: 'Card ID is required' }, { status: 400 })
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    // Add API key if available
    const apiKey = process.env.POKEMON_TCG_API_KEY
    if (apiKey) {
      headers['X-Api-Key'] = apiKey
    }

    const url = `${POKEMON_TCG_BASE_URL}/cards/${cardId}`
    console.log('🔗 [API ROUTE] Calling Pokemon TCG API for card ID:', url)

    const response = await axios.get(url, { headers })

    console.log('✅ [API ROUTE] Pokemon TCG API response for card:', {
      status: response.status,
      cardId: response.data?.data?.id,
      cardName: response.data?.data?.name,
    })

    return NextResponse.json({
      success: true,
      data: response.data?.data || null,
    })
  } catch (error) {
    console.error('❌ [API ROUTE] Pokemon TCG API error for card ID:', error)

    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json(
        {
          success: false,
          error: 'Card not found',
          data: null,
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null,
      },
      { status: 500 }
    )
  }
}
