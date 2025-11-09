import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import './CertificateViewer.css';


/**
 * CertificateViewer Component
 * 
 * Displays a professional certificate with student information, course details,
 * verification QR code, and signatures.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.certificate - Certificate data object
 * @param {string} props.certificate.studentName - Name of the student
 * @param {string} props.certificate.courseName - Name of the completed course
 * @param {string} props.certificate.completionDate - Date of course completion (ISO format)
 * @param {string} props.certificate.certificateId - Unique certificate identifier
 * @param {string} props.certificate.qrCodeData - URL or data URI for QR code image
 * @param {string} props.template - Template variant (default: 'professional-v1')
 * @param {boolean} props.isLoading - Loading state (default: false)
 * @param {string} props.className - Additional CSS classes
 */
const CertificateViewer = ({ 
  certificate, 
  template = 'professional-v1',
  isLoading = false,
  className = ''
}) => {
  // Memoize formatted date to avoid recalculation on every render
  const formattedDate = useMemo(() => {
    if (!certificate?.completionDate) return '';
    try {
      const date = new Date(certificate.completionDate);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return certificate.completionDate;
    }
  }, [certificate?.completionDate]);

  // Handle image loading errors
  const handleImageError = (e, imageType) => {
    console.error(`Failed to load ${imageType} image:`, e.target.src);
    e.target.style.display = 'none';
  };

  // Loading state
  if (isLoading || !certificate) {
    return (
      <div 
        className={`certificate-viewer loading ${className}`}
        role="status"
        aria-live="polite"
        aria-label="Loading certificate"
      >
        <div className="loading-spinner" aria-hidden="true"></div>
        <p>Loading certificate...</p>
      </div>
    );
  }

  // Validate required certificate fields
  if (!certificate.studentName || !certificate.courseName) {
    return (
      <div 
        className={`certificate-viewer error ${className}`}
        role="alert"
        aria-live="assertive"
      >
        <p>Error: Certificate data is incomplete. Please contact support.</p>
      </div>
    );
  }

  return (
    <article 
      className={`certificate-viewer ${template} ${className}`}
      aria-label={`Certificate of completion for ${certificate.studentName}`}
    >
      <div className="certificate-container">
        {/* Certificate Header */}
        <header className="certificate-header">
          <h1>Certificate of Completion</h1>
          <div className="organization-logo">
            <img 
              src="/assets/logos/skillifyme-logo.png" 
              alt="SkillifyMe Academy Logo" 
              loading="lazy"
              onError={(e) => handleImageError(e, 'logo')}
            />
          </div>
        </header>

        {/* Student Name - Center Piece */}
        <section className="student-name-section" aria-label="Certificate recipient">
          <p className="awarded-to">This certificate is proudly presented to</p>
          <h2 className="student-name">{certificate.studentName}</h2>
        </section>

        {/* Course Details */}
        <section className="course-details" aria-label="Course information">
          <p>for successfully completing the course</p>
          <h3 className="course-name">{certificate.courseName}</h3>
          <p className="completion-date">
            <time dateTime={certificate.completionDate}>
              Completed on: {formattedDate}
            </time>
          </p>
        </section>

        {/* Certificate ID & Verification */}
        <section className="verification-section" aria-label="Certificate verification">
          <div className="certificate-id">
            <span className="sr-only">Certificate identification number: </span>
            Certificate ID: <strong>{certificate.certificateId}</strong>
          </div>
          <div className="qr-code">
            <img 
              src={certificate.qrCodeData} 
              alt={`QR code for verifying certificate ${certificate.certificateId}`}
              width={120}
              height={120}
              loading="lazy"
              onError={(e) => handleImageError(e, 'QR code')}
            />
            <p>Scan to verify</p>
          </div>
        </section>

        {/* Signatures */}
        <section className="signatures" aria-label="Certificate signatures">
          <div className="instructor-signature">
            <div className="signature-line" aria-hidden="true"></div>
            <p>Instructor Name</p>
            <p>Senior Instructor</p>
          </div>
          <div className="organization-signature">
            <div className="signature-line" aria-hidden="true"></div>
            <p>Director of Education</p>
            <p>SkillifyMe Academy</p>
          </div>
        </section>
      </div>
    </article>
  );
};

// PropTypes for runtime type checking
CertificateViewer.propTypes = {
  certificate: PropTypes.shape({
    studentName: PropTypes.string.isRequired,
    courseName: PropTypes.string.isRequired,
    completionDate: PropTypes.string.isRequired,
    certificateId: PropTypes.string.isRequired,
    qrCodeData: PropTypes.string.isRequired,
  }),
  template: PropTypes.string,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};

// Memoize component to prevent unnecessary re-renders
export default React.memo(CertificateViewer);