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

export class Collection {
	constructor(
		private id: string,
		private title: string,
		private subtitle: string,
		private image: string | undefined,
		private user_id: string,
	)
	{}

	getId() {
		return this.id
	}

	getTitle() {
		return this.title
	}

	getSubtitle() {
		return this.subtitle
	}

	getImage() {
		return this.image
	}

	getUser_Id() {
		return this.user_id
	}

	setId(id: string) {
		this.id = id
	}

	setTitle(title: string) {
		this.title = title
	}
	
	setSubtitle(subtitle: string) {
		this.subtitle = subtitle
	}

	setImage(image: string) {
		this.image = image
	}

	setUser_Id(user_id: string) {
		this.user_id = user_id
	}

	static toUserModel(collection: any): Collection {
		return (collection && new Collection(
				collection.id,
				collection.title,
				collection.subtitle,
				collection.image,
				collection.user_id,
			)
		)
    }
}