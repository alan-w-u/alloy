import mail from '../assets/mail.png'
import location from '../assets/location.png'
import instagram from '../assets/instagram.png'
import linkedin from '../assets/linkedin.png'
import discord from '../assets/discord.png'
import '../styles/Profile.css'

function Profile({ userData }) {
  return (
    <div className="profile">
      <h1>{userData.name}</h1>
      <h3>[{userData.pronouns}]</h3>
      <div className="picture" />
      <div className="info">
        <div className="cell">
          <img src={mail} alt="mail"></img>
          <h3>{userData.email}</h3>
        </div>
        <div className="cell">
          <img src={location} alt="location"></img>
          <h3>{userData.city}</h3>
        </div>
        <div className="cell">
          <img src={instagram} alt="instagram"></img>
          <h3>@{userData.socials.insta}</h3>
        </div>
        <div className="cell">
          <img src={linkedin} alt="linkedin"></img>
          <h3>{userData.socials.linkedin}</h3>
        </div>
        <div className="cell">
          <img src={discord} alt="discord"></img>
          <h3>{userData.socials.discord}</h3>
        </div>
        <h3>{userData.interests[0]}</h3>
        <h3>{userData.interests[1]}</h3>
        <h3>{userData.interests[2]}</h3>
      </div>
    </div>
  )
}

export default Profile
