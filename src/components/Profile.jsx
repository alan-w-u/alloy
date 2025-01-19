import '../styles/Profile.css'

function Profile({ userData }) {
  return (
    <div className="profile">
      <h1>{userData.name}</h1>
      <h3>[{userData.pronouns}]</h3>
      <div className="picture" />
      <h3>{userData.email}</h3>
      <h3>{userData.city}</h3>
      <h3>{userData.socials.insta}</h3>
      <h3>{userData.socials.linkedin}</h3>
      <h3>{userData.socials.discord}</h3>
      <h3>{userData.interests[0]}</h3>
      <h3>{userData.interests[1]}</h3>
      <h3>{userData.interests[2]}</h3>
    </div>
  )
}

export default Profile
