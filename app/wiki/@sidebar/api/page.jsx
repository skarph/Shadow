import Image from 'next/image'
import starw from 'public/icon/starw.png'

export default function Page() {
    return <div style = {{display: "grid", "placeItems": "center", height: "25%"}}>
        <Image 
            src={starw}
            alt="The Original      Starwalker"
        />
        <p>This api refrance list is</p>
        <p>pissing me&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;off...</p>
    </div>
}