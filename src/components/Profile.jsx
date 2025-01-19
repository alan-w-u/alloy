import { useState } from 'react'
import { editFirebaseData } from '../firebase/firebaseCommands'
import placeholderprofile from '../assets/placeholder-profile.jpg'
import mail from '../assets/mail.png'
import location from '../assets/location.png'
import instagram from '../assets/instagram.png'
import linkedin from '../assets/linkedin.png'
import discord from '../assets/discord.png'
import '../styles/Profile.css'

function Profile({ userData }) {
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [email, setEmail] = useState(userData.email || '')
  const [city, setCity] = useState(userData.city || '')
  const [insta, setInsta] = useState(userData.socials.insta || '')
  const [linkedinName, setLinkedinName] = useState(userData.socials.linkedin || '')
  const [discordName, setDiscordName] = useState(userData.socials.discord || '')

  function handleButtonClick() {
    setIsPopupVisible(true)
  }

  function handleSave() {
    editFirebaseData('users', userData.id, 'email', email)
    editFirebaseData('users', userData.id, 'city', city)
    editFirebaseData('users', userData.id, 'insta', insta)
    editFirebaseData('users', userData.id, 'linkedin', linkedinName)
    editFirebaseData('users', userData.id, 'discord', discordName)
    setIsPopupVisible(false)
  }

  return (
    <div className="profile">
      <h1>{userData.name}</h1>
      <h3>[{userData.pronouns}]</h3>
      <img src={placeholderprofile} alt="placeholder-profile" className="picture"></img>
      <div className="info">
        <div className="cell">
          <img src={mail} alt="mail"></img>
          <h3>{email}</h3>
        </div>
        <div className="cell">
          <img src={location} alt="location"></img>
          <h3>{city}</h3>
        </div>
        <div className="cell">
          <img src={instagram} alt="instagram"></img>
          <h3>@{insta}</h3>
        </div>
        <div className="cell">
          <img src={linkedin} alt="linkedin"></img>
          <h3>{linkedinName}</h3>
        </div>
        <div className="cell">
          <img src={discord} alt="discord"></img>
          <h3>{discordName}</h3>
        </div>
        <div className="activities">
          <h2>Favourite Activities</h2>
          <h3>{userData.interests[0]}, {userData.interests[1]}, {userData.interests[2]}</h3>
        </div>
      </div>
      <button className="edit" onClick={handleButtonClick}>Edit</button>

      {isPopupVisible && (
        <div className='popup'>
          <div className='popup-content'>
            <label htmlFor='groupSelect'>Edit Profile</label>
            <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            <input placeholder="city" value={city} onChange={(e) => setCity(e.target.value)}></input>
            <input placeholder="instagram" value={insta} onChange={(e) => setInsta(e.target.value)}></input>
            <input placeholder="linkedin" value={linkedinName} onChange={(e) => setLinkedinName(e.target.value)}></input>
            <input placeholder="discord" value={discordName} onChange={(e) => setDiscordName(e.target.value)}></input>
            <button className='save-btn' onClick={handleSave}>Save</button>
            <button className='cancel-btn' onClick={() => setIsPopupVisible(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
