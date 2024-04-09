import { useEffect, useRef, useState } from "react";

export default function SearchSelect(props){
    const [items,setItems]=useState([]);
    const [searchItems,setSearchItems]=useState([]);
    let search=(text)=>{
        if(text.length>0){
          var filter=items.filter(x=>x[props.textField].includes(text));
          setSearchItems(filter)
        }
        else{
            setSearchItems([]);
        }
      }
    
      let select=(item)=>{
        props.onSelect(item)
        inputRef.current.value=item[props.textField]
        setSearchItems([])
      }
      const inputRef=useRef()
      useEffect(()=>{
        setItems(props.items)
      },[props])
    return(<>
      <div className={props.containerClass} style={{ position: "relative" }}>
                <input
                ref={inputRef}
                  className={'form-control '+props.inputClass}
                  type="search"
                  placeholder={props.placeholder?props.placeholder:'جستجو'}
                  aria-label="Search"
                  onChange={(e)=>search(e.target.value)}
                />
                {searchItems.length > 0 && (
                  <>
                    <div className="search-autocomplete">
                      <ul>
                        {searchItems.map((d)=>(<>
                          <li>
                          <button className="btn-none text-black" onClick={()=>select(d)}>{d[props.textField]}</button>
                        </li> 
                        </>))}
                       
                       
                      </ul>
                    </div>
                  </>
                )}
              </div>
    
    </>)
}