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
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const pdfViewer = window.open("", "_blank");

      if (pdfViewer) {
        pdfViewer.document.write(`
          <html>
            <head>
              <title>Book Viewer</title>
              <style>
                body {
                  margin: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100%;
                }
                iframe {
                  width: 100%;
                  height: 100%;
                  border: none;
                }
              </style>
            </head>
            <body>
              <iframe src="${url}" style="border: none;" type="application/pdf"></iframe>
            </body>
          </html>
        `);

        // For mobile devices, add the PDF viewer plugin (force inline behavior)
        if (isMobile) {
          // Add a <meta> tag to disable downloading on mobile devices
          pdfViewer.document.head.innerHTML += `
            <meta http-equiv="Content-Type" content="application/pdf; charset=utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          `;
        }

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
