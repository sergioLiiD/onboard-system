export type UserRole = 'admin' | 'managing_user' | 'regular_user' | 'invitee'

export interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  phone_number: string | null
  company_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Workspace {
  id: string
  name: string
  company_name: string
  owner_id: string
  settings: {
    language: string
    timezone: string
  }
  created_at: string
  updated_at: string
}

export interface Workflow {
  id: string
  workspace_id: string
  name: string
  description: string | null
  is_template: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface Step {
  id: string
  workflow_id: string
  title: string
  subtitle: string | null
  content: any
  order_number: number
  documents: Array<{
    name: string
    url: string
    type: string
    size: number
  }>
  video_urls: string[]
  tasks: Array<{
    id: string
    description: string
    completed: boolean
  }>
  quiz: {
    questions: Array<{
      id: string
      question: string
      options: string[]
      correct_option: number
    }>
  } | null
  created_at: string
  updated_at: string
}

export interface WorkflowAssignment {
  id: string
  workflow_id: string
  invitee_id: string
  status: 'pending' | 'in_progress' | 'completed'
  progress: {
    completed_steps: string[]
  }
  access_code: string
  expires_at: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  step_id: string
  workflow_assignment_id: string
  sender_id: string
  content: string
  created_at: string
}
