import React, { useState } from "react"
import { createGroupsByMbti } from "../scripts/matcher"
import { fetchFirebaseData, fetchFirebaseDataByReference } from "../firebase/firebaseCommands"

const NewHangout = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState('ubc')
  const [selectedSize, setSelectedSize] = useState(2)

  const handleButtonClick = () => {
    setIsPopupVisible(!isPopupVisible)
  }

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value)
  }

  const handleSizeChange = (event) => {
    setSelectedSize(Number(event.target.value))
  }

  const extractNameAndMbti = (users) => {
    const result = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i][0];
      if (user) {
        console.log("Extracting info: ", user.name, user.mbti);
        result.push([user.name, user.mbti]); 
      }
    }
    return result;
  };
  

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
        console.error("Error fetching data or parsing users:", error)
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
      console.log("Creating new group... Affiliation objects found: ", affiliationObjects)

      const userObjects = await parseInputToUsers(affiliationObjects)
      console.log("Creating new group... User objects found: ", userObjects)

      const users = extractNameAndMbti(userObjects)
      console.log("Creating new group... Users found: ", users)

      const groupedUsers = createGroupsByMbti(users, selectedSize)
      console.log("Creating new group... Groups formed: ", users)
  
      console.log("Groups created: ", groupedUsers)
      setIsPopupVisible(false)
    } catch (error) {
      console.error("Error fetching data or creating groups:", error)
    }
  }

  return (
    <div>
      <button onClick={handleButtonClick}>
        Create New Hangout
      </button>

      {isPopupVisible && (
        <div className="popup">
          <div className="popup-content">
            <label htmlFor="groupSelect">Select Group:</label>
            <select
              id="groupSelect"
              value={selectedGroup}
              onChange={handleGroupChange}
            >
                {/* TODO query values that user is admin to */}
              <option value="ubc">ubc</option> 
              <option value="nwPlus">nwPlus</option>
              <option value="workday">workday</option>
            </select>

            <label htmlFor="sizeSelect">Select Size:</label>
            <select
              id="sizeSelect"
              value={selectedSize}
              onChange={handleSizeChange}
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">4</option>
            </select>

            <button onClick={handleSubmit}>Create</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NewHangout
