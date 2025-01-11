import { Eye } from "lucide-react";
import React, { useMemo, useState } from "react";

const BookPDFViewer = ({ bookPdf }) => {
  const bookPdfUrl = useMemo(
    () => (bookPdf ? `${process.env.NEXT_PUBLIC_BASE_URL}/${bookPdf}` : null),
    [bookPdf]
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage modal visibility

  // Function to open the dialog
  const openDialog = () => {
    setIsDialogOpen(true); // Show the dialog when the icon is clicked
  };

  // Function to close the dialog
  const closeDialog = () => {
    setIsDialogOpen(false); // Hide the dialog when the close button is clicked
  };

  return (
    <div className="hidden md:block">
      <Eye
        onClick={openDialog}
        className="cursor-pointer hover:text-purple-700"
        aria-label={`View PDF of book`}
      />

      {/* Dialog/Modal */}
      {isDialogOpen && (
        <div
          role="dialog"
          aria-labelledby="comment-form-title"
          aria-modal="true"
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-4xl max-h-full overflow-auto sm:w-11/12 md:w-3/4 lg:w-1/2">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Book PDF Viewer
              </h2>
              <button
                onClick={closeDialog}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close Dialog"
              >
                &times;
              </button>
            </div>

            {/* Iframe to display PDF */}
            <div className="mt-4">
              <iframe
                src={bookPdfUrl}
                width="100%"
                height="500px"
                frameBorder="0"
                title="Book PDF"
                className="rounded-md border border-gray-300"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookPDFViewer;
