import React from 'react'
import styled from 'styled-components'
import { User, LogOut, Search, Package, FolderOpen } from 'lucide-react'
import { Heading, Text, Button } from '../ui'
import { theme } from '../../styles/theme'

interface SidebarProps {
  activeTab: 'search' | 'collection' | 'albums'
  setActiveTab: (tab: 'search' | 'collection' | 'albums') => void
  user: {
    displayName?: string
    email?: string
  }
  logout: () => void
}
const SidebarContainer = styled.div`
  width: 250px;
  background: ${theme.colors.white};
  box-shadow: ${theme.shadows.lg};
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  @media (max-width: 768px) {
    width: 200px;
  }
`

const SidebarHeader = styled.div`
  padding: ${theme.spacing[4]};
  border-bottom: 1px solid ${theme.colors.gray200};
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.pokemonBlue});
  color: white;
`

const SidebarNav = styled.nav`
  flex: 1;
  padding: ${theme.spacing[4]} 0;
`

const NavItem = styled.button<{ $active: boolean }>`
  width: 100%;
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: none;
  background: ${props => (props.$active ? `${theme.colors.primary}15` : 'transparent')};
  color: ${props => (props.$active ? theme.colors.primary : theme.colors.gray600)};
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  font-size: 1rem;
  font-weight: ${props => (props.$active ? '600' : 'normal')};

  &:hover {
    background: ${theme.colors.gray50};
  }

  ${props =>
    props.$active &&
    `
    border-right: 3px solid ${theme.colors.primary};
  `}
`
const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.pokemonBlue});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`
function Sidebar({ activeTab, setActiveTab, user, logout }: SidebarProps) {
  return (
    <SidebarContainer>
      <SidebarHeader>
        <Heading size="lg" style={{ margin: 0, color: 'white' }}>
          🎴 Card Scanner
        </Heading>
        <Text
          size="sm"
          style={{ margin: `${theme.spacing[1]} 0 0 0`, color: 'white', opacity: 0.9 }}
        >
          Gestisci la tua collezione
        </Text>
      </SidebarHeader>

      <SidebarNav>
        <NavItem $active={activeTab === 'search'} onClick={() => setActiveTab('search')}>
          <Search size={20} />
          Cerca Carte
        </NavItem>
        <NavItem $active={activeTab === 'collection'} onClick={() => setActiveTab('collection')}>
          <Package size={20} />
          Collezione
        </NavItem>
        <NavItem $active={activeTab === 'albums'} onClick={() => setActiveTab('albums')}>
          <FolderOpen size={20} />
          Album
        </NavItem>
      </SidebarNav>

      <div style={{ padding: theme.spacing[4], borderTop: `1px solid ${theme.colors.gray200}` }}>
        <UserInfo>
          <Avatar>
            <User size={16} />
          </Avatar>
          <div>
            <Text size="sm" weight="bold">
              {user.displayName || user.email}
            </Text>
            <Text size="xs" style={{ opacity: 0.7 }}>
              Utente attivo
            </Text>
          </div>
        </UserInfo>
        <Button
          onClick={logout}
          variant="outline"
          style={{
            width: '100%',
            marginTop: theme.spacing[2],
            fontSize: '0.9rem',
            padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
          }}
        >
          <LogOut size={14} />
          Logout
        </Button>
      </div>
    </SidebarContainer>
  )
}

export default Sidebar
