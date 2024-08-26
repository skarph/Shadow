import lunr from 'lunr';
import data from '/app/data/wiki-index.json'
const STRING_MAX_SIZE = 80;

const index = lunr.Index.load(data);

function parseResult(result) {
    const trim = JSON.parse(result);
    trim.title = trim.title.length > STRING_MAX_SIZE - 3 ? trim.title.substring(0, STRING_MAX_SIZE - 3) + "..." : trim.title;
    trim.description = trim.description.length > STRING_MAX_SIZE - 3 ? trim.description.substring(0, STRING_MAX_SIZE - 3 ) + "..." : trim.description;
    return trim;
}

export function searchQuery(search_string) {
    if( !(typeof(search_string) == "string" && search_string.length > 0) )
        return []
    
    let query = search_string.toLowerCase()
    const api_query = query.match(/\w+[\.:]\w+/g)
        ?.map((m) => {
            query = query.replace(m, "")
            return m.split(/[\.:]/g)
        })
    query = query.split(" ").filter( (m) => m.length == 0 ? false : true)

    var results = index.query((q) => {
        // <class>.<field?> search
        if(api_query) api_query.forEach( (m) => {
            q.term("_class_"+m[0],{
                fields: ["tags"],
                presence: lunr.Query.presence.REQUIRED
            })

            q.term(m[1],{
                fields: ["title"],
                wildcard: lunr.Query.wildcard.TRAILING,
                presence: lunr.Query.presence.REQUIRED,
            })
        })
        //regular search
        if(query) query.forEach( (m) => {
            //disculde class fields if search_string matches class name exactly
            q.term("_class_"+query,{
                fields: ["tags"],
                wildcard: lunr.Query.wildcard.LEADING | lunr.Query.wildcard.TRAILING,
                presence: lunr.Query.presence.PROHIBITED
            })

            q.term([query],{
                fields: ["title", "description"],
                wildcard: lunr.Query.wildcard.NONE,
                boost: 4
            })
            
            q.term(query,{
                fields: ["title", "description"],
                wildcard: lunr.Query.wildcard.TRAILING,
                boost: 2
            })

            q.term(query,{
                fields: ["title", "description"],
                wildcard: lunr.Query.wildcard.LEADING,
                boost: 1
            })
        })        
    })
    
    results = results.map((r) => parseResult(r.ref))
    return results
}