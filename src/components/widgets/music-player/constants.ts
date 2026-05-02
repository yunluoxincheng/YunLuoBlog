import type { Song } from "./types";

export const STORAGE_KEY_VOLUME = "music-player-volume";

export const DEFAULT_VOLUME = 0.7;

export const LOCAL_PLAYLIST: Song[] = [
	{
		id: 1,
		title: "Die For You",
		artist: "The Weeknd",
		cover: "/favicon/favicon.ico",
		url: "assets/music/url/The Weeknd - Die For You.mp3",
		duration: 0,
	},
	{
		id: 2,
		title: "夜に駆ける",
		artist: "YOASOBI",
		cover: "/favicon/favicon.ico",
		url: "assets/music/url/YOASOBI-夜に駆ける.mp3",
		duration: 0,
	},
	{
		id: 3,
		title: "それで充分だよ。",
		artist: "kotoha",
		cover: "/favicon/favicon.ico",
		url: "assets/music/url/kotoha-それで充分だよ。.mp3",
		duration: 0,
	},
	{
		id: 4,
		title: "いやいいや",
		artist: "當山みれい",
		cover: "/favicon/favicon.ico",
		url: "assets/music/url/當山みれい-いやいいや.mp3",
		duration: 0,
	},
	{
		id: 5,
		title: "愛するように",
		artist: "kotoha",
		cover: "/favicon/favicon.ico",
		url: "assets/music/url/kotoha-愛するように.mp3",
		duration: 0,
	},
	{
		id: 6,
		title: "LAST STARDUST",
		artist: "Aimer",
		cover: "/favicon/favicon.ico",
		url: "assets/music/url/Aimer-LAST STARDUST.mp3",
		duration: 0,
	},
	{
		id: 7,
		title: "声なき魚",
		artist: "トゲナシトゲアリ",
		cover: "/favicon/favicon.ico",
		url: "assets/music/url/トゲナシトゲアリ-声なき魚.mp3",
		duration: 0,
	},
	{
		id: 8,
		title: "空の箱",
		artist: "トゲナシトゲアリ",
		cover: "/favicon/favicon.ico",
		url: "assets/music/url/トゲナシトゲアリ-空の箱.mp3",
		duration: 0,
	},
];

export const DEFAULT_SONG: Song = {
	title: "Sample Song",
	artist: "Sample Artist",
	cover: "/favicon/favicon.ico",
	url: "",
	duration: 0,
	id: 0,
};

export const DEFAULT_METING_API =
	"https://www.bilibili.uno/api?server=:server&type=:type&id=:id&auth=:auth&r=:r";
export const DEFAULT_METING_ID = "14164869977";
export const DEFAULT_METING_SERVER = "netease";
export const DEFAULT_METING_TYPE = "playlist";

export const ERROR_DISPLAY_DURATION = 3000;
export const SKIP_ERROR_DELAY = 1000;
