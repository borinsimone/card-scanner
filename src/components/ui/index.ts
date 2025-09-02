import styled from 'styled-components'
import { theme } from '../../styles/theme'

// Button Component
export const Button = styled.button<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  disabled?: boolean
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
  border: none;
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.primary};
  font-weight: ${theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${theme.transitions.fast};
  text-decoration: none;

  ${props => props.fullWidth && `width: 100%;`}

  /* Size variants */
  ${props => {
    switch (props.size) {
      case 'sm':
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[3]};
          font-size: ${theme.fontSizes.sm};
          height: 2rem;
        `
      case 'lg':
        return `
          padding: ${theme.spacing[4]} ${theme.spacing[6]};
          font-size: ${theme.fontSizes.lg};
          height: 3rem;
        `
      default:
        return `
          padding: ${theme.spacing[3]} ${theme.spacing[4]};
          font-size: ${theme.fontSizes.base};
          height: 2.5rem;
        `
    }
  }}
  
  /* Color variants */
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background-color: #E08E00;
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
      case 'outline':
        return `
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primary};
            color: ${theme.colors.white};
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
      case 'ghost':
        return `
          background-color: transparent;
          color: ${theme.colors.gray600};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.gray100};
            color: ${theme.colors.gray800};
          }
        `
      case 'danger':
        return `
          background-color: ${theme.colors.danger};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background-color: #DC2626;
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
      default:
        return `
          background-color: ${theme.colors.primary};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryDark};
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
          }
        `
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
`

// Card Component
export const Card = styled.div<{
  padding?: 'sm' | 'md' | 'lg'
  shadow?: 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
}>`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.gray200};
  transition: all ${theme.transitions.fast};

  ${props => {
    switch (props.padding) {
      case 'sm':
        return `padding: ${theme.spacing[3]};`
      case 'lg':
        return `padding: ${theme.spacing[6]};`
      default:
        return `padding: ${theme.spacing[4]};`
    }
  }}

  ${props => {
    switch (props.shadow) {
      case 'sm':
        return `box-shadow: ${theme.shadows.sm};`
      case 'lg':
        return `box-shadow: ${theme.shadows.lg};`
      case 'xl':
        return `box-shadow: ${theme.shadows.xl};`
      default:
        return `box-shadow: ${theme.shadows.base};`
    }
  }}
  
  ${props =>
    props.hover &&
    `
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${theme.shadows.lg};
    }
  `}
`

// Input Component
export const Input = styled.input<{
  error?: boolean
  fullWidth?: boolean
}>`
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  border: 1px solid ${props => (props.error ? theme.colors.danger : theme.colors.gray300)};
  border-radius: ${theme.borderRadius.md};
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.base};
  background-color: ${theme.colors.white};
  transition: all ${theme.transitions.fast};
  outline: none;

  ${props => props.fullWidth && `width: 100%;`}

  &:focus {
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: ${theme.colors.gray400};
  }

  &:disabled {
    background-color: ${theme.colors.gray100};
    cursor: not-allowed;
  }
`

// Container Component
export const Container = styled.div<{
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: boolean
}>`
  margin: 0 auto;
  ${props => props.padding && `padding: 0 ${theme.spacing[4]};`}

  ${props => {
    switch (props.maxWidth) {
      case 'sm':
        return `max-width: 640px;`
      case 'md':
        return `max-width: 768px;`
      case 'lg':
        return `max-width: 1024px;`
      case 'xl':
        return `max-width: 1280px;`
      case '2xl':
        return `max-width: 1536px;`
      case 'full':
        return `max-width: 100%;`
      default:
        return `max-width: 1024px;`
    }
  }}
  
  @media (max-width: ${theme.breakpoints.sm}) {
    padding: 0 ${theme.spacing[3]};
  }
`

// Grid Component
export const Grid = styled.div<{
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: keyof typeof theme.spacing
  responsive?: boolean
}>`
  display: grid;
  gap: ${props => theme.spacing[props.gap || '4']};
  grid-template-columns: repeat(${props => props.cols || 1}, 1fr);

  ${props =>
    props.responsive &&
    `
    @media (max-width: ${theme.breakpoints.lg}) {
      grid-template-columns: repeat(${Math.min(props.cols || 1, 3)}, 1fr);
    }
    
    @media (max-width: ${theme.breakpoints.md}) {
      grid-template-columns: repeat(${Math.min(props.cols || 1, 2)}, 1fr);
    }
    
    @media (max-width: ${theme.breakpoints.sm}) {
      grid-template-columns: 1fr;
    }
  `}
`

