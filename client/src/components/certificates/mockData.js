export const mockCertificates = [
    {
      id: "cert_001",
      studentName: "John Doe",
      courseName: "Advanced React Development",
      completionDate: "2024-11-08",
      issuedDate: "2024-11-08",
      certificateId: "SKM-2024-001-ABC123",
      uniqueHash: "a1b2c3d4e5f67890",
      template: "professional-v1",
      status: "issued",
      verificationUrl: "https://skillifyme.com/verify/a1b2c3d4e5f67890",
      qrCodeData: "https://skillifyme.com/verify/a1b2c3d4e5f67890"
    }
  ];
  
  export const mockTemplates = [
    {
      id: "professional-v1",
      name: "Professional Blue & Gold",
      category: "professional",
      preview: "/assets/templates/professional-preview.png",
      isDefault: true
    },
    {
      id: "academic-v1", 
      name: "Academic Formal",
      category: "academic",
      preview: "/assets/templates/academic-preview.png",
      isDefault: false
    }
  ];