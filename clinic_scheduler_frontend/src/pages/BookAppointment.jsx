import React, { useEffect, useState } from "react";
import api from "../api/api";
import { getCurrentUser } from "../utils/auth";

export default function BookAppointment() {
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [message, setMessage] = useState("");
  const [loadingClinics, setLoadingClinics] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);

  const user = getCurrentUser();
  const userId = user?.id;

  // Load clinics
  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    setLoadingClinics(true);
    try {
      const res = await api.get("/clinics");
      setClinics(res.data);
    } catch (err) {
      console.error("Failed to fetch clinics", err);
    } finally {
      setLoadingClinics(false);
    }
  };

  // Load slots when clinic + date selected
  useEffect(() => {
    fetchSlotsForDate(selectedClinic, date);
    setSelectedSlot("");
  }, [selectedClinic, date]);

  const fetchSlotsForDate = async (clinicId, date) => {
    if (!clinicId || !date) return setSlots([]);
    setLoadingSlots(true);
    try {
      const res = await api.get(
        `/clinics/${clinicId}/availability?date=${date}`
      );
      setSlots(res.data.slots || []);
    } catch (err) {
      console.error("Failed to fetch slots", err);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Make booking request
  const book = async () => {
    setMessage("");
    setBooking(true);

    if (!userId) {
      setMessage("You must be logged in to book an appointment.");
      setBooking(false);
      return;
    }

    if (!selectedClinic || !date || !selectedSlot) {
      setMessage("Please select clinic, date, and slot.");
      setBooking(false);
      return;
    }

    try {
      const payload = {
        patientId: userId,
        clinicId: selectedClinic,
        date,
        timeSlot: selectedSlot,
      };

      await api.post("/appointments", payload);
      setMessage("✅ Appointment booked successfully!");
    } catch (err) {
      console.error("Booking error:", err);
      setMessage(err?.response?.data?.detail || "❌ Failed to book appointment.");
    } finally {
      setBooking(false);
    }
  };

  const clearSelection = () => {
    setSelectedClinic("");
    setDate("");
    setSelectedSlot("");
    setMessage("");
  };

  const selectedClinicDetails = clinics.find(
    (c) => c.id === selectedClinic
  );

  return (
    <div className="container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-header">
            <h1 className="hero-title">📅 Book an Appointment</h1>
            <h2 className="hero-subtitle">Schedule Your Visit with Ease</h2>
            <p className="hero-description">
              Select your preferred clinic, date, and time slot to book an appointment quickly and securely.
            </p>
          </div>

          <div className="services-section">
            <div className="service-cards" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

              {/* FORM SECTION */}
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
                        className="w-full max-w-xl mx-auto border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">-- Select Clinic --</option>
                        {clinics.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} — {c.address}
                          </option>
                        ))}
                      </select>
                    )}
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
                      className="w-full max-w-xl border border-gray-300 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    />
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

                  {/* Buttons */}
                  <div className="flex flex-col items-center gap-4">
                    <button
                      onClick={clearSelection}
                      className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium"
                    >
                      Clear Selection
                    </button>

                    <button
                      onClick={book}
                      disabled={booking}
                      className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all ${
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
                    <div className="text-gray-800 font-medium">
                      {date || "-"}
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="font-semibold flex items-center gap-2 mb-1">
                      <span>⏰</span> Time Slot
                    </div>
                    <div className="text-gray-800 font-medium">
                      {selectedSlot || "-"}
                    </div>
                  </div>
                </div>
              </div>
              {/* END SUMMARY */}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
