export type Role = 'ADMIN' | 'USER'
export type Visibility = 'public' | 'link' | 'private'
export type SourceType = 'youtube' | 'image' | 'text' | 'url'

export interface Profile {
  id: string
  username: string
  avatar_url?: string
  bio?: string
  is_public: boolean
  role: Role
  created_at: string
}

export interface Card {
  id: string
  slug: string
  user_id: string
  source_type: SourceType
  source_url?: string
  source_image_path?: string
  ai_title: string
  ai_points: string[]
  ai_one_line: string
  tags: string[]
  visibility: Visibility
  created_at: string
  profiles?: Profile
}

export interface Digest {
  id: string
  slug: string
  user_id: string
  title: string
  card_ids: string[]
  is_public: boolean
  published_at?: string
  created_at: string
}
