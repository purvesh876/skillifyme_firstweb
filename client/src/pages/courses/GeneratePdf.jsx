
import jsPDF from "jspdf";
import toast from "react-hot-toast";

const toBase64 = (url) =>
  fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        })
    );


export const generatePdf = async (currentUser, cart, paymentInfo) => {
  if (!cart || cart.length === 0) return toast.error("Cart is empty!");

  const doc = new jsPDF();
  let y = 50;

  try {
    const logo = await toBase64("/logo.png");
    const signImg = await toBase64("/sign.png");

    if (logo) doc.addImage(logo, "PNG", 15, 10, 30, 30);

    doc.setFont("helvetica", "bold").setFontSize(18);
    doc.text("SkillifyMe", 105, 25, { align: "center" });
    doc.setFont("helvetica", "normal").setFontSize(11);
    doc.text("Your Learning Partner", 105, 32, { align: "center" });
    doc.setDrawColor(100);
    doc.setLineWidth(0.5);
    doc.line(20, 36, 190, 36);

    doc.setFillColor(220, 230, 255);
    doc.rect(20, 40, 170, 10, "F");
    doc.setFont("helvetica", "bold").setFontSize(14);
    doc.text("Invoice / Payment Receipt", 105, 47, { align: "center" });

    y = 60;

    //user details
    doc.setFont("helvetica", "bold").setFontSize(12);
    doc.text("Buyer Details", 20, y);
    y += 6;
    doc.setFont("helvetica", "normal").setFontSize(10);
    const buyerDetails = [
      `Name: ${currentUser?.name}`,
      `Email: ${currentUser.email || "N/A"}`,
      `Contact: ${currentUser?.contactNumber || "N/A"}`,
      `College: ${currentUser.college || "N/A"}`,
      `Payment ID: ${paymentInfo?.paymentId || "N/A"}`,

    ];
    buyerDetails.forEach((line) => {
      doc.text(line, 22, y);
      y += 6;
    });

    y += 4;

    // Courses 
    const startX = 20;
    const colWidths = [90, 20, 30, 30];
    const rowHeight = 8;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setFillColor(180, 200, 255);
    doc.rect(startX, y, colWidths.reduce((a,b)=>a+b,0), rowHeight, "F");
    doc.setTextColor(0);
    doc.text("Course Name", startX + 2, y + 6);
    doc.text("Qty", startX + colWidths[0] + 2, y + 6);
    doc.text("Price (Rs)", startX + colWidths[0] + colWidths[1] + 2, y + 6);
    doc.text("Total (Rs)", startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, y + 6);

    y += rowHeight;

    let grandTotal = 0;
    doc.setFont("helvetica", "normal");

    cart.forEach((item, idx) => {
      const itemTotal = (item.price || 0) * (item.quantity || 1);
      grandTotal += itemTotal;

      if (idx % 2 === 0) doc.setFillColor(245, 245, 245);
      else doc.setFillColor(255, 255, 255);
      doc.rect(startX, y, colWidths.reduce((a,b)=>a+b,0), rowHeight, "F");

      doc.text(item.name, startX + 2, y + 6);
      doc.text(`${item.quantity || 1}`, startX + colWidths[0] + 2, y + 6);
      doc.text(`${item.price || 0}`, startX + colWidths[0] + colWidths[1] + 2, y + 6);
      doc.text(`${itemTotal}`, startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, y + 6);

      y += rowHeight;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.setFont("helvetica", "bold");
    doc.setFillColor(180, 220, 255);
    doc.rect(startX, y, colWidths.reduce((a,b)=>a+b,0), rowHeight, "F");
    doc.text("Grand Total", startX + 2, y + 6);
    doc.text(`${grandTotal}`, startX + colWidths[0] + colWidths[1] + colWidths[2] + 2, y + 6);

    y += rowHeight + 10;

    if (signImg) doc.addImage(signImg, "PNG", 140, y, 50, 20);
    doc.setFontSize(10);
    doc.text("Founder Signature", 165, y + 23, { align: "center" });

    const today = new Date().toLocaleDateString();
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Issued on: ${today}`, 20, 280);
    doc.text(
      "This invoice is system generated. Please carry a printed or digital copy.",
      105,
      287,
      { align: "center" }
    );

    doc.save(`invoice_${currentUser.personal?.firstName || "user"}.pdf`);
  } catch (err) {
    console.error(err);
    toast.error("Failed to generate invoice PDF.");
  }
};
