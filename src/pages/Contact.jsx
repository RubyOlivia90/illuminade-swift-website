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
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} />

        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="5" required value={formData.message} onChange={handleChange}></textarea>

        <button type="submit" disabled={submissionStatus === 'submitting'}>
          {submissionStatus === 'submitting' ? 'Sending...' : 'Send Message'}
        </button>

        {submissionStatus === 'success' && <p className="submission-message success">Your message has been sent successfully!</p>}
        {submissionStatus === 'error' && <p className="submission-message error">Error: {errorMessage}</p>}
      </form>
    </div>
  );
};

export default Contact;
