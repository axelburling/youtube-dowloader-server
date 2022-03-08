import compression from "compression";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import ytdl from "ytdl-core";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(compression());

app.get("/check-download", async (req, res, next) => {
  try {
    const { URL } = req.query;
    const {
      player_response: {
        videoDetails: { title, author },
      },
    } = await ytdl.getBasicInfo(URL as string);
    res.json({
      status: true,
      title,
      author,
    });
    next();
  } catch (e) {
    console.log(e);
  }
});

app.get("/download", async (req, res) => {
  try {
    const { URL, downloadFormat, quality, title } = req.query;
    if (downloadFormat === "audio-only") {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${(title as string).substring(0, 40)}.mp3`
      );
      ytdl(URL as string, {
        filter: (format) => format.container === "mp4",
        quality: quality === "high" ? "highest" : "lowest",
      }).pipe(res);
    } else {
      res.header(
        "Content-Disposition",
        `attachment; filename="${(title as string).substring(0, 25)}.mp4"`
      );
      ytdl(URL as string, {
        filter: downloadFormat === "video-only" ? "videoonly" : "audioandvideo",
        quality: quality === "high" ? "highestvideo" : "lowestvideo",
      }).pipe(res);
    }
  } catch (e) {
    console.log(e);
  }
});

app.listen(6000, () => console.log("Server started on port 6000"));
