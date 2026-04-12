import mongoose, { Model, Schema } from 'mongoose'

const COMBINED_SEPARATOR_PATTERN = /[^a-z0-9]+/g
const EDGE_SEPARATOR_PATTERN = /^-+|-+$/g
const DIACRITICS_PATTERN = /[\u0300-\u036f]/g
const FALLBACK_SLUG = 'item'

const buildMissingSlugFilter = () => ({
    $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: '' }
    ]
})

const getDocumentValue = (document: any, fieldName: string) => {
    const rawValue = typeof document.get === 'function'
        ? document.get(fieldName)
        : document?.[fieldName]

    return typeof rawValue === 'string' ? rawValue.trim() : ''
}

export const createSlug = (value: string) => {
    const normalizedValue = value
        .normalize('NFKD')
        .replace(DIACRITICS_PATTERN, '')
        .toLowerCase()
        .trim()

    const slug = normalizedValue
        .replace(COMBINED_SEPARATOR_PATTERN, '-')
        .replace(EDGE_SEPARATOR_PATTERN, '')

    return slug || FALLBACK_SLUG
}

export const createUniqueSlug = async ({
    model,
    value,
    excludeId
}: {
    model: Model<any>
    value: string
    excludeId?: mongoose.Types.ObjectId | string
}) => {
    const baseSlug = createSlug(value)
    let candidateSlug = baseSlug
    let suffix = 2

    while (await model.exists({
        slug: candidateSlug,
        ...(excludeId ? { _id: { $ne: excludeId } } : {})
    })) {
        candidateSlug = `${baseSlug}-${suffix}`
        suffix += 1
    }

    return candidateSlug
}

export const attachSlugLifecycle = <T>(schema: Schema<T>, sourceField: string) => {
    ; (schema as any).add({
        slug: {
            type: String,
            trim: true,
            lowercase: true,
            index: true
        }
    })

    schema.index({ slug: 1 }, { unique: true, sparse: true })

    schema.pre('validate', async function () {
        const sourceValue = getDocumentValue(this, sourceField)
        const currentSlug = getDocumentValue(this, 'slug')

        if (!sourceValue) {
            return
        }

        if (!this.isModified(sourceField) && currentSlug) {
            return
        }

        const nextSlug = await createUniqueSlug({
            model: this.constructor as Model<any>,
            value: sourceValue,
            excludeId: this._id as mongoose.Types.ObjectId | string | undefined
        })

        this.set('slug', nextSlug)
    })
}

export const syncMissingSlugs = async (model: Model<any>, sourceField: string) => {
    const documents = await model.find(buildMissingSlugFilter()).select(`${sourceField} slug`)
    let updatedDocuments = 0

    for (const document of documents) {
        const sourceValue = getDocumentValue(document, sourceField)

        if (!sourceValue) {
            continue
        }

        document.set('slug', await createUniqueSlug({
            model,
            value: sourceValue,
            excludeId: document._id as mongoose.Types.ObjectId | string | undefined
        }))

        await document.save()
        updatedDocuments += 1
    }

    return updatedDocuments
}

export const buildSlugLookup = (value: string) => {
    const normalizedValue = value.trim().toLowerCase()

    if (!normalizedValue) {
        return { slug: '__invalid_slug__' }
    }

    if (mongoose.Types.ObjectId.isValid(value)) {
        return {
            $or: [
                { slug: normalizedValue },
                { _id: new mongoose.Types.ObjectId(value) }
            ]
        }
    }

    return { slug: normalizedValue }
}