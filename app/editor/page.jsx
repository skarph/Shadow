"use client"
import { useRef, useState } from 'react'
import styles from './page.module.css'

import {evaluateSync} from '@mdx-js/mdx'

import * as runtime from 'react/jsx-runtime'
import {useMDXComponents} from 'mdx-components.js'
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import Box from 'components/Box'
import {ArticleHeader} from 'components/ArticleMeta'

import * as sanitizeHtml from 'sanitize-html';

import { TarWriter } from '@gera2ld/tarjs';

import { Octokit } from '@octokit/rest';
const repoOwner = "skarph"
const repoName = "Shadow"
const repoWorkflowId = "test.yml"
const repoRef = "main"
const octokit = new Octokit({
    auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN
})

//const MDXComponentsTypes = Object.keys(useMDXComponents())

function checkMDX(html, metadata, images) {
    images.forEach( (image, i) => {
        const canonUrl = 'wiki/' + formatTitleURL(metadata.title) + '/' + image.name
        const rstring = "(?<=!\\[.*]\\()" + canonUrl.replace(/[\\\^\$\.\|\?\*\+\(\)\[\]\{\}]/g, '\\$&') + "(?=\\))"
        
        html = html.replace( new RegExp(rstring, 'g'), image.blobURL )
    })
    return html
    /*
    return sanitizeHtml(html, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(MDXComponentsTypes),
        disallowedTagsMode: 'escape',
        parser: {
            lowerCaseTags: false
        }
    })
    */
}
const Preview = ({markdown, metadata, images}) => {
    /*
    const compile = compileSync(markdown, {
        rehypePlugins: [rehypeHighlight],
        remarkPlugins: [remarkGfm],

    })
    const component = runSync(compile, {
        useMDXComponents = useMDXComponents(),
        ...runtime
    })
    */
   var MDXContent = () => null
    try {
        const {default: mdx} = evaluateSync( checkMDX(markdown, metadata, images), {
            //processor
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeHighlight],
            //compile
            format: 'mdx',

            //runtime
            useMDXComponents: useMDXComponents,
            ...runtime
        })
        MDXContent = mdx
    } catch (e) {
        alert(e)
        console.log(e)
    }
    return <Box>
        <ArticleHeader
            metadata = {metadata}
        />
        <MDXContent
            styles = {styles}
        />
    </Box>
    //*/
}

function formatTitleURL(title) {
    return title.toLowerCase().replaceAll(' ', '-')
}

