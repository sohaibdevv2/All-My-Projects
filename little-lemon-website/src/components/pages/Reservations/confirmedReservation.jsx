import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";

const ConfirmedReservation = () => {
  const location = useLocation();
  const { name, mail, date, time, numberOfGuests, occasion } = location.state || {};

  return (
    <div className="container confirmed-reservation">
      <FontAwesomeIcon icon={faCircleCheck} size="3x" />
      <h2>Your table has been reserved!</h2>
      <p>You'll receive a confirmation email with all the details.</p>
      <div className="reservation-summary">
        <h3>Reservation Details</h3>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {mail}</p>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Time:</strong> {time}</p>
        <p><strong>Number of Guests:</strong> {numberOfGuests}</p>
        <p><strong>Occasion:</strong> {occasion}</p>
      </div>
    </div>
  );
};

export default ConfirmedReservation;
