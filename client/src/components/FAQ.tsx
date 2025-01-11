import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const faqs = [
    {
      question: "How can I improve my comprehension while reading a book?",
      answer:
        "To improve comprehension, take notes, highlight key points, and summarize chapters in your own words. Reading actively and asking questions about the content can also help.",
    },
    {
      question: "What is the best way to choose a book that suits me?",
      answer:
        "Start by identifying your interests or goals. You can check reviews, ask for recommendations, or read a sample chapter to see if it captures your attention.",
    },
    {
      question: "How do I retain more information from books?",
      answer:
        "Retention can be improved by reviewing your notes, discussing the book with others, or teaching someone what you've learned. Spaced repetition is also a great technique.",
    },
    {
      question: "Should I read one book at a time or multiple books?",
      answer:
        "It depends on your preference. Reading one book at a time allows deeper focus, while reading multiple books can provide variety. Try both approaches to see what works best for you.",
    },
    {
      question: "How can I develop a consistent reading habit?",
      answer:
        "Set a specific time for reading each day, even if it's just 15 minutes. Create a comfortable reading space, and keep books easily accessible. Joining a book club can also keep you motivated.",
    },
  ];

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  return (
    <div className="">
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <button
              className="w-full flex justify-between items-center text-left font-bold text-lg"
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
