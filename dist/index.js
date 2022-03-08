"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use((0, compression_1.default)());
app.get("/", (req, res) => {
    res.send("Hello World!").status(200);
});
app.get("/check-download", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { URL } = req.query;
        const { player_response: { videoDetails: { title, author }, }, } = yield ytdl_core_1.default.getBasicInfo(URL);
        res.json({
            status: true,
            title,
            author,
        });
        next();
    }
    catch (e) {
        console.log(e);
    }
}));
app.get("/download", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { URL, downloadFormat, quality, title } = req.query;
        if (downloadFormat === "audio-only") {
            res.setHeader("Content-Disposition", `attachment; filename=${title.substring(0, 40)}.mp3`);
            (0, ytdl_core_1.default)(URL, {
                filter: (format) => format.container === "mp4",
                quality: quality === "high" ? "highest" : "lowest",
            }).pipe(res);
        }
        else {
            res.header("Content-Disposition", `attachment; filename="${title.substring(0, 25)}.mp4"`);
            (0, ytdl_core_1.default)(URL, {
                filter: downloadFormat === "video-only" ? "videoonly" : "audioandvideo",
                quality: quality === "high" ? "highestvideo" : "lowestvideo",
            }).pipe(res);
        }
    }
    catch (e) {
        console.log(e);
    }
}));
app.listen(6000, () => console.log("Server started on port 6000"));
