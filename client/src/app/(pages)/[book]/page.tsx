import SingleBookPage from "@/components/SingleBookPage";
import { getBookDetails } from "@/utils/book";

interface SingleBook {
  params: {
    book: string;
  };
}

export async function generateMetadata({
  params,
}: {
  params: { book: string };
}) {
  const book = await getBookDetails(params.book);

  if (!book) {
    return {
      title: "Book Not Found",
      description: "The requested book could not be found.",
      openGraph: {
        title: "Book Not Found",
        description: "The requested book could not be found.",
        images: [
          {
            url: `/digmark.png`,
            alt: "Book not found",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Book Not Found",
        description: "The requested book could not be found.",
        image: `/digmark.png`,
      },
    };
  }

  return {
    title: `${book.title} - Book Details`,
    description:
      book.description || `Discover this amazing book titled "${book.title}".`,
    keywords: `${book.title}, book, ${book.genre || ""}, ${book.author || ""}`,
    openGraph: {
      title: book.title,
      description:
        book.description ||
        `Discover this amazing book titled "${book.title}".`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/${book.coverImage}`,
          alt: `Cover image of ${book.title}`,
        },
      ],
      type: "book",
      book: {
        author: book.author,
        genre: book.genre || "General",
        publishedTime: book.publishedDate || "Unknown",
      },
    },
    twitter: {
      card: "summary_large_image",
      title: book.title,
      description:
        book.description ||
        `Discover this amazing book titled "${book.title}".`,
      image: `${process.env.NEXT_PUBLIC_BASE_URL}/${book.coverImage}`,
    },
    robots: "index, follow",
    canonical: `/${params.book}`,
  };
}

export default async function BookPage({
  params,
}: {
  params: { book: string };
}) {
  const book = await getBookDetails(params.book);

  if (!book) {
    return <p>Book not found.</p>;
  }

  // Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    headline: book.title,
    datePublished: book.createdAt,
    dateModified: book.updatedAt || book.created,
    description:
      book.description || `Discover this amazing book titled "${book.title}".`,
    image: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/${book.coverImage}`,
    author: {
      "@type": "Person",
      name: book.author || "PK DigMark",
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${
        book.authorId || "appicons/digmark.png"
      }`,
    },
    publisher: {
      "@type": "Organization",
      name: "PK DigMark",
      logo: {
        "@type": "ImageObject",
        url: "/appicons/digmark.png",
      },
    },
  };

  return (
    <section>
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      <SingleBookPage params={params} />
    </section>
  );
}
