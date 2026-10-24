import React from "react";
import { Formik } from "formik";
import FormField from "./formField";
import emailjs from '@emailjs/browser';

// ReservationForm Component: Handles reservation form logic and submission.
const ReservationForm = ({ availableTimes, dispatchOnDateChange, submitData }) => {

  // Configuration:  Setting up initial values and constraints
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const minGuests = 1;
  const maxGuests = 10;
  const occasionOptions = ["Birthday", "Anniversary", "Engagement", "Other"];

  // Formik Setup:  Using Formik for form management (state, validation, submission)
  return (
    <Formik
      initialValues={{ // Initial form values
        name: "",
        mail: "",
        date: today,
        time: availableTimes[0], // First available time as default
        numberOfGuests: minGuests,
        occasion: occasionOptions[0], // First occasion as default
      }}

      // Validation Function:  Validates form inputs.  Returns an object of errors.
      validate={(values) => {
        const errors = {};

        if (!values.name) errors.name = "Please enter your name";
        if (!values.mail) errors.mail = "Please enter an email";
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.mail))
          errors.mail = "Invalid email address";
        if (!values.date) errors.date = "Please choose a valid date";
        if (!values.time) errors.time = "Please choose a valid time";
        if (!values.numberOfGuests || values.numberOfGuests < minGuests || values.numberOfGuests > maxGuests)
          errors.numberOfGuests = `Please enter a number between ${minGuests} and ${maxGuests}`;
        if (!values.occasion) errors.occasion = "Please choose a valid occasion";

        return errors;
      }}

      // Submission Function:  Handles form submission.
      onSubmit={(values, { setSubmitting }) => {
        // EmailJS Configuration:  Replace with your actual EmailJS credentials
        const service_id = 'service_i3vng1m';
        const template_id = 'template_ueghurd';
        const public_id = 'gbtOYXQ6SZQAOaHko';

        // Email Template Parameters:  Data to be sent in the email.
        const templateParams = {
          from_name: "Little Lemon", // Your restaurant name
          user_email: values.mail,
          to_name: values.name,
          message: `You have a reservation on ${values.date} at ${values.time} for ${values.numberOfGuests} guests.`,
        };

        // Send Email:  Using EmailJS to send the reservation confirmation email.
        emailjs.send(service_id, template_id, templateParams, public_id)
          .then((response) => {
            console.log("Email sent successfully:", response);
          })
          .catch((error) => {
            console.error("Error sending email:", error);
          })
          .finally(() => setSubmitting(false)); // Re-enable the submit button


        submitData(values); // Calls the parent component's submitData function, passing the form values.
      }}
    >
      {/* Formik Render Props: Accessing Formik's state and methods. */}
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        // Form:  The actual HTML form.
        <form onSubmit={handleSubmit}>

          {/* Name Field */}
          <FormField label="Name" htmlFor="reservation-name">
            <input
              type="text"
              name="name"
              id="reservation-name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
            {errors.name && touched.name && <div className="error">{errors.name}</div>}
          </FormField>

          {/* Email Field */}
          <FormField label="Email address" htmlFor="reservation-mail">
            <input
              type="email"
              name="mail"
              id="reservation-mail"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.mail}
            />
            {errors.mail && touched.mail && <div className="error">{errors.mail}</div>}
          </FormField>

          {/* Date Field */}
          <FormField label="Date" htmlFor="reservation-date">
            <input
              type="date"
              name="date"
              id="reservation-date"
              min={today}
              onChange={(e) => {
                handleChange(e); // Update Formik's state for the date
                dispatchOnDateChange(e.target.value); // Call the parent's function to update available times
              }}
              onBlur={handleBlur}
              value={values.date}
            />
            {errors.date && touched.date && <div className="error">{errors.date}</div>}
          </FormField>

          {/* Time Field */}
          <FormField label="Time" htmlFor="reservation-time">
            <select
              name="time"
              id="reservation-time"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.time}
            >
              {availableTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {errors.time && touched.time && <div className="error">{errors.time}</div>}
          </FormField>

          {/* Number of Guests Field */}
          <FormField label="Number of guests" htmlFor="reservation-number-guests">
            <input
              type="number"
              name="numberOfGuests"
              id="reservation-number-guests"
              min={minGuests}
              max={maxGuests}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.numberOfGuests}
            />
            {errors.numberOfGuests && touched.numberOfGuests && (
              <div className="error">{errors.numberOfGuests}</div>
            )}
          </FormField>

          {/* Occasion Field */}
          <FormField label="Occasion" htmlFor="reservation-occasion">
            <select
              name="occasion"
              id="reservation-occasion"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.occasion}
            >
              {occasionOptions.map((occasion) => (
                <option key={occasion} value={occasion}>
                  {occasion}
                </option>
              ))}
            </select>
            {errors.occasion && touched.occasion && <div className="error">{errors.occasion}</div>}
          </FormField>

          {/* Submit Button */}
          <button
            aria-label="On Click"
            className="button-primary"
            type="submit"
            disabled={isSubmitting} // Disable while submitting
          >
            Reserve now!
          </button>
        </form>
      )}
    </Formik>
  );
};

export default ReservationForm;