import { Dispatch } from '@reduxjs/toolkit'
import { setCurrent, setPlaying, seekTo } from '../features/player/playerSlice'
import { setUsers } from '../features/usersDisplay'
import { User } from '../api/youtube-rooms-API'

export enum Action {
    SetVideo = 'set-video',
    SetVideoPlaying = 'set-video-playing',
    SeekTo = 'seek-to',
    GetUsers = 'get-users',
    InitClient = 'init-client'
}

interface WebsocketPayload<T extends Action, K> {
    action: T,
    data: K
}

interface WebsocketClientPayload<T extends Action, K> extends WebsocketPayload<T, K> {}

export type SetVideoPayload = WebsocketPayload<Action.SetVideo, { url: string, requester: string }>
export type SetVideoPlayingPayload = WebsocketPayload<Action.SetVideoPlaying, boolean>
export type SeekToPayload = WebsocketPayload<Action.SeekTo, number>
export type GetUsersPayload = WebsocketPayload<Action.GetUsers, User[]>
export type InitPayload = WebsocketPayload<Action.InitClient, { title: string, url: string, requester: string }>

export type SetVideoPayloadClient = WebsocketClientPayload<Action.SetVideo, string>
export type SetVideoPlayingPayloadClient = WebsocketClientPayload<Action.SetVideoPlaying, boolean>
export type SeekToPayloadClient = WebsocketClientPayload<Action.SeekTo, number>
export type GetUsersPayloadClient = WebsocketClientPayload<Action.GetUsers, any>
export type InitPayloadClient = WebsocketClientPayload<Action.InitClient, any>

export const parsePayload = (json: any, dispatch: Dispatch<any>) => {
  console.log(json.action)
  if ((json as SetVideoPayload).action === Action.SetVideo) {
    const payload = json as SetVideoPayload
    console.log(payload)
    const video = { url: payload.data.url, requester: payload.data.requester, title: "Zack's room" }
    dispatch(setCurrent(video))
  } else if ((json as SetVideoPlayingPayload).action === Action.SetVideoPlaying) {
    const payload = json as SetVideoPlayingPayload
    dispatch(setPlaying(payload.data))
  } else if ((json as SeekToPayload).action === Action.SeekTo) {
    const payload = json as SeekToPayload
    dispatch(seekTo(payload.data as number))
  } else if ((json as GetUsersPayload).action === Action.GetUsers) {
    const payload = json as GetUsersPayload
    dispatch(setUsers(payload.data))
  } else if ((json as InitPayload).action === Action.InitClient) {
    const payload = json as InitPayload
    const video = { url: payload.data.url, title: payload.data.title, requester: payload.data.requester }
    if (video.url !== '') {
      dispatch(setCurrent(video))
    }
  }
}

export const sendClientAction = <T extends Action, K> (payload: WebsocketClientPayload<T, K>, ws: WebSocket) => {
  ws.send(JSON.stringify(payload))
}
