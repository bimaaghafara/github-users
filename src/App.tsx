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

const styles = {
  userCard: {
    border: "1px solid",
    margin: "12px 0",
    padding: "12px",
  },
  userHeader: {
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  arrow: (isExpanded: boolean): React.CSSProperties => ({
    display: "inline-block",
    transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
    transition: "transform 0.3s ease",
  }),
  repoList: {
    maxHeight: "50vh",
    overflow: "auto",
    marginTop: "6px",
  },
  repoCard: {
    margin: "2px 0",
    padding: "12px",
    background: "#eee",
  },
  textInfo: {
    margin: "12px 0",
  },
  appContainer: {},
  searchBar: {
    display: "flex",
    gap: "8px",
  },
};

const UserItem = ({ user }: UserItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [url, setUrl] = useState("");
  const reposFetch = useFetch<ReposRes>({ url });

  useEffect(() => {
    // set url when isExpanded is true to fetch user's repos
    // reset url when isExpanded is false so will refetch when expanded again
    setUrl(
      isExpanded ? `https://api.github.com/users/${user.login}/repos` : ""
    );
  }, [isExpanded]);

  const renderContent = () => {
    if (reposFetch.isLoading)
      return <div style={styles.textInfo}>Loading....</div>;
    if (reposFetch.error) return <div style={styles.textInfo}>Error...</div>;
    if (reposFetch.data?.length)
      return reposFetch.data.map((repo) => (
        <div key={repo.id} style={styles.repoCard}>
          <div>
            {repo.name} ({repo.stargazers_count}*)
          </div>
          <div>{repo.description || "-"}</div>
        </div>
      ));
    return <div style={styles.textInfo}>This user has no repository.</div>;
  };

  return (
    <div key={user.id} style={styles.userCard}>
      <div style={styles.userHeader} onClick={() => setIsExpanded(!isExpanded)}>
        <div>{user.login}</div>
        <div style={styles.arrow(isExpanded)}>V</div>
      </div>
      {isExpanded && <div style={styles.repoList}>{renderContent()}</div>}
    </div>
  );
};

function App() {
  const [search, setSearch] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [url, setUrl] = useState("");
  const usersFetch = useFetch<UsersRes>({ url });

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
      return <div style={styles.textInfo}>Loading....</div>;
    if (usersFetch.error) return <div style={styles.textInfo}>Error...</div>;
    if (usersFetch.data?.items?.length)
      return (
        <>
          <div style={styles.textInfo}>
            Showing results for <i>{lastSearch}</i>:
          </div>
          {usersFetch.data.items.map((user) => (
            <UserItem user={user} key={user.id} />
          ))}
        </>
      );
    return (
      <div style={styles.textInfo}>
        No Results Found for <i>{lastSearch}</i>
      </div>
    );
  };

  return (
    <div style={styles.appContainer}>
      <div style={styles.searchBar}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDownInputSearch}
        />
        <button onClick={handleClickSearch} disabled={!search}>
          Search
        </button>
      </div>
      {renderContent()}
    </div>
  );
}

export default App;
