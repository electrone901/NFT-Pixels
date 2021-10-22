import React, { useEffect, useState } from 'react'
import CircularStatic from '../../commons/CircularProgressWithLabel'
import ImageListItem from '@material-ui/core/ImageListItem'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ImageListItemBar from '@material-ui/core/ImageListItemBar'
import { Grid } from '@material-ui/core'
import './Gallery.css'
import { apiKey } from '../../../APIKEYS'
import { Link } from 'react-router-dom'

function PetGallery() {
  const [petsData, setPetsData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadPets = async () => {
      try {
        setLoading(true)
        let cids = await fetch('https://api.nft.storage', {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        })
        cids = await cids.json()
        const temp = []
        for (let cid of cids.value) {
          if (cid?.cid) {
            let data = await fetch(
              `https://ipfs.io/ipfs/${cid.cid}/metadata.json`,
            )
            data = await data.json()

            const getImage = (ipfsURL) => {
              if (!ipfsURL) return
              ipfsURL = ipfsURL.split('://')
              return 'https://ipfs.io/ipfs/' + ipfsURL[1]
            }

            data.image = await getImage(data.image)
            data.cid = cid.cid
            data.created = cid.created
            temp.push(data)
          }
        }
        setPetsData(temp)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    loadPets()
  }, [])

  return (
    <div style={{ minHeight: '70vh', paddingBottom: '3rem' }}>
      {/* Add petsData */}
      {loading ? (
        <CircularStatic />
      ) : (
        <div style={{ flexGrow: 1 }}>
          <Grid container spacing={1}>
            {petsData.length ? (
              petsData.map((pet, index) => (
                <Grid item xs={6} sm={3} key={index}>
                  <ImageListItem style={{ height: '450px', listStyle: 'none' }}>
                    <img src={pet.image} alt={pet.name} />
                    <ImageListItemBar
                      title={pet.name}
                      subtitle={<span>by: {pet.description}</span>}
                      actionIcon={
                        <IconButton
                          aria-label={`info about ${pet.name}`}
                          className="icon"
                        >
                          <Button
                            variant="contained"
                            size="small"
                            component={Link}
                            to={`/nft-details/${pet.cid}`}
                            className="view-btn"
                          >
                            View
                          </Button>
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                </Grid>
              ))
            ) : (
              <h2>No NFTs Yet...</h2>
            )}
          </Grid>
        </div>
      )}
    </div>
  )
}
export default PetGallery
