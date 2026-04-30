export interface FriendResponse {
	id: number;
	title: string;
	avatar: string;
	description: string;
	siteUrl: string;
	tags: string[];
}

export interface AnimeResponse {
	id: number;
	title: string;
	status: string;
	rating: number;
	cover: string;
	description: string;
	episodes: string;
	year: string;
	genre: string[];
	studio: string;
	link: string;
	progress: number;
	totalEpisodes: number;
	startDate: string;
	endDate: string;
}

export interface DiaryResponse {
	id: number;
	content: string;
	createdAt: string;
	images: string[];
	location: string;
	mood: string;
	tags: string[];
}

export interface ProjectResponse {
	id: string;
	title: string;
	description: string;
	image: string;
	category: string;
	techStack: string[];
	status: string;
	liveDemo: string;
	sourceCode: string;
	visitUrl: string;
	startDate: string;
	endDate: string;
	featured: boolean;
	tags: string[];
	showImage: boolean;
}

export interface ProjectStatsByStatusResponse {
	completed: number;
	inProgress: number;
	planned: number;
}

export interface ProjectStatsResponse {
	total: number;
	byStatus: ProjectStatsByStatusResponse;
}

export interface SkillExperienceResponse {
	years: number;
	months: number;
}

export interface SkillResponse {
	id: string;
	name: string;
	description: string;
	icon: string;
	category: string;
	level: string;
	experience: SkillExperienceResponse | null;
	projects: string[];
	certifications: string[];
	color: string;
}

export interface TimelineLinkResponse {
	name: string;
	url: string;
	type: string;
}

export interface TimelineResponse {
	id: string;
	title: string;
	description: string;
	type: string;
	startDate: string;
	endDate: string;
	location: string;
	organization: string;
	position: string;
	skills: string[];
	achievements: string[];
	links: TimelineLinkResponse[];
	icon: string;
	color: string;
	featured: boolean;
}

export interface DeviceResponse {
	id?: number;
	brand: string;
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

export type DevicesByBrandResponse = Record<string, DeviceResponse[]>;