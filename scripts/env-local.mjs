/* CANONICAL ENTRIES FOR: /.env.local
    NEXT_PUBLIC_KRISTAL_VERSION=<version>
*/

import path from 'path';
import fs from 'fs';
import { Octokit } from '@octokit/rest';
function getEnvVariable(env, name) {
    const re = new RegExp(`(?<=${name}=).+`)
    return re.exec(env)?.[0] || null
}

function setEnvVariable(env, name, value){
    const re = new RegExp(`(?<=${name}=).*`)
    if( re.test(env) ) {
        return env.replace(re, value)
    } else {
        let data = `${name}=${value}`
        return env.length > 0 ? env + `\n${data}` : env + data
    }
}

const env_path = path.join(process.cwd(), ".env.local")
//ensure .env.local exists
if(!fs.existsSync(env_path)){
    fs.writeFileSync(env_path, "", {encoding: "utf8", flag: "w"})
    console.log("[.env.local] Created /.env.local")
}

const env = fs.readFileSync(env_path,  { encoding: "utf8" })
let new_env = env

//update .env.local.NEXT_PUBLIC_KRISTAL_VERSION
console.log("[.env.local] Connecting to GitHub...")
const octokit = new Octokit({
    
})

const github_releases = await octokit.request('GET /repos/{owner}/{repo}/releases', {
    owner: 'KristalTeam',
    repo: 'Kristal',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
})

const latest_release = github_releases.data[0].name.match(/\d+\.\d+\.\d+/)[0]
if(latest_release) {
    new_env = setEnvVariable(new_env, "NEXT_PUBLIC_KRISTAL_VERSION", latest_release)
    console.log(`[.env.local] NEXT_PUBLIC_KRISTAL_VERSION=${getEnvVariable(new_env, "NEXT_PUBLIC_KRISTAL_VERSION")}`)
} else {
    console.log(`[.env.local] Could not get latest version number, GitHub sent:`)
    console.log(github_releases)
}

//done. write new enviroment
fs.writeFileSync(env_path, new_env, {encoding: "utf8", flag: "w"})
console.log(`[.env.local] Wrote to .env.local`)
