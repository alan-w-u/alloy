import placeholderprofile from '../assets/placeholder-profile.jpg'
import '../styles/Nav.css'

function Nav() {
  return (
    <nav className="nav">
      <h1>Alloy</h1>
      <img src={placeholderprofile} alt="placeholder-profile" className="picture"></img>
    </nav>
  )
}

export default Nav
