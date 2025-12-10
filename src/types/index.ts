export interface Staff {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface Participant {
  id: string;
  staff_id: string;
  fio: string;
  phone: string;
  position?: string;
  created_at: string;
}

export interface MessageTemplate {
  id: string;
  staff_id: string;
  template_text: string;
  created_at: string;
}

export type NotificationStatus = 'scheduled' | 'pending' | 'sent' | 'delivered' | 'failed' | 'error';

export interface Notification {
  id: string;
  staff_id: string;
  participant_id?: string;
  message_text: string;
  status: NotificationStatus;
  scheduled_time?: string;
  sent_at?: string;
  error_message?: string;
  external_id?: string;
  api_response?: any;
  created_at: string;
}

export interface EventLog {
  id: string;
  staff_id?: string;
  participant_id?: string;
  notification_id?: string;
  action_type: string;
  details?: any;
  created_at: string;
}
