import {
  Box,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Typography,
  Avatar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import { useEffect, useState } from "react";
import { useFetch } from "@src/hooks/useFetch";
import { sx } from "./sx";
import type { User, ReposRes } from "@src/types/github";

type UserItemProps = {
  user: User;
};

export const UserItem = ({ user }: UserItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [url, setUrl] = useState("");
  const reposFetch = useFetch<ReposRes>({ url });

  useEffect(() => {
    // Fetch repositories when the accordion is expanded
    // need to set empty when collapsed so it will refetch when expanded again
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
