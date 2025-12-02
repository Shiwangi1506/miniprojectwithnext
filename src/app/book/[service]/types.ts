export interface Worker {
  _id: string;
  name: string;
  avatar?: string;
  description?: string;
  experience?: number;
  skills: string[];
  verified?: boolean;
  phone?: string;
  address?: string;
  location?: { city: string };
  price?: number;
  rating?: number;
  reviews?: number;
}
