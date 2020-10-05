export interface ImageInputDTO{    
	subtitle: string,
	file: string,
	tags: string,
	collection: string
}

export interface ImageOutputDTO {
	author_id: string,
	collection: string,
	subtitle: string,
	id: string,
	createdAt: string,
	file: string,
	tags: string
}