
function BookingInfo() {
  return (
    <div className="booking-info">
      <h2>Que‑Quick Reserve — Patient Booking</h2>
      <p>Only registered patients can book. Non‑registered users will be redirected to the registration portal.</p>

      <h3>Booking Options</h3>
      <ul>
        <li>Individual Patient</li>
        <li>Parent/Guardian</li>
        <li>Healthcare Representative</li>
        <li>Corporate Client</li>
      </ul>

      <h3>Required Info</h3>
      <ul>
        <li>South African ID / Passport / Medical Aid Number</li>
        <li>Full Name</li>
        <li>Email & Cellphone Number</li>
      </ul>

      <h3>Service Reasons</h3>
      <ul>
        <li>Dental Check-up</li>
        <li>Child Immunization</li>
        <li>Chronic Medication Refill</li>
        <li>Blood Test / Lab</li>
        <li>General Consultation</li>
        <li>Vaccination</li>
        <li>Other</li>
      </ul>

      <h3>Appointment Rules</h3>
      <p>Earliest: 48 hours from now. Max: 60 days ahead.</p>
      <p>Only one slot per booking. No recurring bookings.</p>

      <h3>SMS Booking Format</h3>
      <p>Send SMS to 47277: <strong>Booking [space] PatientID/Passport/MedicalAidNumber</strong></p>

      <h3>Languages Supported</h3>
      <p>IsiZulu, Sesotho, Afrikaans, Sepedi, Xitsonga</p>

      <h3>Need to Cancel?</h3>
      <p>Open the cancellation form, enter your details, and click the delete icon next to your appointment.</p>
    </div>
  );
}

export default BookingInfo;

