export type PipelineStage = 'New' | 'Contacted' | 'Interested' | 'Paid' | 'Lost';

export type Channel = 
  | 'WhatsApp' 
  | 'Facebook Messenger' 
  | 'Facebook comment' 
  | 'Website form' 
  | 'Phone call note';

export type ProgramInterest = 
  | '3-Day Bootcamp' 
  | 'AI Fellowship' 
  | 'Corporate Training' 
  | 'General Enquiry';

export type IntentCategory = 
  | 'LEAD' 
  | 'SUPPORT' 
  | 'SPAM' 
  | 'JOB_SEEKER';

export interface Enquiry {
  id: string;
  csvId?: number | null;
  channel: string;
  receivedAt: string | Date;
  senderName?: string | null;
  phone?: string | null;
  message: string;
  interest: string;
  status: PipelineStage | string;
  category: IntentCategory | string;
  detectedLang?: string | null;
  suggestedReply?: string | null;
  lastContactedAt?: string | Date | null;
  notes?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  isOverdue?: boolean;
}

export interface AIParsedResult {
  senderName: string;
  phone: string;
  channel: Channel | string;
  interest: ProgramInterest | string;
  category: IntentCategory;
  detectedLang: 'Banglish' | 'Bangla' | 'English';
  suggestedReply: string;
  summaryReasoning?: string;
}
