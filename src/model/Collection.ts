export interface CollectionInputDTO{    
	title: string,
	subtitle: string,
    image?: string
}

export interface CollectionOutputDTO {
	id: string,
	title: string,
	subtitle: string,
    image: string | undefined,
    user_id: string
}