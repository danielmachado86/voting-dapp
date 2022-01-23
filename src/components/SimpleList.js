import FolderIcon from "@mui/icons-material/Folder";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled } from "@mui/material/styles";
import * as React from "react";

function generate(itemList) {
  return itemList.map((value) =>
    React.cloneElement(
      <ListItem>
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText
          primary={value}
        />
      </ListItem>, {
      key: value,
    })
  );
}

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

export const SimpleList = ({list}) => {
  return (
    <Box sx={{ flexGrow: 1, maxWidth: 752 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Demo>
            <List dense={true}>
              {generate(list)}
            </List>
          </Demo>
        </Grid>
      </Grid>
    </Box>
  );
};
