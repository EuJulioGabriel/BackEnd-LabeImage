import moment from 'moment'

export interface ImageInputDTO{    
	subtitle: string,
	file: string,
	tags: string,
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
				image.subtitle,
				image.id,
				moment(image.createdAt).format("DD/MM/YYYY"),
				image.file,
				image.tags,
				image.name,
			)
		)
    }
}