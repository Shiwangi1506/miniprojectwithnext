"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, title: "Basic Details" },
  { id: 2, title: "Qualifications & Skills" },
  { id: 3, title: "Verification & Documents" },
];

const serviceOptions = [
  "electrician",
  "plumber",
  "carpenter",
  "painter",
  "dancer",
  "house-cleaning",
  "maids",
  "ac-repairers",
  "fridge-repairers",
  "cooks",
  "beauticians",
  "tailors",
  "ro-technicians",
  "tutors",
  "decorators",
];

const RegisterProfessional = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    skills: "",
    experience: "",
    price: "",
    avatar: null as File | null,
    idProof: null as File | null,
    certificate: null as File | null,
    description: "",
  });

  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Update progress bar
  useEffect(() => {
    const totalFields = Object.keys(formData).length;
    let filled = 0;
    Object.values(formData).forEach((value) => {
      if (value) filled++;
    });
    setProgress(Math.floor((filled / totalFields) * 100));
  }, [formData]);

  // Redirect if user is already a worker or not logged in
  useEffect(() => {
    if (status === "loading") return; // Wait until session is loaded

    if (!session?.user) {
      router.push("/login"); // Redirect unauthenticated users
      return;
    }

    setFormData((prev) => ({
      ...prev,
      fullName: session.user?.name || "",
      email: session.user?.email || "",
    }));
  }, [session, status, router]);

  // Handle text/textarea input
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  // Validate each step
  const validateStep = () => {
    const validationErrors: string[] = [];
    if (step === 1) {
      if (!formData.fullName.trim())
        validationErrors.push("Full Name is required.");
      if (!formData.email.trim()) validationErrors.push("Email is required.");
      if (!formData.phone.trim()) validationErrors.push("Phone is required.");
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(formData.phone))
        validationErrors.push("Invalid phone number format.");
    } else if (step === 2) {
      if (!formData.address.trim())
        validationErrors.push("Address is required.");
      if (!formData.city.trim()) validationErrors.push("City is required.");
      if (!formData.state.trim()) validationErrors.push("State is required.");
      if (!formData.pincode.trim())
        validationErrors.push("Pincode is required.");
      if (!formData.skills.trim())
        validationErrors.push("Skills are required.");
      if (!formData.experience.trim())
        validationErrors.push("Experience is required.");
      else if (isNaN(Number(formData.experience)))
        validationErrors.push("Experience must be a number (in years).");
      if (!formData.price.trim()) validationErrors.push("Price is required.");
      else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0)
        validationErrors.push("Price must be a positive number.");
    } else if (step === 3) {
      if (!formData.idProof) validationErrors.push("ID Proof is required.");
    }
    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);

    if (!validateStep()) return;

    // ✅ Add a check to ensure session and user exist before submission
    if (!session?.user) {
      alert("You must be logged in to register. Redirecting to login page.");
      router.push("/login");
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("city", formData.city);
    formDataToSend.append("state", formData.state);
    formDataToSend.append("pincode", formData.pincode);
    formDataToSend.append("skills", formData.skills);
    formDataToSend.append("experience", formData.experience);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("description", formData.description);
    // Add the user ID from the session
    formDataToSend.append("userId", (session.user as { id: string }).id);

    if (formData.avatar) formDataToSend.append("avatar", formData.avatar);
    if (formData.idProof) formDataToSend.append("idProof", formData.idProof);
    if (formData.certificate)
      formDataToSend.append("certificate", formData.certificate);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: formDataToSend, // ✅ No headers needed
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setShowSuccessPopup(true);
      setTimeout(() => {
        router.push("/worker-dashboard");
      }, 3000); // Redirect after 3 seconds

      setStep(1);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        skills: "",
        experience: "",
        price: "",
        avatar: null,
        idProof: null,
        certificate: null,
        description: "",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An unknown error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-4 py-8 bg-gray-900">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white p-8 rounded-lg shadow-2xl text-center max-w-sm w-full">
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Registration Successful!
            </h2>
            <p className="text-gray-700">
              You will be redirected to your dashboard shortly.
            </p>
          </div>
        </div>
      )}
      <form
        className="relative z-10 bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8 space-y-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Register as a Professional
        </h1>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-[#e61717] h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-600 text-sm text-center">
          {progress}% Completed
        </p>

        {/* Step indicators */}
        <div className="flex justify-between mb-6 relative">
          {steps.map((s, idx) => {
            const isCompleted = s.id < step;
            const isCurrent = s.id === step;
            return (
              <div
                key={s.id}
                className="flex-1 flex flex-col items-center relative"
              >
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-green-500 border-green-500 text-white"
                      : isCurrent
                      ? "bg-white border-[#e61717] text-[#e61717]"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                >
                  {isCompleted ? "✓" : s.id}
                </div>
                <span className="text-xs mt-1 text-center">{s.title}</span>
                {idx < steps.length - 1 && (
                  <div className="absolute top-4 right-0 w-full h-0.5 bg-gray-300 -z-10"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Error messages */}
        {errors.length > 0 && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg space-y-1">
            <ul>
              {errors.map((err, idx) => (
                <li key={idx}>• {err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#e61717]"
              value={formData.fullName}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#e61717]"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#e61717]"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#e61717]"
              value={formData.address}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#e61717]"
                value={formData.city}
                onChange={handleChange}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#e61717]"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#e61717]"
              value={formData.pincode}
              onChange={handleChange}
            />
            <select
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#e61717]"
            >
              <option value="" disabled>
                Select a service
              </option>
              {serviceOptions.map((service) => (
                <option key={service} value={service}>
                  {service.charAt(0).toUpperCase() +
                    service.slice(1).replace("-", " ")}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="experience"
              placeholder="Experience (in years)"
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#e61717]"
              value={formData.experience}
              onChange={handleChange}
            />
            <input
              type="number"
              name="price"
              placeholder="Price per service (e.g., 500)"
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#e61717]"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <label className="flex flex-col p-3 border rounded-lg cursor-pointer hover:bg-gray-100 transition">
              Upload ID Proof *
              <input
                type="file"
                name="idProof"
                className="hidden"
                onChange={handleFileChange}
              />
              {formData.idProof && <span>{formData.idProof.name}</span>}
            </label>
            <label className="flex flex-col p-3 border rounded-lg cursor-pointer hover:bg-gray-100 transition">
              Upload Avatar (Optional)
              <input
                type="file"
                name="avatar"
                className="hidden"
                onChange={handleFileChange}
              />
              {formData.avatar && <span>{formData.avatar.name}</span>}
            </label>
            <label className="flex flex-col p-3 border rounded-lg cursor-pointer hover:bg-gray-100 transition">
              Upload Certificate (Optional)
              <input
                type="file"
                name="certificate"
                className="hidden"
                onChange={handleFileChange}
              />
              {formData.certificate && <span>{formData.certificate.name}</span>}
            </label>
            <textarea
              name="description"
              placeholder="Brief description about yourself"
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#e61717]"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-4">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Back
            </button>
          )}
          {step < steps.length && (
            <button
              type="button"
              onClick={handleNext}
              className="ml-auto bg-[#e61717] text-white px-6 py-2 rounded-lg hover:bg-black transition"
            >
              Next
            </button>
          )}
          {step === steps.length && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-auto bg-[#e61717] text-white px-6 py-2 rounded-lg hover:bg-black transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegisterProfessional;
