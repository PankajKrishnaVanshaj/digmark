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
            url: `/appicons/digmark.png`,
            alt: "Book not found",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Book Not Found",
        description: "The requested book could not be found.",
        image: `/appicons/digmark.png`,
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

  // Fallback values
  const title = book?.title || "Unknown Title";
  const description =
    book?.description || `Details about the book titled "${title}" are unavailable.`;
  const author = book?.author || "PK digmark";
  const imageUrl = book?.coverImage
    ? `${process.env.NEXT_PUBLIC_BASE_URL || ""}/${book.coverImage}`
    : "/appicons/digmark.png";

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    image: imageUrl,
    description: description,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "PK Digmark",
      logo: {
        "@type": "ImageObject",
        url: "/appicons/digmark.png",
      },
    },
    genre: book?.genre || "General",
    datePublished: book.createdAt,
    dateModified: book.updatedAt || book.createdAt,  };

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SingleBookPage params={params} />
    </section>
  );
}

