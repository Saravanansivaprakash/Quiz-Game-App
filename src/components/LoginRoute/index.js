import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginRoute extends Component {
  state = {username: '', password: '', showPassword: true, errMsg: ''}

  onSuccess = data => {
    const {history} = this.props
    const jwtToken = data.jwt_token
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onFailure = data => {
    this.setState({errMsg: data})
  }

  loginApi = async () => {
    const {username, password} = this.state
    const userDetails = {username, password}
    const urlApi = 'https://apis.ccbp.in/login'
    const option = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(urlApi, option)
    const data = await response.json()
    if (response.ok) {
      this.onSuccess(data)
    } else {
      this.onFailure(data.error_msg)
    }
  }

  onSubmittingForm = event => {
    event.preventDefault()
    this.loginApi()
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onClickCheckbox = () => {
    this.setState(prevState => ({showPassword: !prevState.showPassword}))
  }

  render() {
    const {username, password, showPassword, errMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="login-responsive-container">
          <div className="logo-container">
            <img
              src="https://res.cloudinary.com/df1uli235/image/upload/v1714979567/quiz_game_logo_zq8zsu.svg"
              alt="login website logo"
              className="logo-style"
            />
            <h1 className="logo-name">NXT Quiz</h1>
          </div>
          <form onSubmit={this.onSubmittingForm} className="form-container">
            <div className="username-field">
              <label htmlFor="username" className="lable-username">
                USERNAME
              </label>
              <input
                id="username"
                type="text"
                onChange={this.onChangeUsername}
                value={username}
                className="input-style"
                placeholder="Enter the Username"
              />
            </div>
            <div className="password-field">
              <label htmlFor="password" className="lable-username">
                PASSWORD
              </label>
              <input
                id="password"
                type={showPassword ? 'password' : 'text'}
                onChange={this.onChangePassword}
                value={password}
                placeholder="Enter the Password"
                className="input-style"
              />
            </div>
            <div className="checkbox-container">
              <input
                type="checkbox"
                onClick={this.onClickCheckbox}
                className="checkbox-style"
                id="checkBok1"
              />
              <label className="chechbox-name" htmlFor="checkBok1">
                Show Password
              </label>
            </div>
            <button type="submit" className="login-btn">
              Login
            </button>
            {errMsg && <p className="err-msg">{errMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default LoginRoute