export default function Page({searchParams}) {

    const textInputRef = useRef(null),
          titleInputRef = useRef(null),
          descriptionInputRef = useRef(null),
          authornameInputRef = useRef(null),
          authorlinkInputRef = useRef(null),
          dateInputRef = useRef(null),
          kristalversionInputRef = useRef(null)

    const [articleBody, setArticleBody] = useState("# Ya no quiero esto skibidi toilet")
    const [articleMeta, setArticleMeta] = useState({
            title: "[TITLE HERE]",
            description: "[SHORT DESCRIPTION HERE]",
            authors: [{name: "[YOUR NAME HERE]", url: "[YOUR LINK/EMAIL <optional>]"}],
            date: "[DATE OF WRITING HERE]",
            kristal_version: "[KRISTAL VERSION HERE]"
        })
    
    const [images, setImages] = useState([]);
    
    function makeLocalImageUrl(image) {
        return 'wiki/' + formatTitleURL(titleInputRef.current.value) + '/' + image.name
    }
    
    function getImageFromLocalUrl(url) {
        'wiki/' + formatTitleURL(titleInputRef.current.value) + '/' + images[i].name
    }

    function handleSubmit(e) {
        e.preventDefault()
    
        const form = e.target
        const data = new FormData(form)
        const text = data.entries().next().value[1]

        //create virtual filestructure and zip it up to send to github actions
        const req = `POST /repos/${repoOwner}/${repoName}/actions/workflows/${repoWorkflowId}/dispatches`

        const writer = new TarWriter()
        const titleSubPath = formatTitleURL(titleInputRef.current.value)
        writer.addFile(`app/data/articles/${titleSubPath}.mdx`, text)
        images.forEach( (image, i) => writer.addFile(
            `public/wiki/${titleSubPath}/${image.name}`,
            image
        ))
        writer.write()
            .then( (tarBlob) => new Response(tarBlob.stream().pipeThrough(new CompressionStream("gzip"))).blob() )
            .then( (tarballBlob) => {
                console.log(tarballBlob)
                const form = new FormData()
                form.append('file', tarballBlob ,'tarball.bin')
                const req = new XMLHttpRequest()
                req.open('POST', 'https://tmpfiles.org/api/v1/upload')
                req.onerror = (e) => console.log(e)
                req.onreadystatechange = () => {
                    if (req.readyState === 4) {
                        const res = JSON.parse(req.response)
                        if (res.status === 'success') {
                            const url = res.data.url.replace('https://tmpfiles.org/', 'https://tmpfiles.org/dl/')
                            console.log(url)
                            octokit.request(req, {
                                ref: repoRef, 
                                inputs: {url: url}
                            })
                            .catch( (httpError) => {
                                alert(httpError)
                                console.log(httpError)
                            })
                            .then( (response) => {
                                console.log(response)
                            })
                        } else {

                        }
                    }
                }
                req.send(form)
                //local download
                //window.location.assign(URL.createObjectURL(tarballBlob))
                /*
                const fr = new FileReader()
                fr.readAsDataURL(tarballBlob)
                fr.onloadend = () => {
                    octokit.request(req, {
                            ref: repoRef, 
                            inputs: {data: fr.result.replace('data:application/octet-stream;base64,', '')}
                        })
                        .catch( (httpError) => {
                            alert(httpError)
                            console.log(httpError)
                        })
                        .then( (response) => {
                            console.log(response)
                        })
                }
                //*/
            })
        /*
        const zip = JSZip()
        const titleSubPath = formatTitleURL(titleInputRef.current.value)
        zip.file(`app/data/articles/${titleSubPath}.mdx`, text)
        images.forEach( (image, i) => zip.file(
            `public/wiki/${titleSubPath}/${image.name}`,
            image
        ))
        //submit PR with github actions
        zip.generateAsync({type:"binarystring"}).then( (base64) => {
            const req = `POST /repos/${repoOwner}/${repoName}/actions/workflows/${repoWorkflowId}/dispatches`
            const reply = octokit.request(req, {
                ref: repoRef,
                inputs: {
                    data: base64
                }
            })
            .catch( (e) => {
                alert(e)
                console.log(e)
            })
            .then( (response) => {
                console.log(req)
                console.log(response)
                console.log("===")
            })
        })
        */
    }

    function renderPreview(e) {
        setArticleBody(textInputRef.current.value)
        setArticleMeta({
            title: titleInputRef.current.value,
            description: descriptionInputRef.current.value,
            authors: [{name: authornameInputRef.current.value, url: authorlinkInputRef.current.value}],
            date: dateInputRef.current.value,
            kristal_version: kristalversionInputRef.current.value
        })
    }

    const MarkdownStyleButton = ({children, left, right}) => <button
        data-left-symbol = {left}
        data-right-symbol = {right}
        onClick = {(e) => {
            const
                txt = textInputRef.current.value,
                start = textInputRef.current.selectionStart,
                end = textInputRef.current.selectionEnd,
                left = e.target.getAttribute("data-left-symbol"),
                right = e.target.getAttribute("data-right-symbol")
            setArticleBody([
                txt.slice(0, start),
                left,
                txt.slice(start, end),
                right,
                txt.slice(end)
            ].join(''))
        }}
    >
        {children}
    </button>

    const ImageCarousel = () => {
        return <div>
            {images.map( (image, i) => <div key = {i}>
                <p>{'wiki/' + formatTitleURL(titleInputRef.current.value) + '/' + images[i].name}</p>
                <img
                    width = "250px" 
                    src = { image.blobURL }
                />
                <button
                    type = "button"
                    onClick = { (e) => {
                        const
                            txt = textInputRef.current.value,
                            start = textInputRef.current.selectionStart,
                            end = textInputRef.current.selectionEnd
                        setArticleBody([
                            txt.slice(0, start),
                            '![',
                            txt.slice(start, end),
                            '](' + 'wiki/' + formatTitleURL(titleInputRef.current.value) + '/' + images[i].name + ')',
                            txt.slice(end)
                        ].join(''))
                    }}
                >Insert</button>
                <button
                    type = "button"
                    onClick = { (e) => {
                        URL.revokeObjectURL(images[i].blobURL)
                        images.splice(i,1)
                        setImages([...images])
                    }}
                >Remove</button>
            </div>)}
            <input
                type = "file"
                multiple
                name = "myImage"
                accept = "image/*"
                onChange = { (e) => {
                    Array.from(e.target.files).forEach( (image, i) => {
                        image.blobURL = URL.createObjectURL(image)
                        image.blob = 
                        console.log((new FileReader()).readAsText(image))
                        }
                    )
                    setImages([...images, ...e.target.files])
                }}
            >

            </input>
        </div>
    }

    return (<>
    <form
    method = "post"
    onSubmit = {handleSubmit}
    >   
        <label>Article Editor</label>
        
        <textarea
            className = {styles.editor}
            id = "textarea"
            name = "text"
            ref = {textInputRef}

            spellCheck = "false"
            autoCorrect = "false"
            autoFocus = "true"
            placeholder = "Write markdown for your article here . . ."
            value = {articleBody}
            onChange = {(e) => {
                setArticleBody(e.target.value)
            }}
        />

        <button type = "submit">Finish Article</button>
        <button type = "button" onClick = {renderPreview}>PREVIEW</button>
        <MarkdownStyleButton left = "*" right = "*" >Italic</MarkdownStyleButton>
        <MarkdownStyleButton left = "**" right = "**" >Bold</MarkdownStyleButton>
        <MarkdownStyleButton left = "***" right = "***" >ItalicBold</MarkdownStyleButton>
        <MarkdownStyleButton left = "> " right = "" >Quote</MarkdownStyleButton>
        <MarkdownStyleButton left = {"\n\n# "} right = "" >H1</MarkdownStyleButton>
        <MarkdownStyleButton left = {"\n\n## "} right = "" >H2</MarkdownStyleButton>
        <MarkdownStyleButton left = {"\n\n### "} right = "" >H3</MarkdownStyleButton>
        <MarkdownStyleButton left = {"\n\n#### "} right = "" >H4</MarkdownStyleButton>
        <MarkdownStyleButton left = {"\n\n1. "} right = "" >List</MarkdownStyleButton>
        <MarkdownStyleButton left = {"\n\n- "} right = "" >Bullet</MarkdownStyleButton>
        <MarkdownStyleButton left = "`" right = "" >Code</MarkdownStyleButton>
        <MarkdownStyleButton left = "" right = {"\n\n---\n\n"} >Horizon</MarkdownStyleButton>
        <br/>

        <ImageCarousel/>
        
        <div>
            <label htmlFor = "title">Title:</label>
            <input id = "title" type = "text" placeholder = "Title" ref = {titleInputRef} onInput={
                (e) => {
                    var editorContent = textInputRef.current.value
                    images.forEach( (image, i) => {
                        const canonUrl = 'wiki/' + formatTitleURL(articleMeta.title) + '/' + image.name
                        const rstring = "(?<=!\\[.*]\\()" + canonUrl.replace(/[\/\\\^\$\.\|\?\*\+\(\)\[\]\{\}]/g, '\\$&') + "(?=\\))"
                        editorContent = editorContent.replace( new RegExp(rstring, 'g'), 'wiki/' + formatTitleURL(e.target.value) + '/' + image.name )
                    })
                    setArticleBody(editorContent)
                    setArticleMeta({...articleMeta, title: e.target.value})
                }
            }></input>
        </div>
        <div>
            <label htmlFor = "description">Description:</label>
            <input id = "description" type = "text" placeholder = "Description" ref = {descriptionInputRef}></input>
        </div>
        <div>
            <label htmlFor = "authorname">Author Name:</label>
            <input id = "authorname" type = "text" placeholder = "Name" ref = {authornameInputRef}></input>
        </div>
        <div>
            <label htmlFor = "authorlink">Author Link:</label>
            <input id = "authorlink" type = "text" placeholder = "Email/Website/Contact" ref = {authorlinkInputRef}></input>
        </div>
        <div>
            <label htmlFor = "date">Date:</label>
            <input id = "date" type = "date" ref = {dateInputRef}></input>
        </div>
        <div>
            <label htmlFor = "kristalversion">Kristal Version:</label>
            <select id = "kristalversion" ref = {kristalversionInputRef}>
                <option value = "0.9.0">0.9.0</option>
                <option value = "0.8.1">0.8.1</option>
            </select>
        </div>
        <br/>
        <hr/>
    </form>
    <div>
        <Preview
            markdown = {articleBody} 
            metadata = {articleMeta}
            images   = {images}
        />
    </div>
    </>)
}