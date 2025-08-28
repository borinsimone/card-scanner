import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const POKEMON_TCG_BASE_URL = 'https://api.pokemontcg.io/v2'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const pageSize = searchParams.get('pageSize') || '50'

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
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

    const url = `${POKEMON_TCG_BASE_URL}/cards?q=${encodeURIComponent(query)}&pageSize=${pageSize}`
    console.log('🔗 [API ROUTE] Calling Pokemon TCG API:', url)

    const response = await axios.get(url, { headers })

    console.log('✅ [API ROUTE] Pokemon TCG API response:', {
      status: response.status,
      cardCount: response.data?.data?.length || 0,
      totalCount: response.data?.totalCount || 0,
    })

    return NextResponse.json({
      success: true,
      data: response.data?.data || [],
      totalCount: response.data?.totalCount || 0,
    })
  } catch (error) {
    console.error('❌ [API ROUTE] Pokemon TCG API error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: [],
        totalCount: 0,
      },
      { status: 500 }
    )
  }
}
