'use client'
import { useEffect, useState, useRef } from "react"
import { collection, addDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from "../utils/firebase"
import styles from "../styles/Admin.module.css"
import JoditEditor from "jodit-react"
import Image from "next/image"

/* 
    Título da Notícia
    Texto da Notícia
    Imagem principal
    Thumb
    Resumo da Notícia
*/
export default function admin() {
    //Estados
    const [post, setPost] = useState({
        titulo: '', texto: null,
        resumo: '', imagem: '',
        thumb: '',
        timeStamp: null
    })
    const editor = useRef(null)

    const [selectFotoPrincipal, setSelectFotoPrincipal] = useState(null)
    const [selectThumb, setSelectThumb] = useState(null)
    const [imagemPreview, setImagemPreview] = useState(null)
    const [thumbPreview, setThumbPreview] = useState(null)

    const config = {
        readonly: false,
        height: 400
    }

    /* const handleBlur = async (e) => {
        const editorContent = e.target.value
        setPost({...post, text: editorContent})
    } */

    const handleFileChange = (e) => {
        const fileFoto = e.target.files[0]
        const fileThumb = e.target.files[0]

        setSelectFotoPrincipal(fileFoto)
        setSelectThumb(fileThumb)

        if (fileFoto) {
            const readerFotoDestaque = new FileReader()

            readerFotoDestaque.onloadend = () => {
                setImagemPreview(readerFotoDestaque.result)
            }

            readerFotoDestaque.readAsDataURL(fileFoto)
        }

        if (fileThumb) {
            const readerThumb = new FileReader()

            readerThumb.onloadend = () => {
                setThumbPreview(readerThumb.result)
            }

            readerThumb.readAsDataURL(file)
        }
    }

    const addPost = async (e) => {
        e.preventDefault()
        if (editor.current && editor.current.value) {
            //Upload da Foto Principal do Post
            const storageFotoPrincipalRef = ref(storage, `fotos_principais/${selectFotoPrincipal.name}`)
            const storageThumbRef = ref(storage, `fotos_thumbs/${selectThumb.name}`)

            await uploadBytes(storageFotoPrincipalRef, selectFotoPrincipal)
            await uploadBytes(storageThumbRef, selectThumb)

            const fotoPrincipalURL = await getDownloadURL(storageFotoPrincipalRef)
            const fotoThumbURL = await getDownloadURL(storageThumbRef)



            //Adicionando as matérias
            await addDoc(collection(db, 'materias'), {
                titulo: post.titulo,
                texto: editor.current.value,
                resumo: post.resumo,
                imagem: fotoPrincipalURL,
                thumb: fotoThumbURL,
                timeStamp: new Date()
            })

            //Restaurando os Estados após o envio
            setPost({
                titulo: '', texto: '',
                resumo: '', imagem: '',
                thumb: ''
            })
            setSelectFotoPrincipal(null)
            setSelectThumb(null)
        } else {
            console.error("Editor não est[a definido corretamente.")
        }
    }

    useEffect(() => { addPost }, [])

    console.log(editor.current)

    return (
        <>
            <div className={`flex flex-col justify-center items-center gap-5 h-screen px-5`}>
                <p>Página Admin</p>
                <form action="" className={`flex flex-col justify-center items-center gap-5`} id="inserirPost">
                    <div className={`${styles.formControl}`}>
                        <input
                            type="text"
                            placeholder="Título da Matéria"
                            onChange={(e) => setPost({ ...post, titulo: e.target.value })}
                            name={`tituloMateria`}
                        />
                    </div>

                    <div className={`${styles.formControl}`}>
                        {/* <textarea
                            placeholder="Texto da Matéria"
                            rows={10}
                            cols={60}
                            onChange={(e) => setPost({ ...post, texto: e.target.value })}
                        />  */}

                        <JoditEditor
                            ref={editor}
                            config={config}
                            onBlur={() => {
                                if (editor.current && editor.current.editor) {
                                    const editorContent = editor.current.editor.value;
                                    setPost({ ...post, texto: editorContent });
                                }
                            }}
                            onChange={(newContent) => { }}
                            name={`editor`}
                        />
                    </div>

                    <div className={`${styles.formControl}`}>
                        <input
                            type="text"
                            placeholder="Resumo da Matéria"
                            onChange={(e) => setPost({ ...post, resumo: e.target.value })}
                        />
                    </div>

                    <div className={`${styles.formControl}`}>
                        <input
                            type="file"
                            accept=".png, .jpg, .avif, .webp"
                            multiple={false}
                            placeholder="Imagem Principal"
                            name={`esemdestaque-${post.imagem}`}
                            onChange={handleFileChange}
                        />
                        {imagemPreview && (
                            <img
                                src={imagemPreview}
                                alt={`Preview da Imagem`}
                                style={{ maxWidth: "300px", maxHeight: "300px" }}

                            />
                        )}
                    </div>

                    <div className={`${styles.formControl}`}>
                        <input
                            type="file"
                            accept=".png, .jpg, .avif, .webp"
                            multiple={false}
                            placeholder="Imagem Thumb"
                            name={`esemdestaque-${post.thumb}`}
                            onChange={handleFileChange}
                        />
                        {thumbPreview && (
                            <img
                                src={thumbPreview}
                                alt={`Thumbnail`}
                                style={{ maxWidth: "300px", maxHeight: "300px" }}
                            />
                        )}
                    </div>

                    <div className={`${styles.formControl}`}>
                        <input
                            type="submit"
                            value={`Publicar Post`}
                            onClick={addPost}
                            name={`submit`}
                        />
                    </div>
                </form>
            </div>
        </>
    )
}