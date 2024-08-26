export default function prettyTag(tag){
    return tag.replaceAll("-", " ")
        .split(" ")
        .map( (word) => word.charAt(0).toUpperCase() + word.substring(1))
        .join(" ")
}