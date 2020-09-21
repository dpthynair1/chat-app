const socket = io()

// Elements

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $shareLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
//const $location = document.querySelector('#location')

//Template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
const autoscroll = () => {
    // grab new message element
    const $newMessage = $messages.lastElementChild

    // get margin of the new message/computed styles
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)

    // height of new message 
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight= $messages.offsetHeight

    // Messages container height
    const containerHeight = $messages.scrollHeight

    //How far have i scrolled? 
    const scrollOffset = $messages.scrollTop + visibleHeight

   // to autoscroll all the way to the bottom
    
    if(containerHeight - newMessageHeight <= scrollOffset){
     $messages.scrollTop = $messages.scrollHeight
    }
}

// Send welcome message
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:m a')
    })
    $messages.insertAdjacentHTML('beforeend', html)

    autoscroll()
})

socket.on('locationMessage', (url) => {
    //console.log(url)
    const html = Mustache.render(locationTemplate, {
        username: url.username,
        url: url.url,
        createdAt: moment(url.createdAt).format('h:m a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

//Get room data 
socket.on('roomData',({room,users}) => {
    // console.log(room)
    // console.log(users)
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

// Send message to server
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    //  let inputVal = document.querySelector('input').value
    $messageFormButton.setAttribute('disabled', 'disabled')

    let message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {

        //Enable button
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }
        console.log(' Message deliverd!')
    })
})

// Share location
$shareLocationButton.addEventListener('click', () => {

    $shareLocationButton.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) {
        return alert('Geolocation doesnot support your location')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        //  console.log(position)
        $shareLocationButton.removeAttribute('disabled')
        socket.emit('sendLocation', { longitude: position.coords.longitude, latitude: position.coords.latitude }, () => {
         
            console.log('Location shared')
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})
