export interface AuthResponse {
  token: string
  name: string
  lastName: string
  email: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  lastName: string
  email: string
  password: string
}

export interface FriendResponse {
  id: string
  name: string
  lastName: string
  email: string
}

export interface CreateFriendRequest {
  name: string
  lastName: string
  email: string
}

export interface UpdateFriendRequest {
  name: string
  lastName: string
  email: string
}

export interface ShuffleRequest {
  friendIds: string[]
  giftAmount: number
}

export interface ShuffleResponse {
  shuffled: boolean
  participantCount: number
  giftAmount: number
}
