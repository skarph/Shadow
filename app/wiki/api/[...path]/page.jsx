import { notFound } from 'next/navigation';
import { TYPES, sanitizeLink } from '/src/docparser.js';
import { parse } from '/src/markdown.js';
import Box from '/components/box';
const util = require('util')

export async function generateStaticParams() {
    const types = TYPES
    // return all keys
    return types.map((type) => {
        return {
            slug: type.name
        }
    });
}

export default async function Api({ params }) {

    // read the types from TYPES 

    let type = null;

    for (const current of TYPES)
    {
        if (current.name == params.path[0]) {
            type = current;
            break
        }
    }

    if (!type) {
        return notFound();
    }

    const methods = [];
    const fields = [];

    for (const field of type.fields) {
        if (field.extends.type == "function")
        {
            methods.push(field);
            console.log(util.inspect(field, {showHidden: false, depth: null, colors: true}))
        }
        else
        {
            fields.push(field);
        }
    }

    return <div key={type.name}>
        <h2>{type.name}</h2>
        <hr/>
        <p>{type.desc}</p>
        {
            methods.map(async (method) => {
                return <><br/>
                <Box key={method.name}>
                    <h3>
                    <span style={{color: "lightgreen"}}>{type.name}</span>
                    <span style={{color: "lightgray"}}>{ method.extends.args[0] && method.extends.args[0].name=="self" ? ":" : "."}</span>
                    <span style={{color: "deepskyblue"}}>{method.name}</span>
                    <span style={{color: "gray"}}>(</span>
                    {
                        method.extends.args.map((arg, index) => {
                            if (index == 0 && arg.name == "self") {
                                // imagine this is a continue
                            }
                            else
                            {
                                return <span key={arg.name}>
                                    <span style={{color: "lightgray"}}>{arg.name}</span>
                                    <span style={{color: "gray"}}>: </span>
                                    <span style={{color: "hotpink"}}>{arg.view}</span>
                                    {index < method.extends.args.length-1 ? <span style={{color: "lightgray"}}>, </span> : null}
                                </span>
                            }

                        })
                    }
                    <span style={{color: "gray"}}>)</span>
                    </h3>
                    <span style={{color: "lightgray"}} dangerouslySetInnerHTML={{__html: await parse(method.desc)}}></span>
                    { method.extends.args.length > 0 && !(method.extends.args[0].name == "self" && method.extends.args.length == 1) &&
                        <>
                            <p>Arguments:</p>
                            <ul>
                            {
                                method.extends.args.map(async (arg, index) => {
                                    if (index == 0 && arg.name == "self") {
                                        // imagine this is a continue
                                    }
                                    else
                                    {
                                        return <li key={arg.name}>
                                            <span style={{color: "hotpink"}}>{arg.name}</span>
                                            <span style={{color: "lightgray"}}>: </span>
                                            <span style={{color: "hotpink"}}>{arg.view}</span>
                                            <span style={{color: "lightgray"}}> - </span>
                                            <span style={{color: "lightgray"}} dangerouslySetInnerHTML={{__html: await parse(arg.desc)}}></span>
                                        </li>
                                    }
                                })
                            }
                            </ul>
                        </>
                    }
                    {
                        method.extends.returns && method.extends.returns.length > 0 && <>
                            <p>Returns: </p>
                            <ul>
                                {
                                    method.extends.returns.map(async (ret, index) => {
                                        return <li key={index}>
                                            <span style={{color: "hotpink"}}>{ret.name}</span>
                                            <span style={{color: "lightgray"}}>: </span>
                                            <span style={{color: "hotpink"}}>{ret.view}</span>
                                            <span style={{color: "lightgray"}}> - </span>
                                            <span style={{color: "lightgray"}} dangerouslySetInnerHTML={{__html: await parse(ret.desc)}}></span>
                                        </li>
                                    })
                                }
                            </ul>
                        </>
                    }
                </Box>
                </>
            })
        }
    </div>
}
