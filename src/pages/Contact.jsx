import React, { useState } from 'react';

// Corrected to use the environment variable from .env
const STRAPI_API_URL = import.meta.env.VITE_STRAPI_API_URL;

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionStatus('submitting');
    setErrorMessage('');

    try {
      const emailEndpoint = `${STRAPI_API_URL}/api/email/send`;
      const response = await fetch(emailEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        const errorData = await response.json();
        setSubmissionStatus('error');
        setErrorMessage(`Failed to send message: ${errorData.message || 'Unknown error.'}`);
      }
    } catch (error) {
      setSubmissionStatus('error');
      setErrorMessage(`Failed to send message: ${error.message || 'Network error.'}`);
    }
  };

  return (
    <div className="contact-page-container">
      <h2 className="contact-title">Contact Me</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" rows="5" required value={formData.message} onChange={handleChange}></textarea>
        </div>

        <button type="submit" disabled={submissionStatus === 'submitting'}>
          {submissionStatus === 'submitting' ? 'Sending...' : 'Send Message'}
        </button>

        {submissionStatus === 'success' && <p className="submission-message success">Your message has been sent successfully!</p>}
        {submissionStatus === 'error' && <p className="submission-message error">Error: {errorMessage}</p>}
      </form>
      <style>
        {`
          .contact-page-container {
            max-width: 600px;
            margin: 4rem auto;
            padding: 2rem;
          }

          .contact-title {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 2rem;
          }

          .contact-form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .form-group {
            display: flex;
            flex-direction: column;
          }

          .contact-form label {
            font-weight: 600;
            margin-bottom: 0.5rem;
          }

          .contact-form input,
          .contact-form textarea {
            padding: 0.75rem;
            border-radius: 5px;
            border: 1px solid #444;
            background-color: #222;
            color: #f5f5f5;
            font-family: 'Quicksand', sans-serif;
            font-size: 1rem;
          }

          .contact-form input:focus,
          .contact-form textarea:focus {
            outline: none;
            border-color: #a8e6cf;
            box-shadow: 0 0 5px rgba(168, 230, 207, 0.5);
          }

          .contact-form button {
            align-self: center;
            margin-top: 1rem;
            font-size: 1rem;
          }

          .submission-message {
            text-align: center;
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 5px;
          }

          .success {
            background-color: #28a745;
            color: #fff;
          }

          .error {
            background-color: #dc3545;
            color: #fff;
          }
        `}
      </style>
    </div>
  );
};

export default Contact;