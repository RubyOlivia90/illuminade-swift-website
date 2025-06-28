import React, { useState } from 'react';

// IMPORTANT: Replace with your actual Strapi API URL (e.g., 'http://localhost:1337')
const STRAPI_API_URL = 'http://localhost:1337'; 

const Contact = () => {
  // State to hold form input values
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    message: '' 
  });
  // State to manage submission status: null, 'submitting', 'success', 'error'
  const [submissionStatus, setSubmissionStatus] = useState(null); 
  // State to hold any error message for display
  const [errorMessage, setErrorMessage] = useState('');

  // Handles changes to input fields and updates formData state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission (page reload)
    setSubmissionStatus('submitting');
    setErrorMessage(''); // Clear previous error messages

    try {
      // Define the endpoint for your custom Strapi email sending API
      // You will create this endpoint in your Strapi backend (see instructions below)
      const emailEndpoint = `${STRAPI_API_URL}/api/email/send`; 
      console.log('Attempting to send email to:', emailEndpoint, 'with data:', formData);

      const response = await fetch(emailEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Send the form data as JSON
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setFormData({ name: '', email: '', message: '' }); // Clear form fields on success
        console.log('Email sent successfully!');
      } else {
        const errorData = await response.json(); // Try to parse error message from Strapi
        const msg = errorData.message || 'Unknown error occurred.';
        console.error('Email send failed:', response.status, errorData);
        setSubmissionStatus('error');
        setErrorMessage(`Failed to send message: ${msg}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionStatus('error');
      setErrorMessage(`Failed to send message: ${error.message || 'Network error.'}. Please check your connection.`);
    }
  };

  return (
    <div className="contact-page-container">
      <h2 className="contact-title">Contact Me</h2>
      <form className="contact-form" onSubmit={handleSubmit}> {/* Attach the handleSubmit function */}
        <label htmlFor="name" className="form-label">Name</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          className="form-input" 
          required 
          value={formData.name} // Controlled component: input value tied to state
          onChange={handleChange} // Update state on change
        />

        <label htmlFor="email" className="form-label">Email</label>
        <input 
          type="email" 
          id="email" 
          name="email" 
          className="form-input" 
          required 
          value={formData.email} // Controlled component
          onChange={handleChange} // Update state on change
        />

        <label htmlFor="message" className="form-label">Message</label>
        <textarea 
          id="message" 
          name="message" 
          rows="5" 
          className="form-textarea" 
          required 
          value={formData.message} // Controlled component
          onChange={handleChange} // Update state on change
        ></textarea>

        <button 
          type="submit" 
          className="form-submit-button" 
          disabled={submissionStatus === 'submitting'} // Disable button during submission
        >
          {submissionStatus === 'submitting' ? 'Sending...' : 'Send Message'}
        </button>

        {/* Display submission status messages */}
        {submissionStatus === 'success' && 
          <p className="submission-message success">Your message has been sent successfully!</p>
        }
        {submissionStatus === 'error' && 
          <p className="submission-message error">Error: {errorMessage}</p>
        }
      </form>

      {/* Internal CSS for the Contact component */}
      <style>
        {`
          .contact-page-container {
            max-width: 600px; /* Adjust max-width as needed */
            margin: 0 auto;
            padding: 2rem;
            padding-top: 8rem; /* Enough padding to clear a potential fixed header */
            font-family: 'Helvetica Neue', sans-serif;
            color: #f0f0f0; /* Light text color for readability against dark background */
          }

          .contact-title {
            font-family: 'Cormorant Garamond', serif; /* Matching your heading font */
            font-size: 2.5rem; /* Adjust as needed */
            font-weight: bold;
            text-align: center; /* Centering the title */
            margin-bottom: 2rem;
            color: #f0f0f0; /* Consistent heading color */
          }

          .contact-form {
            display: flex;
            flex-direction: column;
            gap: 1rem; /* Spacing between form elements */
            background-color: rgba(255, 255, 255, 0.9); /* Slightly transparent white background for the form */
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }

          .form-label {
            font-size: 1rem;
            font-weight: 600;
            color: #333; /* Darker text for labels inside the light form background */
            margin-bottom: 0.25rem;
          }

          .form-input,
          .form-textarea {
            padding: 0.75rem;
            font-size: 1rem;
            width: 100%;
            border: 1px solid #ccc;
            border-radius: 8px;
            box-sizing: border-box; /* Include padding and border in the element's total width and height */
            color: #333;
            background-color: #f9f9f9;
            transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          }

          .form-input:focus,
          .form-textarea:focus {
            border-color: #a8e6cf; /* Highlight on focus */
            box-shadow: 0 0 0 3px rgba(168, 230, 207, 0.5); /* Soft glow on focus */
            outline: none;
          }

          .form-textarea {
            resize: vertical; /* Allow vertical resizing */
          }

          .form-submit-button {
            padding: 0.75rem 1.5rem;
            background-color: #a8e6cf; /* Matching your button style from index.css */
            border: none;
            font-weight: 700;
            cursor: pointer;
            border-radius: 8px;
            color: #064420;
            font-size: 1.1rem;
            transition: background-color 0.3s ease, transform 0.2s ease;
            margin-top: 1rem;
          }

          .form-submit-button:hover {
            background-color: #82c9a8;
            transform: translateY(-2px);
          }

          /* Submission status messages */
          .submission-message {
            margin-top: 1rem;
            padding: 0.75rem;
            border-radius: 5px;
            text-align: center;
            font-family: 'Quicksand', sans-serif;
          }

          .submission-message.success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
          }

          .submission-message.error {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
          }

          /* Responsive adjustments */
          @media (max-width: 768px) {
            .contact-page-container {
              padding: 1rem;
              padding-top: 6rem;
            }

            .contact-title {
              font-size: 2rem;
            }

            .contact-form {
              padding: 1.5rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Contact;