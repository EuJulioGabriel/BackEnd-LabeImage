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
	tags: string,
	name: string,
}

export class Image {
	constructor(
		private author_id: string,
		private collection: string,
		private subtitle: string,
		private id: string,
		private createdAt: string,
		private file: string,
		private tags: string,
		private name?: string,
	)
	{}

	getAuthorId() {
		return this.author_id
	}
	
	getCollection() {
		return this.collection
	}

	getSubtitle() {
		return this.subtitle
	}

	getId() {
		return this.id
	}

	getCreatedAt() {
		return this.createdAt
	}

	getFile() {
		return this.file
	}

	getTags() {
		return this.tags
	}

	getName() {
		return this.name
	}

	setAuthorId(id: string) {
        this.author_id = id;
	}
	
	setCollection(collection: string) {
        this.collection = collection;
	}
	
	setSubtitle(subtitle: string) {
		this.subtitle = subtitle
	}

	setId(id: string) {
		this.id = id
	}

	setCreatedAt(createdAt: string) {
		this.createdAt = createdAt
	}

	setFile(file: string) {
		this.file = file
	}

	setTags(tags: string) {
		this.tags = tags
	}

	setName(name: string) {
		this.name = name
	}

	static toUserModel(image: any): Image {
		return (image && new Image(
				image.author_id,
				image.collection,
				image.subtitle,
				image.id,
				image.createdAt,
				image.file,
				image.tags,
				image.name,
			)
		)
    }
}