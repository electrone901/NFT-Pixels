import React, { Component } from 'react'
import { CirclePicker } from 'react-color'
import { withRouter } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { TextField, Typography, Button, IconButton } from '@material-ui/core'
import html2canvas from 'html2canvas'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import { apiKey } from '../../APIKEYS'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleLeft,
  faAngleRight,
  faArrowsAltH,
  faArrowsAltV,
} from '@fortawesome/free-solid-svg-icons'
import { NFTStorage, File } from 'nft.storage'

import './PixelMaker.css'

library.add(faAngleLeft, faAngleRight, faArrowsAltH, faArrowsAltV)

class PixelMaker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 25,
      width: 25,
      background: '#fff',
      cellColor: '#67eb08',
      mouseDown: false,
      menuVisible: true,
      workName: '',
      artDescription: '',
      image: '',
      imageType: '',
    }
  }

  handleChange = (event) => {
    const target = event.target
    const value = target.value
    const name = target.name
    console.log('name, target, value', name, target, value)

    this.setState({
      [name]: value,
    })
  }

  componentDidMount() {
    // create board
    const canvas = document.querySelector('#pixel_canvas')
    canvas.innerHTML = ''
    this.setState({ background: '#fff' })

    for (let x = 0; x < this.state.height; x++) {
      let row = document.createElement('tr')
      canvas.appendChild(row)

      for (let y = 0; y < this.state.width; y++) {
        let cell = document.createElement('td')
        row.appendChild(cell)
      }
    }
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const canvas = document.querySelector('#pixel_canvas')
    canvas.innerHTML = ''
    this.setState({ background: '#fff' })

    for (let x = 0; x < this.state.height; x++) {
      let row = document.createElement('tr')
      canvas.appendChild(row)

      for (let y = 0; y < this.state.width; y++) {
        let cell = document.createElement('td')
        row.appendChild(cell)
      }
    }
  }

  // Cell color
  handleCellColor = (color) => {
    this.setState({ cellColor: color.hex })
  }

  handleCellColorOnClick = (event) => {
    event.target.style.backgroundColor = this.state.cellColor
    event.target.style.borderColor = this.state.cellColor

    // border: `{1px solid ${this.state.background}}`,

    this.setState({ mouseDown: true })
  }

  handleMouseState = () => {
    this.setState({ mouseDown: false })
  }

  // Table background color
  handleBackgroundColor = (color) => {
    this.setState({ background: color.hex, borderColor: color.hex })
  }

  // Remove color
  handleColorRemove = (event) => {
    event.target.style.backgroundColor = ''
    event.target.style.borderColor = ''
  }

  mobileMenu = () => {
    this.setState((prevState) => ({
      menuVisible: !prevState.menuVisible,
    }))
  }

  handleSubmitToChain = async (event) => {
    event.preventDefault()
    console.log('this.state', this.state)

    // save image to NFTStorage, get the imageURL then save imgURL and data to chain using the contract
    try {
      const client = new NFTStorage({ token: apiKey })
      console.log('this.state', client, this.state)
      const metadata = await client.store({
        name: this.state.workName,
        description: this.state.artDescription,
        image: new File([this.state.image], this.state.imageName, {
          type: this.state.imageType,
        }),
      })
      if (metadata) {
        const urlToClean = metadata.data.image.href
        const cleanUrl = this.getImage(urlToClean)
        this.props.mintNFT(cleanUrl)
      }
    } catch (error) {
      console.log(error)
    }
  }

  getImage = (ipfsURL) => {
    if (!ipfsURL) return
    ipfsURL = ipfsURL.split('://')
    return 'https://ipfs.io/ipfs/' + ipfsURL[1]
  }

  downloadImage = async (e) => {
    e.preventDefault()
    var container = document.querySelector('#pixel_canvas')
    html2canvas(container, { allowTaint: true }).then(function (canvas) {
      var link = document.createElement('a')
      document.body.appendChild(link)
      link.download = 'workArt.png'
      link.href = canvas.toDataURL('image/png')
      link.target = '_blank'
      link.click()
    })
  }

  handleImage = (event) => {
    this.setState({
      image: event.target.files[0],
      imageType: event.target.files[0].type,
      imageName: event.target.files[0].name,
    })
  }

  render() {
    console.log('this.props', this.props)
    return (
      <div className="App">
        <div className="App-Content">
          {this.state.menuVisible ? (
            <div className="App-Settings">
              <h2>Canvas Settings</h2>

              <form id="sizePicker">
                <label className="label">
                  <FontAwesomeIcon icon="arrows-alt-v" /> Grid Height:
                  <input
                    className="input-value"
                    type="number"
                    id="input_height"
                    name="height"
                    min="1"
                    value={this.state.height}
                    onChange={this.handleChange}
                  />
                </label>
                <br />
                <label className="label">
                  <FontAwesomeIcon icon="arrows-alt-h" /> Grid Width:
                  <input
                    type="number"
                    id="input_width"
                    name="width"
                    min="1"
                    value={this.state.width}
                    onChange={this.handleChange}
                  />
                </label>
                <p>
                  <input
                    type="submit"
                    id="input_submit"
                    value="Create new grid"
                    onClick={this.handleSubmit}
                  />
                </p>
              </form>

              <FontAwesomeIcon icon="arrows-alt-h" />

              <hr className="Separator" />

              <h3>Pick A Background Color</h3>
              <CirclePicker
                onChangeComplete={this.handleBackgroundColor}
                color={this.state.background}
              />

              <hr className="Separator" />

              <h3>Pick A Color</h3>
              <CirclePicker
                onChangeComplete={this.handleCellColor}
                color={this.state.cellColor}
              />
              <p>Hint: Double click to remove a color</p>
            </div>
          ) : null}

          <div
            className={this.state.menuVisible ? 'Canvas' : 'Canvas full-width'}
          >
            <table
              id="pixel_canvas"
              style={{
                backgroundColor: this.state.background,
                marginLeft: '7rem',
              }}
              onMouseDown={this.handleCellColorOnClick}
              onMouseMove={
                this.state.mouseDown ? this.handleCellColorOnClick : null
              }
              onMouseUp={this.handleMouseState}
              onMouseLeave={this.handleMouseState}
              onTouchStart={this.handleCellColorOnClick}
              onTouchMove={
                this.state.mouseDown ? this.handleCellColorOnClick : null
              }
              onTouchEnd={this.handleMouseState}
              onDoubleClick={this.handleColorRemove}
            ></table>
            <Button
              size="small"
              onClick={this.downloadImage}
              className="downloadBTN"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                enableBackground="new 0 0 24 24"
                height="34"
                viewBox="0 0 24 24"
                width="34"
              >
                <g>
                  <rect fill="none" height="24" width="24" />
                </g>
                <g>
                  <path d="M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z" />
                </g>
              </svg>
              Save image
            </Button>

            {/* Add Form */}
            <div className="pixel-form2">
              <Typography
                className="body typography"
                color="textPrimary"
                gutterBottom
              >
                WARNING: please connect your wallet before drawing! Otherwise,
                your drawing may be deleted when you try to connect.
              </Typography>
              <form className="form" noValidate autoComplete="off">
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Artwork Name"
                  variant="outlined"
                  className="text-field"
                  defaultValue={this.state.workName}
                  onChange={(e) => this.setState({ workName: e.target.value })}
                />
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Art Description"
                  variant="outlined"
                  className="text-field"
                  rows={2}
                  defaultValue={this.state.artDescription}
                  onChange={(e) =>
                    this.setState({ artDescription: e.target.value })
                  }
                />
                <input
                  accept="image/*"
                  className="input"
                  id="icon-button-photo"
                  defaultValue={this.state.image}
                  onChange={this.handleImage}
                  type="file"
                />
                <label htmlFor="icon-button-photo">
                  <IconButton color="primary" component="span">
                    <PhotoCamera />
                  </IconButton>
                </label>

                <br />
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={this.handleSubmitToChain}
                >
                  Submit
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PixelMaker
