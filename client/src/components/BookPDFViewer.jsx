import { Eye } from "lucide-react";
import React, { useMemo } from "react";

const BookPDFViewer = ({ bookPdf }) => {
  // Memoize the URL for the book's PDF
  const bookPdfUrl = useMemo(
    () => (bookPdf ? `${process.env.NEXT_PUBLIC_BASE_URL}/${bookPdf}` : null),
    [bookPdf]
  );

  const handleOpenPDF = () => {
    if (bookPdfUrl) {
      window.open(bookPdfUrl, "_blank", "noopener,noreferrer");
    }
  };
  return (
    <div>
      <Eye
        onClick={() => handleOpenPDF(bookPdfUrl)}
        className="cursor-pointer hover:text-purple-700"
        aria-label={`View PDF of book`}
      />
    </div>
  );
};

export default BookPDFViewer;
