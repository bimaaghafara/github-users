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
import { useEffect, useState, type KeyboardEvent } from "react";
import { useFetch } from "../hooks/useFetch";
import { sx } from "./sx";
import type { User, UsersRes, ReposRes } from "../types/github";

type UserItemProps = {
  user: User;
};

const UserItem = ({ user }: UserItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [url, setUrl] = useState("");
  const reposFetch = useFetch<ReposRes>({ url });

  useEffect(() => {
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

function UserSearch() {
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
      return (
        <Box sx={sx.textInfo}>
          <CircularProgress size={20} />
        </Box>
      );
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
    <Paper elevation={3} sx={sx.paperContainer}>
      <Box sx={sx.appContainer}>
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

export default UserSearch;
