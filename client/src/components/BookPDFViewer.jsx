import { Eye } from "lucide-react";
import React, { useMemo } from "react";

const BookPDFViewer = ({ bookPdf }) => {
  // Memoize the URL for the book's PDF
  const bookPdfUrl = useMemo(
    () => (bookPdf ? `${process.env.NEXT_PUBLIC_BASE_URL}/pdf/${bookPdf}` : null),
    [bookPdf]
  );

  // Handle opening the PDF using Google Docs Viewer
  const handleOpenPDF = (url) => {
    if (url) {
      const encodedUrl = encodeURIComponent(url);
      const googleDocsUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
      const viewer = window.open(googleDocsUrl, "_blank");

      // Fallback if Google Docs Viewer shows "No Preview Available"
      if (!viewer) {
        alert("Unable to preview the PDF. Please check your internet connection or try again.");
      }
    } else {
      alert("PDF file not found. Please check the file path or contact support.");
    }
  };

  return (
    <div>
      <Eye
        onClick={() => handleOpenPDF(bookPdfUrl)}
        className="cursor-pointer hover:text-purple-700"
        aria-label="View PDF of book"
      />
    </div>
  );
};

export default BookPDFViewer;
