import Profile from '../components/Profile'
import NewHangout from '../components/NewHangout'
import '../styles/Home.css'

function Home() {
  return (
    <div className="home">
      <NewHangout />
      <Profile />
    </div>
  )
}

export default Home
