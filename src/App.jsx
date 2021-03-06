import React, {useState , useEffect} from 'react'
import './index.scss'
import Card from './card'
import regeneratorRuntime from "regenerator-runtime"

function Products() {
    const [store , setStore] = useState([])
    const [nextPage , changePage] = useState(1)
    const [nextBatch , setNext] = useState([])
    const [fetchInProgress , setProgress] = useState(true)
    const [sort , setSort] = useState("none")
    const [showOptions , setOptionsShow ] = useState(false)
    const [pageEnd , setPageEnd] = useState(false)
    const [adArray , setAdArray] = useState([])

    useEffect(()=>{
        InitialiseHandler()
        generateNewAd()
    },[])

    //this function fetches data in json from server api
    const fetchFromApi = (page ,sortType = sort )=>{
        setProgress(true)
        return fetch(`/products?_page=${page}&_limit=50&_sort=${sortType}`).then(res => res.json())

    }

    //Below function initialises the process of fetching from store in begining or after sort change
    const InitialiseHandler =async (sortType)=>{
        const data = await fetchFromApi(1,sortType)
        setProgress(false)
        updateStore(data,sortType)
        changePage(prev=>prev+1)
    }

    //updateStore updates current array of visible ascii
    const updateStore =(vals,sortType)=>{
        setStore(prev=>[...prev,...vals])
        fetchNext(sortType)

    }

    const fetchNext =async (sortType)=>{
        const data = await fetchFromApi(nextPage+1,sortType)

        //this part of code checks if we have data to show for our next scroll update, if not it changes page end to true
        if(data.length===0){
            setPageEnd(true)
        }

        setProgress(false)
        setNext(data)
        changePage(prev=>prev+1)
    }

    
    
    const scrollHandler=(e)=>{
        const endOfPage = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        
        if(endOfPage && !fetchInProgress && !pageEnd)
            updateStore(nextBatch);
    }

    const timeFormatter =(date) =>{
        const date_ = new Date(date);
        let time =date_.getTime()

        const days = time/1000*60*60*24

        if( days>7 ){
            return date_.getDate() + "/" + date_.getMonth() + "/" + date_.getFullYear()
        }else if ( days>1 ){
            return days + " days ago"
        }else if ( days===1 ){
            return "Yesterday"
        }else{
            return "Today"
        }

    }

    //below function resets the states and re-initialise whole process on sort change
    const sortResetHandler =(newSort)=>{
        setSort(newSort)
        setStore([])
        changePage(1)
        setNext([])
        setProgress(true)
        
        InitialiseHandler(newSort)

    }

    const generateRandom=()=> {
        var num = Math.floor(Math.random()*1000);
        return (adArray.includes()) ? generateRandom() : num;
    }

    //for initialisation of ads in our application
    const generateNewAd =()=>{
        setAdArray([generateRandom()])
        setInterval(()=>{
            setAdArray(prev=>[...prev,generateRandom()])
        },20000)
    }


    return (
        <div className="page-container" onScroll={(e)=>scrollHandler(e)} >

            <div className="page-header" >

                <div id="head-title" >Products Grid</div>
                <div className="head-subtitle" >Here you're sure to find a bargain on some of the finest ascii available to purchase. Be sure to peruse our selection of ascii faces in an exciting range of sizes and prices.</div>
                <div className="head-subtitle">But first, a word from our sponsors:</div>
                <img className="ad" src={`/ads/?r=${adArray[adArray.length-1]}`}/>
                
                <div id="sort-container" >
                    <span>Sort by :</span>
                    <div id="sort-option" onClick={()=>setOptionsShow(prev=>!prev)} >
                        <span>{sort}</span>
                        <div id="options-container" className={showOptions?"show-container":""} >
                            <div onClick={()=>sortResetHandler("none")} >none</div>
                            <div onClick={()=>sortResetHandler("price")} >price</div>
                            <div onClick={()=>sortResetHandler("size")} >size</div>
                            <div onClick={()=>sortResetHandler("id")} >id</div>
                        </div>
                    </div>
                </div>
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
            {
                pageEnd&&<div className="end-message" >~ End of catalogue ~</div>
            }
            {/* loader animation */}
            {fetchInProgress&&
                <div className="content">
                <div className="loading">
                <p>loading</p>
                    <span></span>
                </div>
                </div>
            }

        </div>
    )
}

export default Products
