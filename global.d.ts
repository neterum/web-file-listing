interface webListings {
    files?: [ webItem],
    folders?: [webItem]
}

interface webItem {
    name: string,
    type: string
}