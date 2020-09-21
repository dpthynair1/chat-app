const users = []

const addUser = ({id,username,room}) => {
//clean the data
username = username.trim().toLowerCase()
room = room.trim().toLowerCase()

if(!username || !room){
    return {
        error: 'Username and room required'
    }
}

// Check for existing user
const existingUser = users.find((user) => {
    return user.username === username && user.room === room
})

//Validate username
if(existingUser) {
    return {
        error: 'Username is in use!'
    }
}

// Store user
const user = {id, username, room}

users.push(user)
return {user}
}

//remove user
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })
    console.log(index)
    if(index !== -1){
        return users.splice(index,1)[0]
    }
    
}



// get user by id
const getUser = (id) => {
    return users.find((user) => user.id === id)
}

// Get users in a  room 
const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) =>  user.room === room) 
    }
    


module.exports= {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom

}