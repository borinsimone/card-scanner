import { log } from 'console'
import React from 'react'
import styled from 'styled-components'
const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  border-radius: 0.5rem;
  z-index: 2;
`
function CardOverlay({ card }) {
  return (
    <OverlayContainer>
      {card.name}
      {card.set_id}-{card.number}
    </OverlayContainer>
  )
}

export default CardOverlay
