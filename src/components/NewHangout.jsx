import { useState, useEffect } from 'react'
import { createGroupsByMbti } from '../scripts/matcher'
import { fetchFirebaseData, writeFirebaseData } from '../firebase/firebaseCommands'
import { fetchGoogleApiData, fetchGoogleApiDataById } from '../googleApi'
import '../styles/NewHangout.css'

const NewHangout = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState('ubc')
  const [selectedSize, setSelectedSize] = useState(2)
  const [groups, setGroups] = useState([])
  const [hangouts, setHangouts] = useState([])

  useEffect(() => {
    (async () => {
      const data = await fetchFirebaseData('hangouts')
      console.log('HANGOUTS DATA: ', data)
      setHangouts(data)
    })()
  }, [])

  const handleButtonClick = () => {
    setIsPopupVisible(!isPopupVisible)
  }

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value)
  }

  const handleSizeChange = (event) => {
    setSelectedSize(Number(event.target.value))
  }

  const extractInfoFromUsers = (users) => {
    const result = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i][0];
      if (user) {
        console.log('Extracting info: ', user.name, user.mbti);
        result.push([user.name, user.mbti]);
      }
    }
    return result;
  };

  const determineActivity = (userObjects) => {
    const allInterests = []

    for (let i = 0; i < userObjects.length; i++) {
      const user = userObjects[i][0];
      if (user) {
        for (let key in user.interests) {
          allInterests.push(user.interests[key])
        }
      }
    }

    console.log('allInterests: ', allInterests)

    const interestCount = {};
    console.log(allInterests)

    allInterests.forEach((interest) => {
      interestCount[interest] = (interestCount[interest] || 0) + 1;
    });

    let maxCount = 0;
    let mostFrequentInterest = '';

    for (const interest in interestCount) {
      if (interestCount[interest] > maxCount) {
        maxCount = interestCount[interest];
        mostFrequentInterest = interest;
      }
    }

    console.log("most frequent interests for ", userObjects)
    console.log(mostFrequentInterest)

    return mostFrequentInterest;
  }

  const determineSpecificActivity = async (activity) => {
    if (window.google) {
      try {
        const gapidata = await fetchGoogleApiData(activity)
        console.log('gapidata: ', gapidata)
        return fetchGoogleApiDataById(gapidata[0].place_id)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const createHangoutByGroup = async (userObjects, group, currentOrganization) => {
    const mappedGroup = {}
    const userList = []
    const userDataList = []
    for (let key in group) {
      userList.push(group[key])
    }
    for (let i = 0; i < userList.length; i++) {
      const userData = await fetchFirebaseData('users', {
        where: [
          { field: 'name', operator: '==', value: userList[i] }
        ]
      })
      mappedGroup[userList[i]] = userData
    }
    for (let key in mappedGroup) {
      userDataList.push(mappedGroup[key])
    }
    console.log('mappedGroup!!!!: ', mappedGroup)
    console.log('userDataList!!!!: ', userDataList)

    const activity = determineActivity(userDataList)
    const actualActivity = await determineSpecificActivity(activity)
    const actualActivityPhoto = actualActivity.photos[Math.floor(Math.random() * 10)].getUrl()

    console.log("actual activity: ", actualActivity)

    const hangout = {
      id: actualActivity.place_id,
      category: activity,
      activity: actualActivity.name,
      address: actualActivity.formatted_address,
      photo: actualActivityPhoto,
      rating: actualActivity.rating,
      organization: currentOrganization,
      users: group
    }

    writeFirebaseData('hangouts', hangout)

    return hangout
  }

  const parseInputToUsers = async (affiliationObjects) => {
    const result = []
    try {
      for (let i = 0; i < affiliationObjects.length; i++) {
        const email = affiliationObjects[i].user
        const user = await fetchFirebaseData('users', {
          where: [
            { field: 'email', operator: '==', value: email }
          ]
        })
        result.push(user)
      }
    } catch (error) {
      console.error('Error fetching data or parsing users:', error)
    }
    return result
  }

  const handleSubmit = async () => {
    try {
      const affiliationObjects = await fetchFirebaseData('affiliations', {
        where: [
          { field: 'group', operator: '==', value: selectedGroup }
        ]
      })
      console.log('Creating new group... Affiliation objects found: ', affiliationObjects)

      const userObjects = await parseInputToUsers(affiliationObjects)
      console.log('Creating new group... User objects found: ', userObjects)

      const users = extractInfoFromUsers(userObjects)
      console.log('Creating new group... Users found: ', users)

      const groupedUsers = createGroupsByMbti(users, selectedSize)
      setGroups(groups.concat(groupedUsers))
      console.log('Groups created: ', groupedUsers)

      const newHangouts = []
      for (let i = 0; i < groupedUsers.length; i++) {
        const hangout = await createHangoutByGroup(userObjects, groupedUsers[i], selectedGroup)
        newHangouts.push(hangout)
      }

      console.log('hangouts existing: ', hangouts)
      console.log('hangouts created: ', newHangouts)

      setHangouts(hangouts.concat(newHangouts))

    } catch (error) {
      console.error('Error fetching data or creating groups:', error)
    }

    setIsPopupVisible(false)
    setIsSuccessful(true)
    setTimeout(() => {
      setIsSuccessful(false);
    }, 3000);
  }

  const fetchPhotoUrlFromId = (place_id) => {
    const activity = fetchGoogleApiDataById(place_id)
    const photo = actualActivity.photos[0]
    return photo.getUrl
  }

  return (
    <div className='new-hangout'>
      <h1 className='header'>Hangouts</h1>
      <div className='groups-container'>
        <div className='groups-list'>
          {hangouts.map((hangout, index) => (
            <div key={index} className='group'>
              {/* <img
                key={index}
                src={fetchPhotoUrlFromId(hangout.id)} 
                alt={`Photo of ${hangout.activity}`}
                style={{ width: '300px', height: 'auto', margin: '10px' }} 
              /> */}
              <div>
                <h2>{hangout.activity}</h2>
                <p>{hangout.address}</p>
              </div>
              <div className="info">
                <div>
                  <h3>{hangout.organization}</h3>
                  <p>☆ {hangout.rating}</p>
                  <p>_________</p>
                  <ul className='group-members'>
                    {hangout.users.map((member, idx) => (
                      <li key={idx} className='group-member'>
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
                <img src={hangout.photo} alt={hangout.activity} className="photo" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className='create-button' onClick={handleButtonClick}>
        Create New Hangout
      </button>

      {isPopupVisible && (
        <div className='popup'>
          <div className='popup-content'>
            <label htmlFor='groupSelect'>Select Group:</label>
            <select
              id='groupSelect'
              value={selectedGroup}
              onChange={handleGroupChange}
            >
              {/* TODO query values that user is admin to */}
              <option value='ubc'>ubc</option>
              <option value='nwPlus'>nwPlus</option>
              <option value='workday'>workday</option>
            </select>

            <label htmlFor='sizeSelect'>Select Size:</label>
            <select
              id='sizeSelect'
              value={selectedSize}
              onChange={handleSizeChange}
            >
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
            </select>

            <button onClick={handleSubmit}>Create</button>
            <button className='cancel-btn' onClick={() => setIsPopupVisible(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {isSuccessful && (
        <div className='success-popup'>
          <div className='success-popup-content'>
            <div className='popup-icon'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='50'
                height='50'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='check-icon'
              >
                <path d='M20 6L9 17l-5-5'></path>
              </svg>
            </div>
            <h3>Success!</h3>
            <p>Your group has been created successfully.</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default NewHangout
