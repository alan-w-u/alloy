import React, { useState } from 'react'
import { createGroupsByMbti } from '../scripts/matcher'
import { fetchFirebaseData, fetchFirebaseDataByReference } from '../firebase/firebaseCommands'
import '../styles/NewHangout.css'
import { fetchGoogleApiData, fetchGoogleApiDataById } from '../googleApi' 

const NewHangout = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [isSuccessful, setIsSuccessful] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState('ubc')
  const [selectedSize, setSelectedSize] = useState(2)
  const [groups, setGroups] = useState([])
  const [hangouts, setHangouts] = useState([])

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
            fetchGoogleApiDataById(gapidata[0].place_id)
        } catch (error) {
            console.log(error)
        }
    }
  }

  const createHangoutByGroup = async (userObjects, group) => {
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
    const actualActivity = determineSpecificActivity(activity)
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
      setGroups(groups.concat(groupedUsers)) // this doesn't actually work bc groups is an object

      console.log('Groups created: ', groupedUsers)

      const newHangouts = []
      for (let i = 0; i < groupedUsers.length; i++) {
        const hangout = createHangoutByGroup(userObjects, groupedUsers[i])
        newHangouts.push(hangout)
      } 
      
    } catch (error) {
      console.error('Error fetching data or creating groups:', error)
    }

    setIsPopupVisible(false)
    setIsSuccessful(true)
    setTimeout(() => {
        setIsSuccessful(false);
      }, 3000); 
  }

  return (
    <div className='new-hangout'>
      <div className='groups-container'>
      <h2>Upcoming hangouts</h2>
      <div className='groups-list'>
        {groups.map((group, index) => (
          <div key={index} className='group'>
            <h3>{selectedGroup} {index + 1}</h3>
            <ul className='group-members'>
              {group.map((member, idx) => (
                <li key={idx} className='group-member'>
                  {member}
                </li>
              ))}
            </ul>
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
