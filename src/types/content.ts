export interface CategoryResponse {
	id: number;
	name: string;
	slug: string;
	description: string;
	sortOrder: number;
	postCount: number;
}

export interface TagResponse {
	id: number;
	name: string;
	slug: string;
	postCount: number;
}

export interface PostCategoryResponse {
	id: number;
	name: string;
	slug: string;
}

export interface PostListResponse {
	id: number;
	title: string;
	slug: string;
	alias: string;
	permalink: string;
	description: string;
	image: string;
	category: PostCategoryResponse | null;
	tags: string[];
	pinned: boolean;
	priority: number;
	status: string;
	draft: boolean;
	publishedAt: string | null;
	updatedAt: string | null;
	comment: boolean;
	author: string;
	sourceLink: string;
	licenseName: string;
	licenseUrl: string;
	encrypted: boolean;
	passwordHint: string;
	lang: string;
}

export interface PostDetailResponse {
	id: number;
	title: string;
	slug: string;
	alias: string;
	permalink: string;
	content: string;
	description: string;
	image: string;
	category: PostCategoryResponse | null;
	tags: string[];
	status: string;
	draft: boolean;
	pinned: boolean;
	priority: number;
	comment: boolean;
	author: string;
	sourceLink: string;
	licenseName: string;
	licenseUrl: string;
	encrypted: boolean;
	passwordHint: string;
	lang: string;
	publishedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface PostArchiveItem {
	id: number;
	title: string;
	slug: string;
	publishedAt: string;
}

export interface PostArchiveResponse {
	year: number;
	month: number;
	posts: PostArchiveItem[];
}