export type JobCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
};

export type Job = {
  id: string;
  title: string;
  status?: string | null;
  category_id: string | null;
  country: string | null;
  salary_range: string | null;
  requirements: string | null;
  is_active: boolean;
  created_at: string;
};

export type Destination = {
  id: string;
  name: string;
  slug: string;
  highlights: string | null;
  image_url: string | null;
  created_at?: string;
};

export type VisaInquiry = {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  visa_type: string;
  destination: string | null;
  message: string | null;
  status: "new" | "in_review" | "resolved" | string;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  country: string | null;
  phone: string | null;
  is_admin: boolean;
  created_at: string;
};
