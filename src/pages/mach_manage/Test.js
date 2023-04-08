import React, { useEffect, useState } from 'react';
const useContent = (id)=>{
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState('');
    console.log(loading, msg);
    useEffect(()=>{
        setLoading(true);
        setTimeout(()=>{
            const message = ['1','2','3'];
            setLoading(false);
            setMsg(message[id]);
        },2000)
    },[id]);
    return [loading, msg];
}

const Content = ({ id })=>{
    const [loading, msg] = useContent(id);
    console.log('Content render()...');
   
    return <div>{ loading ? <p>loading...</p> : <div>{ msg }</div> }</div>
}

const Hooks = ()=>{
    const [id, setId] = useState(0);
    return (
        <div>
            <button onClick={()=>setId(0)}>点击0</button>
            <button onClick={()=>setId(1)}>点击1</button>
            <button onClick={()=>setId(2)}>点击2</button>
            <Content id={id} />
        </div>
    )
}

export default Hooks;