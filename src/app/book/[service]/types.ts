export interface Worker {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experience: number;
  location: {
    city: string;
    state?: string;
    pincode?: string;
    coordinates?: {
      type: "Point";
      coordinates: [number, number];
    };
  };
  idProof?: string;
  certificate?: string;
  description?: string; // ✅ added this
  bio?: string; // optional short summary
  avatar?: string; // image URL
  rating?: number; // optional rating field
  reviews?: number; // optional
  topRated?: boolean;
  verified?: boolean;
  price?: number;
  availability?: string[];
  slots?: string[];
  createdAt?: string;
}
