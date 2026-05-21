export interface Customer {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  city: string | null;
  district: string | null;
  street_address: string | null;
  building: string | null;
  landmarks: string | null;
  whatsapp_opted_in: boolean;
  total_orders: number;
  total_spent_sar: number;
  is_blacklisted: boolean;
  blacklist_reason: string | null;
  created_at: string;
}

export interface CustomerInput {
  phone: string;
  name: string;
  email?: string;
  city: string;
  district?: string;
  street_address: string;
  building?: string;
  landmarks?: string;
}
