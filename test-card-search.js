// Test script to verify card search functionality
const axios = require('axios')

async function testCardSearch() {
  try {
    console.log('🧪 Testing direct card ID search...')

    // Test the direct card ID endpoint
    const response = await axios.get('http://localhost:3000/api/pokemon-tcg/ex7-10')

    console.log('✅ Direct API call successful:', {
      success: response.data.success,
      cardName: response.data.data?.name,
      cardId: response.data.data?.id,
      set: response.data.data?.set?.name,
    })
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message)
  }
}

testCardSearch()
