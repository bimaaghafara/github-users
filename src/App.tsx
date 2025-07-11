import { useEffect, useState, type KeyboardEvent } from "react";
import "./App.css";
import { useFetch } from "./hooks/useFetch";

type User = {
  id: number;
  login: string;
  avatar_url: string;
};

type UsersRes = {
  total_count: number;
  items: Array<User>;
};

type UserItemProps = {
  user: User;
};

type Repo = {
  id: number;
  name: string;
  description: string;
  stargazers_count: number;
};

type ReposRes = Repo[];

const UserItem = ({ user }: UserItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  // https://api.github.com/users/bimaaghafara/repos?page=1&per_page=5
  const [url, setUrl] = useState("");
  const reposFetch = useFetch<ReposRes>({
    url,
  });

  useEffect(() => {
    if (isExpanded) {
      setUrl(`https://api.github.com/users/${user.login}/repos`);
    } else {
      // reset url when not expanded, so will refetch when re-expanded content
      setUrl("");
    }
  }, [isExpanded]);

  const renderContent = () => {
    if (reposFetch.isLoading)
      return <div style={{ margin: "12px 0" }}>Loading....</div>;
    if (reposFetch.error)
      return <div style={{ margin: "12px 0" }}>Error...</div>;
    if (reposFetch.data?.length)
      return reposFetch.data.map((repo) => (
        <div
          key={repo.id}
          style={{ margin: "2px 0", padding: "12px", background: "#eee" }}
        >
          <div>
            {repo.name} ({repo.stargazers_count}*)
          </div>
          <div>{repo.description || "-"}</div>
        </div>
      ));
    return <div style={{ margin: "12px 0" }}>This user has no repository.</div>;
  };

  return (
    <div
      key={user.id}
      style={{
        border: "1px solid",
        margin: "12px 0",
        padding: "12px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div>{user.login}</div>
        <div
          style={{
            display: "inline-block",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
          }}
        >
          V
        </div>
      </div>
      {isExpanded && (
        <div style={{ maxHeight: "50vh", overflow: "auto", marginTop: "6px" }}>
          {renderContent()}
        </div>
      )}
    </div>
  );
};

function App() {
  const [search, setSearch] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [url, setUrl] = useState("");
  const usersFetch = useFetch<UsersRes>({
    url,
  });

  const handleClickSearch = () => {
    if (search) {
      setLastSearch(search);
      setUrl(
        `https://api.github.com/search/users?q=${search}&page=1&per_page=5`
      );
    }
  };

  const handleKeyDownInputSearch = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleClickSearch();
    }
  };

  const renderContent = () => {
    if (!lastSearch) return null;
    if (usersFetch.isLoading)
      return <div style={{ margin: "12px 0" }}>Loading....</div>;
    if (usersFetch.error)
      return <div style={{ margin: "12px 0" }}>Error...</div>;
    if (usersFetch.data?.items?.length)
      return (
        <>
          <div style={{ margin: "12px 0" }}>
            Showing results for <i>{lastSearch}</i>:
          </div>
          {usersFetch.data.items.map((user) => (
            <UserItem user={user} key={user.id} />
          ))}
        </>
      );
    return (
      <div style={{ margin: "12px 0" }}>
        No Results Found for <i>{lastSearch}</i>
      </div>
    );
  };

  return (
    <div>
      <div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDownInputSearch}
        />
        <button onClick={handleClickSearch}>search</button>
      </div>
      {renderContent()}
    </div>
  );
}

export default App;

/**
 *
 * todo:
 * - styling
 * - readme
 * - deployement
 * - error
 * - unit test
 *
 *  */
