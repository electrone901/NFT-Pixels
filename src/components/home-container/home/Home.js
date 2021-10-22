import React from 'react'
import { StylesProvider, Chip, Container } from '@material-ui/core'
import './Home.css'
import Gallery from '../gallery/Gallery'

function Home() {
  return (
    <StylesProvider injectFirst>
      <Container>
        <div className="label-btns">
          <Chip size="medium" label="Today NFTS" color="primary" clickable />

          <Chip size="medium" label="Last Week" clickable />
        </div>
        <Gallery />
      </Container>
    </StylesProvider>
  )
}

export default Home
