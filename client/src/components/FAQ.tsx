import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState(null);

  const faqs = [
    {
      question: "What is this platform?",
      answer: "This is a platform where you can...",
    },
    {
      question: "How do I sign up?",
      answer: "You can sign up by clicking on...",
    },
    {
      question: "Can I reset my password?",
      answer: "Yes, you can reset your password by...",
    },
  ];

  const toggleQuestion = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="p-4">
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <button
              className="w-full flex justify-between items-center text-left font-medium text-lg"
              onClick={() => toggleQuestion(index)}
            >
              {faq.question}
              <span
                className={`transition-transform duration-300 ${
                  openQuestion === index ? "rotate-180" : ""
                }`}
              >
                <ChevronDown size={24} />
              </span>
            </button>
            {openQuestion === index && (
              <p className="mt-2 text-gray-600">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
