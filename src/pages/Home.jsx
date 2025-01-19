import Profile from '../components/Profile'
import NewHangout from '../components/NewHangout'
import '../styles/Home.css'

function Home({ userData }) {
  if (!userData) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="home">
      <NewHangout />
      <Profile userData={userData} />
    </div>
  )
}

export default Home
