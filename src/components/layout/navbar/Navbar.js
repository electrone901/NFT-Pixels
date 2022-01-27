import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import VerifiedUserSharpIcon from '@material-ui/icons/VerifiedUserSharp'
import InputBase from '@material-ui/core/InputBase'
import Badge from '@material-ui/core/Badge'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import SearchIcon from '@material-ui/icons/Search'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MailIcon from '@material-ui/icons/Mail'
import NotificationsIcon from '@material-ui/icons/Notifications'
import MoreIcon from '@material-ui/icons/MoreVert'
import { StylesProvider } from '@material-ui/core/styles'
import './Navbar.css'
// import logo from '../../../images/logo.jpg'
import UAuth from '@uauth/js'

export const Navbar = withRouter(({ connectWallet, walletAddres }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [account, setAccount] = useState(null)
  const [udName, setUDName] = useState('')
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const uauth = new UAuth({
    clientID: 'F+MIZ/YHqCXdkqmsTJ1v3hfVrPUnbAjCXcTNCKE38fE=',
    clientSecret: 'SQfnxRHmcfdEbUlRN2dCPMkFqKVjcpCbwTW+j6FY6Ro=',
    redirectUri: 'https://nftpixels.netlify.app/callback',
  })

  const login = async () => {
    try {
      const authorization = await uauth.loginWithPopup()
      console.log(authorization)
      setUDName(authorization.idToken.sub)
      console.log('authorization.idToken.sub', authorization.idToken.sub)
    } catch (error) {
      console.error(error)
    }
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const menuId = 'primary-search-account-menu'
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label="show 11 new notifications" color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  )
  const logout = () => {
    console.log('logging out!')
    uauth.logout().catch((error) => {
      console.error('profile error:', error)
    })
    setUDName('')
  }

  const connectZilpay = async (e) => {
    e.preventDefault()
    try {
      await window.zilPay.wallet.connect()

      if (window.zilPay.wallet.isConnect) {
        walletAddres = window.zilPay.wallet.defaultAccount.bech32
        setAccount(window.zilPay.wallet.defaultAccount.bech32)
        console.log(
          '🚀 ~ zil1a6ltx5uegh330xfftk3xx289chken3d0xnfa5w',
          window.zilPay.wallet.defaultAccount.bech32,
        )
        localStorage.setItem('zilpay_connect', true)
        // window.location.reload(false)
      } else {
        alert('Zilpay connection failed, try again...')
      }
    } catch (error) {}
  }

  return (
    <StylesProvider injectFirst>
      <div className="grow">
        <AppBar position="static">
          <Toolbar>
            <Link to="/" className="whiteLink">
              <Typography className="title" variant="h6" noWrap>
                NFT Pixels
              </Typography>
            </Link>

            <div className="grow" />
            <div className="sectionDesktop">
              <Button className="whiteLink" component={Link} to="/create-nft">
                Create
              </Button>

              <Button className="whiteLink" component={Link} to="/">
                Market
              </Button>

              <Button className="whiteLink" component={Link} to="/about">
                About
              </Button>
              {/* Add Account  */}
              {udName ? (
                <>
                  <Button className="whiteLink">{udName}</Button>
                  <Button
                    variant="contained"
                    className="connected-btn"
                    endIcon={<VerifiedUserSharpIcon />}
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  className="connect-wallet-btn"
                  onClick={login}
                >
                  Connect Wallet
                </Button>
              )}

              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
            <div className="sectionMobile">
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </div>
    </StylesProvider>
  )
})
