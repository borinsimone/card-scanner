'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Container, Card, Button, Text, Heading } from '@/components/ui'

export default function TestDbPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testConnection = async () => {
    setIsLoading(true)
    setTestResults([])

    try {
      addResult('Testing Supabase connection...')

      // Test 1: Basic connection
      try {
        const { error } = await supabase.from('pokemon_sets').select('count').limit(1)
        if (error) {
          addResult(`❌ Pokemon sets query failed: ${error.message} (${error.code})`)
        } else {
          addResult(`✅ Pokemon sets query successful`)
        }
      } catch (err) {
        addResult(`❌ Pokemon sets query error: ${err}`)
      }

      // Test 2: Check authentication
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()
        if (error) {
          addResult(`❌ Auth check failed: ${error.message}`)
        } else if (user) {
          addResult(`✅ User authenticated: ${user.email}`)
        } else {
          addResult(`⚠️ No user authenticated`)
        }
      } catch (err) {
        addResult(`❌ Auth check error: ${err}`)
      }

      // Test 3: Try to access user_profiles
      try {
        const { error } = await supabase.from('user_profiles').select('count').limit(1)
        if (error) {
          addResult(`❌ User profiles query failed: ${error.message} (${error.code})`)
        } else {
          addResult(`✅ User profiles query successful`)
        }
      } catch (err) {
        addResult(`❌ User profiles query error: ${err}`)
      }

      // Test 4: Try to insert a test set
      try {
        const testSet = {
          id: 'test-set-' + Date.now(),
          name: 'Test Set',
          series: 'Test Series',
        }

        const { error } = await supabase.from('pokemon_sets').insert(testSet)
        if (error) {
          addResult(`❌ Test set insert failed: ${error.message} (${error.code})`)
        } else {
          addResult(`✅ Test set insert successful`)

          // Clean up
          await supabase.from('pokemon_sets').delete().eq('id', testSet.id)
          addResult(`🧹 Test set cleaned up`)
        }
      } catch (err) {
        addResult(`❌ Test set insert error: ${err}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container style={{ paddingTop: '2rem' }}>
      <Card>
        <Heading size="lg">Database Connection Test</Heading>
        <Text style={{ marginBottom: '1rem', color: '#666' }}>
          This page tests the Supabase database connection and permissions.
        </Text>

        <Button onClick={testConnection} disabled={isLoading}>
          {isLoading ? 'Testing...' : 'Run Database Tests'}
        </Button>

        {testResults.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <Heading size="md">Test Results:</Heading>
            <div
              style={{
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                maxHeight: '400px',
                overflowY: 'auto',
              }}
            >
              {testResults.map((result, index) => (
                <div key={index} style={{ marginBottom: '0.5rem' }}>
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </Container>
  )
}
