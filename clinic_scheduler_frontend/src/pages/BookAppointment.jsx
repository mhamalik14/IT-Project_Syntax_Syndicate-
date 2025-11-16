import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { getCurrentUser } from "../utils/auth";

export default function BookAppointment() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const userId = user?.id || user?.sub;

  // Provinces
  const provinces = [
    "KwaZulu-Natal",
    "Gauteng",
    "Western Cape",
    "Eastern Cape",
    "Free State",
    "Mpumalanga",
    "Limpopo",
    "North West",
    "Northern Cape",
  ];

  // State
  const [selectedProvince, setSelectedProvince] = useState("");
  const [clinics, setClinics] = useState([]);
  const [nearest, setNearest] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [loadingClinics, setLoadingClinics] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState("");

  const user = getCurrentUser();
  const userId = user?.id || user?.sub;

  useEffect(() => {
    if (!user || (user.role && user.role !== "patient")) {
      navigate("/unauthorized");
      return;
    }
    // Load clinics and rooms from the API (falls back to mock data if needed)
    fetchClinics();
    tryGeolocate();
  }, []);

  useEffect(() => {
    // Filter clinics when province changes
    if (selectedProvince) {
      const list = clinics.filter((c) => c.province === selectedProvince);
      setFilteredClinics(list);
      const nearestInProvince = list.find((c) => c.id === nearest);
      setSelectedClinic(nearestInProvince ? nearestInProvince.id : "");
    } else {
      setFilteredClinics([]);
      setSelectedClinic("");
    }
  }, [selectedProvince, clinics, nearest]);

  useEffect(() => {
    // Refresh slots when clinic/date changes
    fetchSlotsForDate(selectedClinic, formData.appointmentDate);
    // Load providers and narrow rooms to clinic if applicable
    if (selectedClinic) {
      fetchProvidersForClinic(selectedClinic);
      const clinicRooms = rooms.filter((r) => !r.clinic_id || r.clinic_id === selectedClinic);
      if (clinicRooms.length) setRooms(clinicRooms);
    }
    setSelectedSlot("");
  }, [selectedClinic, formData.appointmentDate]);

  // Mock clinics with 5–6 per province
  const bootstrapClinics = async () => {
    setLoadingClinics(true);
    try {
      const mockClinics = [
        // KwaZulu-Natal
        { id: "kzn-1", name: "Durban Central Clinic", location: "Durban CBD", province: "KwaZulu-Natal" },
        { id: "kzn-2", name: "Pietermaritzburg Family Health", location: "Pietermaritzburg", province: "KwaZulu-Natal" },
        { id: "kzn-3", name: "Umlazi Community Clinic", location: "Umlazi", province: "KwaZulu-Natal" },
        { id: "kzn-4", name: "Richards Bay Medical Hub", location: "Richards Bay", province: "KwaZulu-Natal" },
        { id: "kzn-5", name: "Ballito Coastal Clinic", location: "Ballito", province: "KwaZulu-Natal" },
        { id: "kzn-6", name: "Empangeni Health Point", location: "Empangeni", province: "KwaZulu-Natal" },

        // Gauteng
        { id: "gt-1", name: "Johannesburg City Clinic", location: "Johannesburg", province: "Gauteng" },
        { id: "gt-2", name: "Pretoria North Health", location: "Pretoria", province: "Gauteng" },
        { id: "gt-3", name: "Sandton Wellness Centre", location: "Sandton", province: "Gauteng" },
        { id: "gt-4", name: "Soweto Community Clinic", location: "Soweto", province: "Gauteng" },
        { id: "gt-5", name: "Midrand Family Clinic", location: "Midrand", province: "Gauteng" },
        { id: "gt-6", name: "Centurion Medical Hub", location: "Centurion", province: "Gauteng" },

        // Western Cape
        { id: "wc-1", name: "Cape Town Wellness Centre", location: "Cape Town", province: "Western Cape" },
        { id: "wc-2", name: "Stellenbosch Family Clinic", location: "Stellenbosch", province: "Western Cape" },
        { id: "wc-3", name: "Paarl Health Point", location: "Paarl", province: "Western Cape" },
        { id: "wc-4", name: "Mitchells Plain Clinic", location: "Mitchells Plain", province: "Western Cape" },
        { id: "wc-5", name: "George Regional Clinic", location: "George", province: "Western Cape" },
        { id: "wc-6", name: "Bellville Medical Hub", location: "Bellville", province: "Western Cape" },

        // Eastern Cape
        { id: "ec-1", name: "Gqeberha Medical Hub", location: "Gqeberha (Port Elizabeth)", province: "Eastern Cape" },
        { id: "ec-2", name: "East London Family Health", location: "East London", province: "Eastern Cape" },
        { id: "ec-3", name: "Mthatha Community Clinic", location: "Mthatha", province: "Eastern Cape" },
        { id: "ec-4", name: "Queenstown Wellness Centre", location: "Komani (Queenstown)", province: "Eastern Cape" },
        { id: "ec-5", name: "Makhanda Community Clinic", location: "Makhanda (Grahamstown)", province: "Eastern Cape" },
        { id: "ec-6", name: "Butterworth Health Point", location: "Butterworth", province: "Eastern Cape" },

        // Free State
        { id: "fs-1", name: "Bloemfontein Regional Clinic", location: "Bloemfontein", province: "Free State" },
        { id: "fs-2", name: "Welkom Community Clinic", location: "Welkom", province: "Free State" },
        { id: "fs-3", name: "Bethlehem Family Health", location: "Bethlehem", province: "Free State" },
        { id: "fs-4", name: "Kroonstad Medical Centre", location: "Kroonstad", province: "Free State" },
        { id: "fs-5", name: "Harrismith Clinic", location: "Harrismith", province: "Free State" },
        { id: "fs-6", name: "Parys Health Point", location: "Parys", province: "Free State" },

        // Mpumalanga
        { id: "mp-1", name: "Mbombela Health Point", location: "Mbombela (Nelspruit)", province: "Mpumalanga" },
        { id: "mp-2", name: "Emalahleni Wellness Centre", location: "Emalahleni (Witbank)", province: "Mpumalanga" },
        { id: "mp-3", name: "Secunda Medical Hub", location: "Secunda", province: "Mpumalanga" },
        { id: "mp-4", name: "Middelburg Family Clinic", location: "Middelburg", province: "Mpumalanga" },
        { id: "mp-5", name: "Bushbuckridge Community Clinic", location: "Bushbuckridge", province: "Mpumalanga" },
        { id: "mp-6", name: "Sabie Clinic", location: "Sabie", province: "Mpumalanga" },

        // Limpopo
        { id: "lp-1", name: "Polokwane Community Clinic", location: "Polokwane", province: "Limpopo" },
        { id: "lp-2", name: "Thohoyandou Wellness Centre", location: "Thohoyandou", province: "Limpopo" },
        { id: "lp-3", name: "Mokopane Family Health", location: "Mokopane", province: "Limpopo" },
        { id: "lp-4", name: "Tzaneen Medical Centre", location: "Tzaneen", province: "Limpopo" },
        { id: "lp-5", name: "Makhado Regional Clinic", location: "Louis Trichardt (Makhado)", province: "Limpopo" },
        { id: "lp-6", name: "Giyani Health Point", location: "Giyani", province: "Limpopo" },

        // North West
        { id: "nw-1", name: "Rustenburg Wellness Centre", location: "Rustenburg", province: "North West" },
        { id: "nw-2", name: "Klerksdorp Medical Hub", location: "Klerksdorp", province: "North West" },
        { id: "nw-3", name: "Mahikeng Regional Clinic", location: "Mahikeng (Mafikeng)", province: "North West" },
        { id: "nw-4", name: "Potchefstroom Family Health", location: "Potchefstroom", province: "North West" },
        { id: "nw-5", name: "Brits Community Clinic", location: "Brits", province: "North West" },
        { id: "nw-6", name: "Zeerust Clinic", location: "Zeerust", province: "North West" },

        // Northern Cape
        { id: "nc-1", name: "Kimberley Medical Hub", location: "Kimberley", province: "Northern Cape" },
        { id: "nc-2", name: "Upington Wellness Centre", location: "Upington", province: "Northern Cape" },
        { id: "nc-3", name: "Springbok Regional Clinic", location: "Springbok", province: "Northern Cape" },
        { id: "nc-4", name: "Kuruman Family Health", location: "Kuruman", province: "Northern Cape" },
        { id: "nc-5", name: "De Aar Clinic", location: "De Aar", province: "Northern Cape" },
        { id: "nc-6", name: "Kathu Health Point", location: "Kathu", province: "Northern Cape" },
      ];
      setClinics(mockClinics);
    } catch (err) {
      console.error("Failed to bootstrap clinics", err);
    } finally {
      setLoadingClinics(false);
    }
  };

  // Fetch clinics from backend (fallbacks to mock data)
  const fetchClinics = async () => {
    setLoadingClinics(true);
    try {
      const res = await api.get("/clinics/");
      if (Array.isArray(res.data) && res.data.length > 0) {
        setClinics(res.data);
      } else {
        await bootstrapClinics();
      }
    } catch (err) {
      console.warn("fetchClinics failed, using mock clinics", err);
      await bootstrapClinics();
    } finally {
      setLoadingClinics(false);
    }
  };

  const tryGeolocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const res = await api.get("/clinics");
        const list = res.data || [];
        let min = Number.POSITIVE_INFINITY;
        let nearestId = null;

        list.forEach((c) => {
          if (c.lat != null && c.lng != null) {
            const d = (c.lat - latitude) ** 2 + (c.lng - longitude) ** 2;
            if (d < min) {
              min = d;
              nearestId = c._id || c.id;
            }
          }
        });

        setNearest(nearestId);
        if (nearestId) setSelectedClinic(nearestId);
      },
      (err) => console.warn("Geolocation failed or denied", err),
      { timeout: 8000 }
    );
  };

  useEffect(() => {
    fetchSlotsForDate(selectedClinic, date);
    setSelectedSlot("");
  }, [selectedClinic, date]);

  const fetchSlotsForDate = async (clinicId, date) => {
    if (!clinicId || !date) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    try {
      const res = await api.get(`/clinics/${clinicId}/availability?date=${date}`);
      const apiSlots = res.data?.slots || [];
      // Fallback slots if none returned
      const fallback = [
        "08:00 - 08:30",
        "08:30 - 09:00",
        "09:00 - 09:30",
        "09:30 - 10:00",
        "10:00 - 10:30",
        "10:30 - 11:00",
        "11:00 - 11:30",
        "11:30 - 12:00",
        "13:00 - 13:30",
        "13:30 - 14:00",
        "14:00 - 14:30",
        "14:30 - 15:00",
        "15:00 - 15:30",
      ];
      setSlots(apiSlots.length ? apiSlots : fallback);
    } catch (err) {
      console.error("Failed to fetch slots", err);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!selectedProvince) newErrors.province = "Choose a province.";
    if (!selectedClinic) newErrors.clinic = "Choose a clinic.";
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.idNumber.trim()) newErrors.idNumber = "ID or Medical Aid number is required.";
    if (!formData.email.includes("@")) newErrors.email = "Valid email required.";
    if (!formData.phone.match(/^\d{10}$/)) newErrors.phone = "Enter a 10-digit phone number.";
    if (!formData.serviceReason) newErrors.serviceReason = "Select a service reason.";
    if (!formData.appointmentDate) newErrors.appointmentDate = "Choose a date.";
    if (!selectedSlot) newErrors.timeSlot = "Select a time slot.";
    if (!userId) newErrors.auth = "You must be logged in to book an appointment.";
    return newErrors;
  };

  // Handlers
  const setField = (name, value) => setFormData((prev) => ({ ...prev, [name]: value }));

  // Make booking request
  const book = async () => {
    setMessage("");
    setBooking(true);

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setBooking(false);
      return;
    }

    try {
      // parse selectedSlot format like "08:00 - 08:30"
      let start = null;
      let end = null;
      if (selectedSlot && selectedSlot.includes("-")) {
        const parts = selectedSlot.split("-").map((s) => s.trim());
        start = parts[0];
        end = parts[1];
      }

      const payload = {
        clinic_id: selectedClinic,
        room_id: selectedRoom || null,
        patient_id: userId,
        provider_id: selectedProvider || null,
        start_time: start ? `${formData.appointmentDate}T${start}` : null,
        end_time: end ? `${formData.appointmentDate}T${end}` : null,
        full_name: formData.fullName,
        id_type: formData.idType,
        id_number: formData.idNumber,
        email: formData.email,
        phone: formData.phone,
        service_reason: formData.serviceReason,
        notes: formData.notes,
      };

      const res = await api.post("/appointments/", payload);
      setMessage("✅ Appointment booked successfully!");
      setErrors({});
      return res.data;
    } catch (err) {
      console.error("Booking error:", err);
      setMessage(err?.response?.data?.detail || "❌ Failed to book appointment.");
    } finally {
      setBooking(false);
    }
  };

  const clearSelection = () => {
    setSelectedProvince("");
    setFilteredClinics([]);
    setSelectedClinic("");
    setSelectedSlot("");
    setFormData({
      fullName: "",
      idType: "sa_id",
      idNumber: "",
      email: "",
      phone: "",
      serviceReason: "",
      appointmentDate: "",
      notes: "",
    });
    setMessage("");
    setErrors({});
    setSlots([]);
  };

  const selectedClinicDetails = clinics.find(
    (c) => (c._id || c.id) === selectedClinic
  );

  return (
    <div className="container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-header">
            <h1 className="hero-title">📅 Book an Appointment</h1>
            <h2 className="hero-subtitle">Schedule Your Visit with Ease</h2>
            <p className="hero-description">
              Select your province and clinic, enter your details, choose date and time slot, then book securely.
            </p>
          </div>

          <div className="services-section">
            <div className="service-cards" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* FORM SECTION (TOP - BIGGER) */}
              <div className="service-card" style={{ flex: 2 }}>
                <div className="service-icon">📝</div>
                <h4 className="service-title">Appointment Details</h4>
                <div className="flex flex-col gap-4">
                  {/* Clinic Select */}
                  <div className="w-full flex flex-col items-center text-center">
                    <label className="block text-gray-700 font-semibold mb-3 text-lg flex items-center justify-center gap-2">
                      <span className="text-xl">🏥</span> Choose Clinic
                    </label>

                    {loadingClinics ? (
                      <div className="w-full max-w-md mx-auto border border-gray-300 rounded-lg p-3 bg-gray-50 animate-pulse">
                        Loading clinics...
                      </div>
                    ) : (
                      <select
                        value={selectedClinic}
                        onChange={(e) => setSelectedClinic(e.target.value)}
                        className="w-full max-w-xl mx-auto border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-200"
                        aria-label="Select a clinic"
                      >
                        <option value="">-- Select Clinic --</option>
                        {clinics.map((c) => (
                          <option key={c._id || c.id} value={c._id || c.id}>
                            {c.name} {nearest === (c._id || c.id) ? "(Nearest)" : ""} -{" "}
                            {c.location}
                          </option>
                        ))}
                      </select>
                    )}
                    {errors.clinic && <div className="text-red-600 mt-2">{errors.clinic}</div>}
                  </div>

                  {/* Provider Select (optional) */}
                  <div className="w-full flex flex-col items-center text-center">
                    <label className="block text-gray-700 font-semibold mb-3 text-lg flex items-center justify-center gap-2">
                      <span className="text-xl">👩‍⚕️</span> Choose Provider (optional)
                    </label>
                    <select
                      value={selectedProvider}
                      onChange={(e) => setSelectedProvider(e.target.value)}
                      disabled={providers.length === 0}
                      className="w-full max-w-xl mx-auto border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-200 disabled:bg-gray-100 disabled:text-gray-400"
                      aria-label="Select a provider"
                    >
                      <option value="">-- Any provider --</option>
                      {providers.map((p) => (
                        <option key={p.id || p._id} value={p.id || p._id}>{p.name || p.full_name || p.displayName}</option>
                      ))}
                    </select>
                  </div>

                  {/* Room Select (optional) */}
                  <div className="w-full flex flex-col items-center text-center">
                    <label className="block text-gray-700 font-semibold mb-3 text-lg flex items-center justify-center gap-2">
                      <span className="text-xl">🚪</span> Choose Room (optional)
                    </label>
                    <select
                      value={selectedRoom}
                      onChange={(e) => setSelectedRoom(e.target.value)}
                      disabled={rooms.length === 0}
                      className="w-full max-w-xl mx-auto border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition duration-200 disabled:bg-gray-100 disabled:text-gray-400"
                      aria-label="Select a room"
                    >
                      <option value="">-- Any room --</option>
                      {rooms.map((r) => (
                        <option key={r.id || r._id} value={r.id || r._id}>{r.name || r.number || r.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Patient details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="font-semibold text-gray-700 mb-1">Full Name</label>
                      <input
                        name="fullName"
                        value={formData.fullName}
                        onChange={(e) => setField("fullName", e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., Nompilo Dlamini"
                      />
                      {errors.fullName && <div className="text-red-600 mt-1">{errors.fullName}</div>}
                    </div>

                    <div className="flex flex-col">
                      <label className="font-semibold text-gray-700 mb-1">ID Type</label>
                      <select
                        name="idType"
                        value={formData.idType}
                        onChange={(e) => setField("idType", e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="sa_id">South African ID</option>
                        <option value="passport">Passport / Permit</option>
                        <option value="medical_aid">Medical Aid Number</option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="font-semibold text-gray-700 mb-1">ID / Passport / Medical Aid</label>
                      <input
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={(e) => setField("idNumber", e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., 9901010011082"
                      />
                      {errors.idNumber && <div className="text-red-600 mt-1">{errors.idNumber}</div>}
                    </div>

                    <div className="flex flex-col">
                      <label className="font-semibold text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setField("email", e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="e.g., you@example.com"
                      />
                      {errors.email && <div className="text-red-600 mt-1">{errors.email}</div>}
                    </div>

                    <div className="flex flex-col">
                      <label className="font-semibold text-gray-700 mb-1">Cellphone Number</label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="10 digits, e.g., 0821234567"
                      />
                      {errors.phone && <div className="text-red-600 mt-1">{errors.phone}</div>}
                    </div>

                    <div className="flex flex-col">
                      <label className="font-semibold text-gray-700 mb-1">Service Reason</label>
                      <select
                        name="serviceReason"
                        value={formData.serviceReason}
                        onChange={(e) => setField("serviceReason", e.target.value)}
                        className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">-- Select service --</option>
                        <option value="dental">Dental Check-up</option>
                        <option value="immunization">Child Immunization</option>
                        <option value="medication">Chronic Medication Refill</option>
                        <option value="lab">Blood Test / Lab</option>
                        <option value="consultation">General Consultation</option>
                        <option value="vaccination">Vaccination</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.serviceReason && <div className="text-red-600 mt-1">{errors.serviceReason}</div>}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="w-full flex flex-col items-center text-center">
                    <label className="block text-gray-700 font-semibold mb-3 flex items-center justify-center gap-2">
                      <span className="text-xl">📆</span> Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full max-w-xl border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-800 font-medium transition duration-200 shadow-sm"
                      aria-label="Select appointment date"
                    />
                    {errors.appointmentDate && <div className="text-red-600 mt-2">{errors.appointmentDate}</div>}
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 flex items-center gap-2">
                      <span className="text-lg">⏰</span> Available Slots
                    </label>

                    {loadingSlots ? (
                      <div className="grid grid-cols-2 gap-3">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="p-3 rounded-lg border bg-gray-50 animate-pulse"></div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {slots.length === 0 ? (
                          <div className="text-gray-500 col-span-full text-center py-4">
                            No slots available for selected date.
                          </div>
                        ) : (
                          slots.map((slot) => (
                            <button
                              key={slot}
                              onClick={() => setSelectedSlot(slot)}
                              className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                                selectedSlot === slot
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
                              }`}
                            >
                              {selectedSlot === slot && "✓ "}
                              {slot}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                    {errors.timeSlot && <div className="text-red-600 mt-2">{errors.timeSlot}</div>}
                  </div>

                  {/* Notes */}
                  <div className="flex flex-col">
                    <label className="font-semibold text-gray-700 mb-1">Additional Notes (optional)</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={(e) => setField("notes", e.target.value)}
                      className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Any extra information you'd like to share"
                    />
                  </div>

                  {/* Message */}
                  {message && (
                    <div
                      className={`p-4 rounded-xl font-semibold shadow-md ${
                        message.startsWith("✅")
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {message}
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={clearSelection}
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition duration-200"
                    >
                      Clear Selection
                    </button>

                    <button
                      onClick={book}
                      disabled={booking}
                      className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${
                        booking
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                    >
                      {booking ? "Booking..." : "Confirm Booking"}
                    </button>
                  </div>

                </div>
              </div>

              {/* SUMMARY SECTION */}
              <div className="service-card" style={{ flex: 1 }}>
                <div className="service-icon">📋</div>
                <h4 className="service-title">Booking Summary</h4>

                <div className="space-y-3 text-gray-700">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="font-semibold text-gray-600 flex items-center gap-2 mb-1">
                      <span>🗺️</span> Province
                    </div>
                    <div className="text-gray-800 font-medium">{selectedProvince || "-"}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="font-semibold flex items-center gap-2 mb-1">
                      <span>🏥</span> Clinic
                    </div>
                    <div className="text-gray-800 font-medium">
                      {selectedClinicDetails?.name || "Not selected"}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="font-semibold flex items-center gap-2 mb-1">
                      <span>📍</span> Address
                    </div>
                    <div className="text-gray-800 font-medium">
                      {selectedClinicDetails?.address || "-"}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="font-semibold flex items-center gap-2 mb-1">
                      <span>📅</span> Date
                    </div>
                    <div className="text-gray-800 font-medium">{date || "-"}</div>
                  </div>

                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="font-semibold flex items-center gap-2 mb-1">
                      <span>⏰</span> Time Slot
                    </div>
                    <div className="text-gray-800 font-medium">
                      {selectedSlot || "-"}
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="font-semibold text-gray-600 flex items-center gap-2 mb-1">
                      <span>📝</span> Notes
                    </div>
                    <div className="text-gray-800 font-medium">{formData.notes || "-"}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


            