// Flex Component
export const Flex = styled.div<{
  direction?: 'row' | 'column'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
  gap?: keyof typeof theme.spacing
  wrap?: boolean
}>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  align-items: ${props => {
    switch (props.align) {
      case 'start':
        return 'flex-start'
      case 'end':
        return 'flex-end'
      case 'stretch':
        return 'stretch'
      default:
        return 'center'
    }
  }};
  justify-content: ${props => {
    switch (props.justify) {
      case 'start':
        return 'flex-start'
      case 'end':
        return 'flex-end'
      case 'between':
        return 'space-between'
      case 'around':
        return 'space-around'
      case 'evenly':
        return 'space-evenly'
      default:
        return 'center'
    }
  }};
  gap: ${props => theme.spacing[props.gap || '0']};
  ${props => props.wrap && 'flex-wrap: wrap;'}
`

// Text Components
export const Heading = styled.h1<{
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: string
  margin?: boolean
}>`
  font-family: ${theme.fonts.heading};
  line-height: ${theme.lineHeights.tight};
  color: ${props => props.color || theme.colors.gray900};
  margin: ${props => (props.margin ? `0 0 ${theme.spacing[4]} 0` : '0')};

  ${props => {
    switch (props.size) {
      case 'sm':
        return `font-size: ${theme.fontSizes.lg};`
      case 'md':
        return `font-size: ${theme.fontSizes.xl};`
      case 'lg':
        return `font-size: ${theme.fontSizes['2xl']};`
      case 'xl':
        return `font-size: ${theme.fontSizes['3xl']};`
      case '2xl':
        return `font-size: ${theme.fontSizes['4xl']};`
      case '3xl':
        return `font-size: ${theme.fontSizes['5xl']};`
      default:
        return `font-size: ${theme.fontSizes['2xl']};`
    }
  }}

  font-weight: ${props => {
    switch (props.weight) {
      case 'normal':
        return theme.fontWeights.normal
      case 'medium':
        return theme.fontWeights.medium
      case 'semibold':
        return theme.fontWeights.semibold
      case 'bold':
        return theme.fontWeights.bold
      default:
        return theme.fontWeights.bold
    }
  }};
`

export const Text = styled.p<{
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  color?: string
  margin?: boolean
}>`
  font-family: ${theme.fonts.primary};
  line-height: ${theme.lineHeights.normal};
  color: ${props => props.color || theme.colors.gray700};
  margin: ${props => (props.margin ? `0 0 ${theme.spacing[3]} 0` : '0')};

  font-size: ${props => {
    switch (props.size) {
      case 'xs':
        return theme.fontSizes.xs
      case 'sm':
        return theme.fontSizes.sm
      case 'lg':
        return theme.fontSizes.lg
      case 'xl':
        return theme.fontSizes.xl
      default:
        return theme.fontSizes.base
    }
  }};

  font-weight: ${props => {
    switch (props.weight) {
      case 'light':
        return theme.fontWeights.light
      case 'medium':
        return theme.fontWeights.medium
      case 'semibold':
        return theme.fontWeights.semibold
      case 'bold':
        return theme.fontWeights.bold
      default:
        return theme.fontWeights.normal
    }
  }};
`

// Badge Component
export const Badge = styled.span<{
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.full};
  font-family: ${theme.fonts.primary};
  font-weight: ${theme.fontWeights.medium};
  white-space: nowrap;

  ${props => {
    switch (props.size) {
      case 'sm':
        return `
          padding: ${theme.spacing[1]} ${theme.spacing[2]};
          font-size: ${theme.fontSizes.xs};
          height: 1.25rem;
        `
      case 'lg':
        return `
          padding: ${theme.spacing[2]} ${theme.spacing[4]};
          font-size: ${theme.fontSizes.base};
          height: 2rem;
        `
      default:
        return `
          padding: ${theme.spacing[1]} ${theme.spacing[3]};
          font-size: ${theme.fontSizes.sm};
          height: 1.5rem;
        `
    }
  }}

  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background-color: ${theme.colors.secondary}20;
          color: ${theme.colors.secondary};
        `
      case 'success':
        return `
          background-color: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `
      case 'warning':
        return `
          background-color: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `
      case 'danger':
        return `
          background-color: ${theme.colors.danger}20;
          color: ${theme.colors.danger};
        `
      case 'info':
        return `
          background-color: ${theme.colors.info}20;
          color: ${theme.colors.info};
        `
      default:
        return `
          background-color: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `
    }
  }}
`

// Export other UI components
export { default as AddToCollectionButton } from './CollectionButton'
