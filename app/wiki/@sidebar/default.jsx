import Image from 'next/image'
import starw from 'public/icon/starw.png'

//should never appear in normal browsing
export default function Page() {
    return <div style = {{display: "grid", "placeItems": "center", height: "25%"}}>
        <Image 
            src={starw}
            alt="The Original      Starwalker"
        />
        <p>this sidebar is</p>
        <p>pissing&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;me off...</p>
    </div>
}