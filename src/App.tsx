import "./App.css";
import { useEffect, useState, type KeyboardEvent } from "react";
import { useFetch } from "./hooks/useFetch";
import {
  TextField,
  Button,
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Typography,
  Paper,
  Avatar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";

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

const sx = {
  pageContainer: {
    maxWidth: 600,
    mx: "auto",
    my: 1,
    minHeight: "calc(100vh - 16px)",
  },
  contentContainer: {
    p: 2,
  },
  searchBar: {
    display: "flex",
    gap: "8px",
    mb: 2,
  },
  repoList: {
    maxHeight: "50vh",
    overflow: "auto",
    my: 1,
  },
  repoCard: {
    margin: "6px 0",
    padding: "12px",
    background: "#eee",
    borderRadius: "8px",
  },
  repoName: {
    display: "flex",
    justifyContent: "space-between",
  },
  textInfo: {
    margin: "12px 0",
  },
  userSummary: {
    background: "#f5f5f5",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: 1,
  },
  starCount: {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
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
  }, [isExpanded, user.login]);

  const renderContent = () => {
    if (reposFetch.isLoading)
      return (
        <Box>
          <CircularProgress size={20} />
        </Box>
      );

    if (reposFetch.error)
      return (
        <Box sx={sx.textInfo}>
          <Typography color="error">Error fetching repos.</Typography>
        </Box>
      );

    if (reposFetch.data?.length)
      return reposFetch.data.map((repo) => (
        <Box key={repo.id} sx={sx.repoCard}>
          <Box sx={sx.repoName}>
            <Typography fontWeight="bold">{repo.name}</Typography>
            <Typography sx={sx.starCount}>
              {repo.stargazers_count} <StarIcon fontSize="small" />
            </Typography>
          </Box>
          <Typography variant="body2">
            {repo.description || "No description."}
          </Typography>
        </Box>
      ));

    return <Box sx={sx.textInfo}>This user has no repository.</Box>;
  };

  return (
    <Accordion onChange={(_, isExpanded) => setIsExpanded(isExpanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={sx.userSummary}>
        <Box sx={sx.userInfo}>
          <Avatar src={user.avatar_url} alt={user.login} />
          <Typography>{user.login}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={sx.repoList}>{renderContent()}</Box>
      </AccordionDetails>
    </Accordion>
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
    if (usersFetch.isLoading) return <Box sx={sx.textInfo}>Loading....</Box>;
    if (usersFetch.error) return <Box sx={sx.textInfo}>Error...</Box>;
    if (usersFetch.data?.items?.length)
      return (
        <>
          <Box sx={sx.textInfo}>
            Showing results for <i>{lastSearch}</i>:
          </Box>
          {usersFetch.data.items.map((user) => (
            <UserItem user={user} key={user.id} />
          ))}
        </>
      );
    return (
      <Box sx={sx.textInfo}>
        No Results Found for <i>{lastSearch}</i>
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={sx.pageContainer}>
      <Box sx={sx.contentContainer}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Github User Search
        </Typography>
        <Box sx={sx.searchBar}>
          <TextField
            placeholder="Type a username..."
            variant="outlined"
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDownInputSearch}
          />
          <Button
            variant="contained"
            onClick={handleClickSearch}
            disabled={!search}
          >
            Search
          </Button>
        </Box>
        {renderContent()}
      </Box>
    </Paper>
  );
}

export default App;
