import React, {useState , useEffect} from 'react'
import './index.scss'
import Card from './card'
import regeneratorRuntime from "regenerator-runtime"

function Products() {
    const [store , setStore] = useState([])
    const [nextPage , changePage] = useState(1)
    const [nextBatch , setNext] = useState([])
    const [fetchInProgress , setProgress] = useState(true)

    useEffect(async ()=>{
        const data = await fetchFromApi(nextPage)
        setProgress(false)
        updateStore(data)
        changePage(prev=>prev+1)
        
    },[])

    const updateStore =(vals)=>{
        setStore(prev=>[...prev,...vals])
        fetchNext()
    }

    const fetchNext =async ()=>{
        const data = await fetchFromApi(nextPage+1)
        setProgress(false)
        setNext(data)
        changePage(prev=>prev+1)
    }

    const fetchFromApi = (page)=>{
        setProgress(true)
        return fetch(`http://localhost:3000/products?_page=${page}&_limit=25`).then(res => res.json())

    }

    const scrollHandler=(e)=>{
        const end = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if(end && !fetchInProgress)
            updateStore(nextBatch);
    }

    const timeFormatter =(date) =>{
        const date_ = new Date(date);
        let time =date_.getTime()

        const days = time/1000*60*60*24

        if( days>7 ){
            return date_.getDate() + "-" + date_.getMonth() + "-" + date_.getFullYear()
        }else if ( days>1 ){
            return days + " days ago"
        }else if ( days===1 ){
            return "Yesterday"
        }else{
            return "Today"
        }

    }


    return (
        <div className="page-container" onScroll={(e)=>scrollHandler(e)} >
            <div className="page-header" >
                <span id="base-ascii" >(. ͡❛ ₃ ͡❛.)</span>
            </div>
            <div className="products-grid"  >
                {
                    store.map((product)=>{

                        return (
                            <Card
                            key={product.id}
                            date={timeFormatter(product.date)}
                            face={product.face}
                            size={product.size}
                            price={product.price/100}
                            />
                        )
                    })
                }
            </div>
            {fetchInProgress&&
            <div className="content">
            <div className="loading">
            <p>loading</p>
                <span></span>
            </div>
            </div>}
        </div>
    )
}

export default Products
