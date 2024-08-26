import meta_list from '../app/data/meta-list.json' with {type: 'json'};

export default function getArticleMetadata(slug) {
    const metadata = meta_list.find( (m) => m.slug === slug )
    if(!metadata) throw new Error(`No metadata for "${slug}" in metadata list`)

    return metadata
}