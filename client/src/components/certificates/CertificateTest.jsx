import CertificateDownload from './CertificateDownload.jsx';

function CertificateTest() {
  const testCertificate = {
    studentName: "John Doe",
    courseName: "Advanced Web Development", 
    completionDate: new Date().toISOString(),
    certificateId: "SKM-2024-001-XYZ789",
    qrCodeData: "https://via.placeholder.com/120x120?text=QR+Code"
  };

  return (
    <div style={{ padding: '2rem', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#2c3e50' }}>
        🎓 Certificate Download Test
      </h1>
      <CertificateDownload certificate={testCertificate} />
    </div>
  );
}

export default CertificateTest;

