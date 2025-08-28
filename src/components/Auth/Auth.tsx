import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button, Input, Card, Container, Text } from '@/components/ui'
import { User, LogOut } from 'lucide-react'
import styled from 'styled-components'

const AuthContainer = styled(Card)`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
`

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const ErrorMessage = styled(Text)`
  color: #e74c3c;
  text-align: center;
  margin-top: 0.5rem;
`

const SuccessMessage = styled(Text)`
  color: #27ae60;
  text-align: center;
  margin-top: 0.5rem;
`

const AuthToggle = styled(Button)`
  background: transparent;
  color: #6c7b7f;
  border: none;
  margin-top: 1rem;

  &:hover {
    background: rgba(108, 123, 127, 0.1);
  }
`

const CenteredContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`

const SubtitleText = styled(Text)`
  color: #6c7b7f;
  text-align: center;
`

interface AuthProps {
  onAuthSuccess?: () => void
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      console.log('Auth check - User:', user) // Debug log
      if (user && onAuthSuccess) {
        onAuthSuccess()
      }
    }
    checkUser()
  }, [onAuthSuccess])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        setMessage('Accesso effettuato con successo!')
        // Non chiamiamo onAuthSuccess qui perché useAuth si aggiorna automaticamente
      } else {
        // Register
        if (password !== confirmPassword) {
          throw new Error('Le password non corrispondono')
        }

        if (password.length < 6) {
          throw new Error('La password deve essere di almeno 6 caratteri')
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        if (data.user && !data.user.email_confirmed_at) {
          setMessage('Controlla la tua email per confermare la registrazione!')
        } else {
          setMessage('Registrazione completata con successo!')
          // Non chiamiamo onAuthSuccess qui perché useAuth si aggiorna automaticamente
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error)
      setError(error.message || 'Si è verificato un errore')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      // Get current port from window.location
      const currentUrl = window.location.origin

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${currentUrl}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      console.error('Google auth error:', error)
      setError(
        "Errore durante l'accesso con Google. Assicurati che Google OAuth sia configurato in Supabase."
      )
    }
  }

  return (
    <AuthContainer>
      <CenteredContainer>
        <User size={48} color="#f39c12" />
        <Text size="xl" weight="bold">
          {isLogin ? 'Accedi al tuo account' : 'Crea un nuovo account'}
        </Text>
        <SubtitleText>
          {isLogin
            ? 'Accedi per gestire la tua collezione di carte Pokemon'
            : 'Registrati per iniziare a collezionare carte Pokemon'}
        </SubtitleText>
      </CenteredContainer>

      <AuthForm onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        {!isLogin && (
          <Input
            type="password"
            placeholder="Conferma Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        )}

        <Button type="submit" disabled={loading}>
          {loading ? 'Caricamento...' : isLogin ? 'Accedi' : 'Registrati'}
        </Button>

        <Button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{ backgroundColor: '#fff', color: '#333', border: '1px solid #ddd' }}
        >
          Continua con Google
        </Button>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && <SuccessMessage>{message}</SuccessMessage>}

        <AuthToggle
          type="button"
          onClick={() => {
            setIsLogin(!isLogin)
            setError('')
            setMessage('')
          }}
          disabled={loading}
        >
          {isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
        </AuthToggle>
      </AuthForm>
    </AuthContainer>
  )
}

// Hook for checking authentication status
export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email) // Debug log
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return {
    user,
    loading,
    logout,
    isAuthenticated: !!user,
  }
}
