import React, { useState } from 'react';
import CertificateViewer from './CertificateViewer';
import './CertificateDownload.css';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const CertificateDownload = ({ certificate }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState(null);


const handleDownload = async (format) => {
  setIsGenerating(true);
  setDownloadFormat(format);
  
  try {
    if (format === 'pdf') {
      // Create a professional A4 landscape PDF (like your CertificateViewer)
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([842, 595]); // A4 landscape
    
      // Get fonts
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
      const { width, height } = page.getSize();
    
      // GOLD BORDER (like your CSS)
      page.drawRectangle({
        x: 20,
        y: 20,
        width: width - 40,
        height: height - 40,
        borderColor: rgb(0.82, 0.69, 0.2), // #d4af37 gold
        borderWidth: 15,
      });
    
      // BACKGROUND COLOR
      page.drawRectangle({
        x: 35,
        y: 35,
        width: width - 70,
        height: height - 70,
        color: rgb(1, 1, 1), // White background
      });
    
      // HEADER - Certificate of Completion
      page.drawText('Certificate of Completion', {
        x: width / 2,
        y: height - 120,
        size: 32,
        font: timesBold,
        color: rgb(0.17, 0.24, 0.31), // #2c3e50 dark blue
        maxWidth: width - 100,
        align: 'center',
      });
    
      // AWARDED TO SECTION
      page.drawText('This certificate is proudly presented to', {
        x: width / 2,
        y: height - 200,
        size: 14,
        font: timesRoman,
        color: rgb(0.4, 0.4, 0.4),
        maxWidth: width - 100,
        align: 'center',
      });
    
      // STUDENT NAME (Center Piece)
      page.drawText(certificate.studentName, {
        x: width / 2,
        y: height - 280,
        size: 36,
        font: timesBold,
        color: rgb(0.17, 0.24, 0.31), // #2c3e50
        maxWidth: width - 100,
        align: 'center',
      });
    
      // COURSE SECTION
      page.drawText('for successfully completing the course', {
        x: width / 2,
        y: height - 350,
        size: 14,
        font: timesRoman,
        color: rgb(0.4, 0.4, 0.4),
        maxWidth: width - 100,
        align: 'center',
      });
    
      // COURSE NAME
      page.drawText(certificate.courseName, {
        x: width / 2,
        y: height - 390,
        size: 20,
        font: timesRoman,
        color: rgb(0.2, 0.29, 0.37), // #34495e
        maxWidth: width - 100,
        align: 'center',
      });
    
      // COMPLETION DATE
      const date = new Date(certificate.completionDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      page.drawText(`Completed on: ${date}`, {
        x: width / 2,
        y: height - 450,
        size: 12,
        font: timesRoman,
        color: rgb(0.5, 0.55, 0.55), // #7f8c8d
        maxWidth: width - 100,
        align: 'center',
      });
    
      // CERTIFICATE ID
      page.drawText(`Certificate ID: ${certificate.certificateId}`, {
        x: width / 2,
        y: 80,
        size: 10,
        font: font,
        color: rgb(0.6, 0.6, 0.6),
        maxWidth: width - 100,
        align: 'center',
      });
    
      // SIGNATURES SECTION
      const signatureY = 150;
      
      // Left Signature - Instructor
      page.drawText('_________________________', {
        x: 100,
        y: signatureY,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      page.drawText('Instructor Name', {
        x: 100,
        y: signatureY - 20,
        size: 10,
        font: font,
        color: rgb(0.2, 0.29, 0.37),
      });
      
      page.drawText('Senior Instructor', {
        x: 100,
        y: signatureY - 35,
        size: 10,
        font: font,
        color: rgb(0.2, 0.29, 0.37),
      });
    
      // Right Signature - Organization
      page.drawText('_________________________', {
        x: width - 200,
        y: signatureY,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });
      
      page.drawText('Director of Education', {
        x: width - 200,
        y: signatureY - 20,
        size: 10,
        font: font,
        color: rgb(0.2, 0.29, 0.37),
      });
      
      page.drawText('SkillifyMe Academy', {
        x: width - 200,
        y: signatureY - 35,
        size: 10,
        font: font,
        color: rgb(0.2, 0.29, 0.37),
      });
    
      // Serialize and download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificate.certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'png') {
      // For PNG, we'll still use a simple approach for now
      // (html2canvas or similar would be needed for real PNG export)
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('PNG export coming soon! For now, please use PDF download.');
    }
    
  } catch (error) {
    console.error('PDF generation failed:', error);
    alert('Certificate generation failed. Please try again.');
  } finally {
    setIsGenerating(false);
    setDownloadFormat(null);
  }
};

  return (
    <div className="certificate-download">
      {/* Certificate Preview */}
      <div className="certificate-preview">
        <CertificateViewer certificate={certificate} />
      </div>
      
      {/* Download Controls */}
      <div className="download-controls">
        <h3>Download Your Certificate</h3>
        <div className="download-buttons">
          <button 
            className={`download-btn pdf ${isGenerating && downloadFormat === 'pdf' ? 'generating' : ''}`}
            onClick={() => handleDownload('pdf')}
            disabled={isGenerating}
          >
            {isGenerating && downloadFormat === 'pdf' ? (
              <>
                <span className="spinner"></span>
                Generating PDF...
              </>
            ) : (
              'Download as PDF'
            )}
          </button>
          
          <button 
            className={`download-btn png ${isGenerating && downloadFormat === 'png' ? 'generating' : ''}`}
            onClick={() => handleDownload('png')}
            disabled={isGenerating}
          >
            {isGenerating && downloadFormat === 'png' ? (
              <>
                <span className="spinner"></span>
                Generating PNG...
              </>
            ) : (
              'Download as PNG'
            )}
          </button>
        </div>
        
        {isGenerating && (
          <p className="generating-text">
            Preparing your {downloadFormat.toUpperCase()} certificate...
          </p>
        )}
      </div>
    </div>
  );
};

export default CertificateDownload;