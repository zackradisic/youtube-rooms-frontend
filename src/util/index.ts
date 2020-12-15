import axios from 'axios'

const ytRegexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/

export const extractYoutubeID = (url: string): string | null => url.match(ytRegexp) ? (url.match(ytRegexp) as string[])[1] : null

export const verifyRoomPassword = async (password: string, roomName: string): Promise<boolean> => {
  var axios = require('axios')
  var data = JSON.stringify({ roomName: roomName, password: password })

  const config = {
    method: 'post',
    url: `${process.env.REACT_APP_API_URL}/api/rooms/verify/`,
    data: data,
    validateStatus: () => true
  }

  const res = await axios(config)
  if (res.status !== 200) {
    throw new Error(res.data.error)
  }

  return !!res.data.success
}
