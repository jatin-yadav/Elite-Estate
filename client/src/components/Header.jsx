import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function Header() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlPrams = new URLSearchParams(window.location.search);
    urlPrams.set("searchTerm", searchTerm);
    const searchQuery = urlPrams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold py-2 text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Elite</span>
            <span className="text-slate-700">Estae</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <ul className="flex gap-4">
          <li className="hidden sm:inline py-2 text-slate-700 hover:underline">
            <Link to="/">Home</Link>
          </li>
          <li className="hidden sm:inline py-2 text-slate-700 hover:underline">
            <Link to="/about">About</Link>
          </li>
          <Link to="/profile">
            {currentUser ? (
              <li className="py-2">
                <img
                  className="rounded-full h-7 w-7 object-cover"
                  src={currentUser.avatar}
                  alt="profile"
                />
              </li>
            ) : (
              <li className="">
                <button
                  type="button"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  SignIn
                </button>
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}

export default Header;
