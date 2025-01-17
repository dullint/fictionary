import { Button, Divider, Grid, Input, Typography } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { theme } from "../../theme";
import { generateRandomRoomId } from "../GameSettingsDisplayer/helpers";
import { Box } from "@mui/system";
import { TypeAnimation } from "react-type-animation";
import { getTypingSequence } from "./helpers";
import HowToPlay from "../HowToPlay";
import socket from "../../socket";
import { ServerResponse } from "../../../../server/src/socket/types";
import CreditsDialog from "../CreditsDialog";
import RedditIcon from "@mui/icons-material/Reddit";
import redditBanner from "../../img/redditBanner.png";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [joinRoomError, setJoinRoomError] = useState<string | null>(null);
  const [openCredits, setOpenCredits] = useState(false);

  const handleCreateGame = async (event) => {
    event.preventDefault();
    const newRoomId = generateRandomRoomId();
    const callback = (response: ServerResponse) => {
      if (response.success) navigate(`/room/${newRoomId}`);
    };
    socket.emit("create_room", newRoomId, callback);
  };

  const handleJoinGame = async () => {
    if (roomId) {
      const callback = (response: ServerResponse) => {
        const { error, success } = response;
        if (success) navigate(`/room/${roomId}`);
        if (error) setJoinRoomError(error);
      };
      socket.emit("join_room", roomId, callback);
    }
  };

  const handleRedditClick = () => {
    window.open("https://www.reddit.com/r/fictionaryio/", "_blank");
  };

  return (
    <Box
      display={"flex"}
      flexDirection="column"
      alignItems={"center"}
      sx={{
        marginBottom: 2,
        maxWidth: {
          xs: 300,
          sm: 400,
        },
      }}
      justifyContent={"space-between"}
      height={1}
    >
      <Box
        sx={{
          marginBottom: 2,
        }}
      >
        <Typography variant={"h1"}>Fictionary</Typography>
        <Box
          sx={{
            minHeight: 70,
          }}
        >
          <Typography
            component="span"
            fontStyle={"italic"}
            fontSize={18}
            fontFamily="bespoke-light-italic"
            sx={{ marginRight: 0.5 }}
          >
            {"proper noun: "}
          </Typography>
          <TypeAnimation
            sequence={getTypingSequence()}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            deletionSpeed={70}
            speed={50}
            style={{
              fontSize: 18,
              fontFamily: "bespoke-regular",
            }}
          />
        </Box>
      </Box>
      <Box display={"flex"} flexDirection="column" sx={{ marginBottom: 4 }}>
        <Box display={"flex"}>
          <Input
            placeholder="Room ID"
            onChange={(e) => {
              setRoomId(e.target.value.toLocaleUpperCase());
              setJoinRoomError(null);
            }}
            sx={{
              height: 50,
              flex: 1,
              borderRadius: 30,
              borderColor: "#555555",
            }}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleJoinGame();
              }
            }}
            value={roomId}
            inputProps={{
              maxLength: 5,
              style: { textAlign: "center", fontWeight: 900, fontSize: 24 },
            }}
          />
          <Button
            onClick={handleJoinGame}
            variant="contained"
            sx={{
              marginLeft: 2,
              width: { xs: 140, sm: 230 },
              height: 50,
            }}
          >
            Join game
          </Button>
        </Box>
        <Box width={1}>
          {joinRoomError && (
            <Typography
              sx={{ color: theme.palette.secondary.main }}
              textAlign={"center"}
            >
              {joinRoomError}
            </Typography>
          )}
          <Divider
            sx={{
              marginBottom: 1,
              marginTop: 1,
              width: 1,
            }}
          >
            <Typography variant="subtitle1">OR</Typography>
          </Divider>
        </Box>
        <Button
          onClick={handleCreateGame}
          variant="contained"
          sx={{
            width: { xs: 300, sm: 400, md: "auto" },
            height: 50,
          }}
        >
          Create game
        </Button>
      </Box>
      <Box
        sx={{
          mb: 3,
          backgroundColor: theme.palette.yellow.darker,
          borderRadius: 5,
          display: "flex",
          width: 1,
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography mt={1} variant="subtitle1">
          Supported dictionary languages:
        </Typography>
        <Typography mb={1}>
          🇫🇷 French <br /> 🇬🇧 English
        </Typography>
      </Box>
      <HowToPlay />
      <Box
        onClick={handleRedditClick}
        sx={{
          mt: 3,
          position: "relative",
          width: "100%",
          height: "auto",
          backgroundImage: `url(${redditBanner})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          borderRadius: 5,
        }}
      >
        <Box display={"flex"} flexDirection={"column"} margin={1.5}>
          <Typography
            sx={{
              color: "white",
              fontSize: 15,
              borderColor: "black",
              borderWidth: 3,
              mb: 1,
            }}
            variant="h6"
          >
            Suggest new words, <br />
            Get your language added, <br />
            and more ...
          </Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<RedditIcon />}
              sx={{
                backgroundColor: "secondary.main",
                color: "white",
                ":hover": {
                  backgroundColor: "secondary.light",
                },
              }}
            >
              <Typography variant="subtitle1">Join the community</Typography>
            </Button>
          </Box>
        </Box>
      </Box>
      <Grid
        container
        direction="row"
        alignItems="center"
        justifyContent={"space-between"}
        sx={{
          width: { xs: 200, sm: 300 },
          mt: 1,
        }}
      >
        <Button size="small" href={"mailto:fictionary.io@gmail.com"}>
          Contact
        </Button>
        <Button size="small" onClick={() => setOpenCredits(true)}>
          Credits
        </Button>
      </Grid>
      <CreditsDialog open={openCredits} setOpen={setOpenCredits} />
    </Box>
  );
};

export default Home;
