export type UserRole = 'customer' | 'worker' | 'both'
export type VerificationStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected'
export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled'
export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled'
export type PricingType = 'hourly' | 'fixed'
export type PayoutMethod = 'gcash' | 'maya'
export type NotificationType = 'booking' | 'message' | 'verification' | 'system'

export interface User {
  id: string
  phone: string
  email?: string
  first_name: string
  last_name: string
  date_of_birth?: string
  profile_photo_url?: string
  bio?: string
  location_lat?: number
  location_lng?: number
  role: UserRole
  is_available: boolean
  dark_mode: boolean
  created_at: string
  updated_at: string
}

export interface Verification {
  id: string
  user_id: string
  status: VerificationStatus
  id_type?: string
  id_number?: string
  id_front_url?: string
  id_back_url?: string
  police_clearance_ref?: string
  police_clearance_date?: string
  police_clearance_url?: string
  rejection_reason?: string
  submitted_at?: string
  reviewed_at?: string
  created_at: string
}

export interface Category {
  id: string
  slug: string
  name: string
  icon_name: string
  bg_color: string
  icon_color: string
  sort_order: number
}

export interface JobPost {
  id: string
  customer_id: string
  title: string
  description: string
  address: string
  location_lat?: number
  location_lng?: number
  category_slug: string
  skills_needed: string[]
  pricing_type: PricingType
  budget_max: number
  workers_needed: number
  scheduled_date: string
  estimated_hours?: number
  start_time?: string
  end_time?: string
  what_is_included: string[]
  status: JobStatus
  created_at: string
  updated_at: string
  categories?: Category
  users?: User
}

export interface Booking {
  id: string
  job_post_id: string
  worker_id: string
  customer_id: string
  status: BookingStatus
  worker_note?: string
  created_at: string
  updated_at: string
  job_posts?: JobPost
  worker?: User
  customer?: User
}

export interface Chat {
  id: string
  booking_id: string
  participant_1: string
  participant_2: string
  created_at: string
  booking?: Booking
  messages?: Message[]
  other_user?: User
}

export interface Message {
  id: string
  chat_id: string
  sender_id: string
  content: string
  read_at?: string
  created_at: string
  sender?: User
}

export interface PayoutDetail {
  id: string
  user_id: string
  method: PayoutMethod
  account_name: string
  account_number: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  body: string
  type: NotificationType
  data: Record<string, unknown>
  read: boolean
  created_at: string
}

export interface WorkerPhoto {
  id: string
  user_id: string
  photo_url: string
  created_at: string
}

export interface Credential {
  id: string
  user_id: string
  title: string
  issuer?: string
  document_url: string
  created_at: string
}

export interface Service {
  id: string
  worker_id: string
  title: string
  description: string
  price: number
  pricing_type: PricingType
  photo_url?: string
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  booking_id: string
  customer_id: string
  worker_id: string
  rating: number
  tags: string[]
  comment?: string
  created_at: string
  customer?: User
}

export interface SavedWorker {
  id: string
  customer_id: string
  worker_id: string
  created_at: string
}

export interface Announcement {
  id: string
  title: string
  body: string
  published: boolean
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          phone: string
          email: string | null
          first_name: string
          last_name: string
          date_of_birth: string | null
          profile_photo_url: string | null
          bio: string | null
          location_lat: number | null
          location_lng: number | null
          role: string
          is_available: boolean
          dark_mode: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone: string
          email?: string | null
          first_name: string
          last_name: string
          date_of_birth?: string | null
          profile_photo_url?: string | null
          bio?: string | null
          location_lat?: number | null
          location_lng?: number | null
          role?: string
          is_available?: boolean
          dark_mode?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone?: string
          email?: string | null
          first_name?: string
          last_name?: string
          date_of_birth?: string | null
          profile_photo_url?: string | null
          bio?: string | null
          location_lat?: number | null
          location_lng?: number | null
          role?: string
          is_available?: boolean
          dark_mode?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      verifications: {
        Row: {
          id: string
          user_id: string
          status: string
          id_type: string | null
          id_number: string | null
          id_front_url: string | null
          id_back_url: string | null
          police_clearance_ref: string | null
          police_clearance_date: string | null
          police_clearance_url: string | null
          rejection_reason: string | null
          submitted_at: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          status?: string
          id_type?: string | null
          id_number?: string | null
          id_front_url?: string | null
          id_back_url?: string | null
          police_clearance_ref?: string | null
          police_clearance_date?: string | null
          police_clearance_url?: string | null
          rejection_reason?: string | null
          submitted_at?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: string
          id_type?: string | null
          id_number?: string | null
          id_front_url?: string | null
          id_back_url?: string | null
          police_clearance_ref?: string | null
          police_clearance_date?: string | null
          police_clearance_url?: string | null
          rejection_reason?: string | null
          submitted_at?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          slug: string
          name: string
          icon_name: string
          bg_color: string
          icon_color: string
          sort_order: number
        }
        Insert: {
          id?: string
          slug: string
          name: string
          icon_name: string
          bg_color: string
          icon_color: string
          sort_order?: number
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          icon_name?: string
          bg_color?: string
          icon_color?: string
          sort_order?: number
        }
        Relationships: []
      }
      job_posts: {
        Row: {
          id: string
          customer_id: string
          title: string
          description: string
          address: string
          location_lat: number | null
          location_lng: number | null
          category_slug: string
          skills_needed: string[]
          pricing_type: string
          budget_max: number
          workers_needed: number
          scheduled_date: string
          estimated_hours: number | null
          start_time: string | null
          end_time: string | null
          what_is_included: string[]
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          title: string
          description: string
          address: string
          location_lat?: number | null
          location_lng?: number | null
          category_slug: string
          skills_needed?: string[]
          pricing_type: string
          budget_max: number
          workers_needed?: number
          scheduled_date: string
          estimated_hours?: number | null
          start_time?: string | null
          end_time?: string | null
          what_is_included?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          title?: string
          description?: string
          address?: string
          location_lat?: number | null
          location_lng?: number | null
          category_slug?: string
          skills_needed?: string[]
          pricing_type?: string
          budget_max?: number
          workers_needed?: number
          scheduled_date?: string
          estimated_hours?: number | null
          start_time?: string | null
          end_time?: string | null
          what_is_included?: string[]
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          job_post_id: string
          worker_id: string
          customer_id: string
          status: string
          worker_note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_post_id: string
          worker_id: string
          customer_id: string
          status?: string
          worker_note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_post_id?: string
          worker_id?: string
          customer_id?: string
          status?: string
          worker_note?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      chats: {
        Row: {
          id: string
          booking_id: string
          participant_1: string
          participant_2: string
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          participant_1: string
          participant_2: string
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          participant_1?: string
          participant_2?: string
          created_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          sender_id: string
          content: string
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          sender_id: string
          content: string
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          sender_id?: string
          content?: string
          read_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
      payout_details: {
        Row: {
          id: string
          user_id: string
          method: string
          account_name: string
          account_number: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          method: string
          account_name: string
          account_number: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          method?: string
          account_name?: string
          account_number?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          body: string
          type: string
          data: Record<string, unknown>
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          body: string
          type: string
          data?: Record<string, unknown>
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          body?: string
          type?: string
          data?: Record<string, unknown>
          read?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
