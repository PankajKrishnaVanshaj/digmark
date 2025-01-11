import { Eye } from "lucide-react";
import React, { useMemo } from "react";

const BookPDFViewer = ({ bookPdf }) => {
  // Memoize the URL for the book's PDF
  const bookPdfUrl = useMemo(
    () => (bookPdf ? `${process.env.NEXT_PUBLIC_BASE_URL}/${bookPdf}` : null),
    [bookPdf]
  );

  // Handle opening the PDF in a new window with an inline viewer
  const handleOpenPDF = (url) => {
    if (url) {
      const pdfViewer = window.open("", "_blank", "width=800,height=600");
      if (pdfViewer) {
        pdfViewer.document.write(`
          <html>
            <head>
              <title>Book Viewer</title>
              <style>
                body {
                  margin: 0;
                  display: flex;
                  flex-direction: column;
                  height: 100%;
                }
                iframe {
                  flex: 1;
                  width: 100%;
                  border: none;
                }
              </style>
            </head>
            <body>
              <iframe src="${url}" width="100%" height="100%" style="border: none;"></iframe>
            </body>
          </html>
        `);
        pdfViewer.document.close();
      }
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
