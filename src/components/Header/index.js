import {HiOutlineLogout} from 'react-icons/hi'
import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="navbar">
      <Link to="/" className="link-style">
        <div className="navbar-logo">
          <img
            src="https://res.cloudinary.com/df1uli235/image/upload/v1714979567/quiz_game_logo_zq8zsu.svg"
            alt="website logo"
            className="navbar-logo-style"
          />
          <p className="navbar-logo-name">NXT Quiz</p>
        </div>
      </Link>
      <button
        type="button"
        className="logout-btn-medium"
        onClick={onClickLogout}
      >
        Logout
      </button>
      <ul className="btn-container">
        <li>
          <button
            type="button"
            aria-label="logout"
            onClick={onClickLogout}
            className="logout-btn"
          >
            <HiOutlineLogout size="24px" />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default withRouter(Header)
