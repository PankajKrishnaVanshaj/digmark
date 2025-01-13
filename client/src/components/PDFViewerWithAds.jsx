import React, { useMemo } from "react";

const PDFViewerWithAds = ({ book }) => {
  // Memoize the URL for the book's PDF
  const bookPdfUrl = useMemo(
    () => (book ? `${process.env.NEXT_PUBLIC_BASE_URL}/pdf/${book.bookPdf}` : null),
    [book]
  );

  // Function to open the PDF viewer with ads
  const handleOpenPDF = () => {
    if (bookPdfUrl) {
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
                #pdf-container {
                  flex: 1;
                  width: 100%;
                  border: none;
                }
                #ads-container {
                  background-color: #f9f9f9;
                  padding: 10px;
                  text-align: center;
                  border-top: 1px solid #ddd;
                }
                #ads-container img {
                  max-width: 100%;
                  height: auto;
                  margin: 0 auto;
                }
              </style>
            </head>
            <body>
              <iframe
                id="pdf-container"
                src="${bookPdfUrl}"
                width="100%"
                height="100%"
              ></iframe>
              <div id="ads-container">
                <h3>Sponsored Ad</h3>
                <a href="https://example.com" target="_blank">
                  <img src="/ads/ad1.jpg" alt="Ad" />
                </a>
                <p>Get the best books at amazing prices!</p>
              </div>
            </body>
          </html>
        `);
        pdfViewer.document.close();
      }
    }
  };

  return (
    <button
      onClick={handleOpenPDF}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Open Book
    </button>
  );
};

export default PDFViewerWithAds;
