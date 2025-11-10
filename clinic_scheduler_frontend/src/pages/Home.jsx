import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-header">
            <h1 className="hero-title">🏥 Clinic Appointment Scheduling System</h1>
            <h2 className="hero-subtitle">Welcome to the Clinic Appointment Scheduling System</h2>
            <p className="hero-description">
              Streamlining healthcare management by reducing scheduling conflicts and minimizing patient wait times.
            </p>
          </div>

          <div className="purpose-section">
            <h3 className="section-title">Our Purpose</h3>
            <p className="purpose-text">
              The Clinic Appointment Scheduling System is designed to improve clinic efficiency and enhance the overall patient experience.
              It empowers patients, doctors, and administrators through a single, easy-to-use digital platform that ensures smooth scheduling and better healthcare coordination.
            </p>
          </div>

          <div className="services-section">
            <h3 className="section-title">Who We Serve</h3>

            <div className="service-cards">
              <div className="service-card">
                <div className="service-icon">👩‍⚕️</div>
                <h4 className="service-title">Patients</h4>
                <ul className="service-list">
                  <li>Book, reschedule, or cancel appointments effortlessly.</li>
                  <li>View upcoming and past visits.</li>
                  <li>Receive timely appointment notifications and reminders.</li>
                </ul>
              </div>

              <div className="service-card">
                <div className="service-icon">🧑‍⚕️</div>
                <h4 className="service-title">Doctors</h4>
                <ul className="service-list">
                  <li>Manage daily schedules and patient appointments efficiently.</li>
                  <li>Access and update patient information securely.</li>
                  <li>Minimize scheduling conflicts and maximize time management.</li>
                </ul>
              </div>

              <div className="service-card">
                <div className="service-icon">🧑‍💼</div>
                <h4 className="service-title">Administrators</h4>
                <ul className="service-list">
                  <li>Oversee clinic operations and user activity.</li>
                  <li>Manage all patient and doctor profiles.</li>
                  <li>Generate detailed reports for improved decision-making.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="commitment-section">
            <h3 className="section-title">💬 Our Commitment</h3>
            <blockquote className="commitment-quote">
              "Empowering healthcare through innovation — one appointment at a time."
            </blockquote>
          </div>

          <div className="cta-section">
            <h3 className="section-title">🚀 Get Started</h3>
            <p className="cta-text">
              Take the next step toward a more efficient healthcare experience.
              Click below to register and start using the system today.
            </p>
            <Link to="/register" className="cta-button">Get Started</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
