'use client'
import { useEffect, useState } from "react"
import { db } from "../../utils/firebase"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import Image from "next/image"


export default function Posts() {
    const [posts, setPosts] = useState([])

    const renderizarPosts = async () => {
        const colecao = collection(db, 'materias')
        const q = query(colecao, orderBy('timeStamp', 'desc'))
        const snapshot = await getDocs(q)
        const snapshotData = []
        snapshot.forEach((doc) => {
            snapshotData.push({ id: doc.id, ...doc.data() })
        })
        setPosts(snapshotData)
    }

    useEffect(() => { renderizarPosts() }, [])


    

    console.log(posts)
    return (
        <>
            <h1>Posts</h1>
            <div>
                {posts.map((post, id) => (
                    <div key={id}>
                        <h2>{post.titulo}</h2>
                        <Image 
                            src={post.imagem}
                            width={800}
                            height={600}
                            alt={`esemdestaque-${post.titulo}`}
                         />
                         <div dangerouslySetInnerHTML={{ __html: post.texto}}/>
                    </div>
                ))}
            </div>
        </>
    )
}