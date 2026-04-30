import type { AlbumGroup } from "@/types/album";

export const albumsData: AlbumGroup[] = [];

export function getAlbumsList(): AlbumGroup[] {
	return albumsData;
}