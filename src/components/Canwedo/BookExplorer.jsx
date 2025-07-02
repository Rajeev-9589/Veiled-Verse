import React, { useState, useEffect } from "react";

const BookExplorer = () => {
  const [query, setQuery] = useState("india");
  const [results, setResults] = useState([]);
  const [activeTab, setActiveTab] = useState("archive");
  const [selectedBook, setSelectedBook] = useState(null);
  const [wikibookContent, setWikibookContent] = useState(null);
  const [genre, setGenre] = useState("");
  const [sortOrder, setSortOrder] = useState("new");

  // 🔎 Fetch from Internet Archive
  const fetchFromArchive = async (search) => {
    const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(
      search + " AND mediatype:texts"
    )}&fl[]=identifier,title,creator,description,subject,year&rows=50&page=1&output=json`;

    const res = await fetch(url);
    const data = await res.json();
    return data.response.docs.map((book) => ({
      title: book.title,
      author: book.creator,
      description: book.description,
      subject: Array.isArray(book.subject) ? book.subject : [book.subject].filter(Boolean),
      year: book.year,
      identifier: book.identifier,
      source: "Internet Archive",
    }));
  };

  // 🔎 Fetch from Wikibooks
  const fetchFromWikibooks = async (search) => {
    const searchUrl = `https://en.wikibooks.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      search
    )}&format=json&origin=*`;

    const res = await fetch(searchUrl);
    const data = await res.json();
    return data.query.search.map((item) => ({
      title: item.title,
      snippet: item.snippet,
      pageId: item.pageid,
      source: "Wikibooks",
    }));
  };

  const loadBooks = async () => {
    setResults([]);
    let books = [];
    if (activeTab === "archive") {
      books = await fetchFromArchive(query);

      if (genre) {
        books = books.filter((book) =>
          (book.subject || []).join(" ").toLowerCase().includes(genre.toLowerCase()) ||
          book.title.toLowerCase().includes(genre.toLowerCase())
        );
      }

      if (sortOrder === "new") {
        books.sort((a, b) => (b.year || 0) - (a.year || 0));
      } else {
        books.sort((a, b) => (a.year || 0) - (b.year || 0));
      }

      setResults(books);
    } else {
      books = await fetchFromWikibooks(query);
      setResults(books);
    }
  };

  const fetchWikibookContent = async (title) => {
    const url = `https://en.wikibooks.org/w/api.php?action=parse&page=${encodeURIComponent(
      title
    )}&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    setWikibookContent(data.parse?.text["*"] || "Content not available.");
  };

  useEffect(() => {
    loadBooks();
  }, [activeTab]);

  const renderReader = () => {
    if (selectedBook.source === "Internet Archive") {
      return (
        <iframe
          title="IA Book"
          src={`https://archive.org/stream/${selectedBook.identifier}`}
          width="100%"
          height="700px"
          className="border"
        ></iframe>
      );
    } else if (selectedBook.source === "Wikibooks") {
      return (
        <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: wikibookContent }} />
      );
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📚 Free Global Book Reader (IA + Wikibooks)</h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 flex-1"
        />
        <input
          type="text"
          placeholder="Filter by genre (e.g. history)"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="border p-2"
        />
        <select
          className="border p-2"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="new">Newest</option>
          <option value="old">Oldest</option>
        </select>
        <button onClick={loadBooks} className="bg-blue-600 text-white px-4 rounded">
          Search
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          className={`px-3 py-1 rounded ${
            activeTab === "archive" ? "bg-blue-700 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("archive")}
        >
          Internet Archive
        </button>
        <button
          className={`px-3 py-1 rounded ${
            activeTab === "wikibooks" ? "bg-blue-700 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("wikibooks")}
        >
          Wikibooks
        </button>
      </div>

      {selectedBook ? (
        <div className="bg-white p-4 rounded shadow mb-6">
          <button
            className="mb-4 text-sm text-blue-600 underline"
            onClick={() => {
              setSelectedBook(null);
              setWikibookContent(null);
            }}
          >
            ← Back to list
          </button>
          <h2 className="text-xl font-semibold mb-2">{selectedBook.title}</h2>
          {renderReader()}
        </div>
      ) : (
        <div className="grid gap-4">
          {results.map((book, i) => (
            <div
              key={i}
              className="bg-white p-4 shadow rounded hover:scale-105 transition cursor-pointer"
              onClick={() => {
                setSelectedBook(book);
                if (book.source === "Wikibooks") fetchWikibookContent(book.title);
              }}
            >
              <h2 className="font-bold">{book.title}</h2>
              <p className="text-sm text-gray-600">
                {book.author || book.snippet?.replace(/(<([^>]+)>)/gi, "") || "No summary"}
              </p>
              <span className="text-xs text-blue-500">{book.source}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookExplorer;