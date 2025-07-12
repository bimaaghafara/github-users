import {
  TextField,
  Button,
  Box,
  CircularProgress,
  Typography,
  Paper,
} from "@mui/material";
import { useEffect, useState, type KeyboardEvent } from "react";
import { useFetch } from "@src/hooks/useFetch";
import { sx } from "./sx";
import type { UsersRes } from "@src/types/github";
import { UserItem } from "@src/components/UserItem";

export const UserSearch = () => {
  const [search, setSearch] = useState("");
  const [lastSearch, setLastSearch] = useState("");
  const [url, setUrl] = useState("");
  const usersFetch = useFetch<UsersRes>({ url });

  const handleClickSearch = () => {
    if (search) {
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
          <Box sx={sx.textInfo}>Showing users for "{lastSearch}"</Box>
          {usersFetch.data.items.map((user) => (
            <UserItem user={user} key={user.id} />
          ))}
        </>
      );
    if (!lastSearch) return null;
    return (
      <Box sx={sx.textInfo}>
        No Results Found for <i>{lastSearch}</i>
      </Box>
    );
  };

  useEffect(() => {
    // Update lastSearch only when the fetch is not loading
    if (!usersFetch.isLoading) setLastSearch(search);
  }, [usersFetch.isLoading]);

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
};
