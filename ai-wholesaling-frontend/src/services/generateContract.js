import { jsPDF } from 'jspdf';

// Placeholder for Firebase upload function
const uploadContractToFirebase = (pdfBlob, contractId, type) => {
  console.log(`Uploading ${type} contract ${contractId}.pdf to Firebase...`);
};

export const generateContractPDF = (contract) => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text('Purchase and Sale Agreement', 10, 20);
  
  doc.setFontSize(12);
  doc.text(`Property Address: ${contract.propertyAddress || ''}`, 10, 30);
  doc.text(`Purchase Price: ${contract.purchasePrice || 0}`, 10, 40);
  const closingDate = contract.closingDate ? new Date(contract.closingDate).toLocaleDateString() : 'N/A';
  doc.text(`Closing Date: ${closingDate}`, 10, 50);

  doc.text(`Buyer: ${contract.assigneeName || 'TBD'}`, 10, 60);
  doc.text(`Seller: ${contract.assignorName || 'Property Owner'}`, 10, 70);
  doc.text(`Title Company: ${contract.titleCompany || 'TBD'}`, 10, 80);

  const pdfBlob = doc.output('blob');
  uploadContractToFirebase(pdfBlob, contract.id, 'purchase');
  doc.save(`${contract.id}_Purchase_Sale_Agreement.pdf`);
};

export const generateAssignmentContractPDF = (contract) => {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text('Assignment Contract', 10, 20);

  doc.setFontSize(12);
  doc.text(`Assignor Name: ${contract.assignorName || ''}`, 10, 30);
  doc.text(`Assignee Name: ${contract.assigneeName || ''}`, 10, 40);
  doc.text(`Property Address: ${contract.propertyAddress || ''}`, 10, 50);
  doc.text(`Purchase Price: ${contract.purchasePrice || 0}`, 10, 60);
  doc.text(`Assignment Fee: ${contract.assignmentFee || 0}`, 10, 70);
  doc.text(`Earnest Money: ${contract.earnestMoney || 0}`, 10, 80);
  
  const closingDate = contract.closingDate ? new Date(contract.closingDate).toLocaleDateString() : 'N/A';
  doc.text(`Closing Date: ${closingDate}`, 10, 90);
  doc.text(`Title Company: ${contract.titleCompany || 'TBD'}`, 10, 100);

  const pdfBlob = doc.output('blob');
  uploadContractToFirebase(pdfBlob, contract.id, 'assignment');
  doc.save(`${contract.id}_Assignment_Contract.pdf`);
};
