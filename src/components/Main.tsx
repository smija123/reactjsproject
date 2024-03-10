import { useEffect, useRef, useState } from "react"

import axios from 'axios'

import { PagerTargetEvent } from "@progress/kendo-react-data-tools";
import {
  Grid,
  GridColumn,
  GridPageChangeEvent,
} from "@progress/kendo-react-grid";
import { Switch } from "@progress/kendo-react-inputs";

interface PageState {
    skip: number;
    take: number;
  }

  const initialDataState: PageState = { skip: 0, take: 5 };


const Main = ()=> {

    const ref = useRef<any>(0)

    const [data, setData] = useState<any>([])
    const [page, setPage] = useState<PageState>(initialDataState);
    const [pageSizeValue, setPageSizeValue] = useState<
      number | string | undefined
    >();

    useEffect(()=> {
        axios.get('https://api.punkapi.com/v2/beers', {}).then((response: any)=> {
            if(response){
                setData(response.data)
            }
        }).catch((error: any)=> {
           console.log(error) 
        })
        ref.current = ref.current + 1
    },[])

    useEffect(()=> {
        if(ref.current !== 0){
            axios.get(`https://api.punkapi.com/v2/beers?page=${page.skip}&per_page=${page.take}`, {}).then((response: any)=> {
                if(response){
                    setData(response.data)
                }
            }).catch((error: any)=> {
               console.log(error) 
            })
        }
       
    },[page,ref]) 


   
  const pageChange = (event: GridPageChangeEvent) => {
    const targetEvent = event.targetEvent as PagerTargetEvent;
    const take =
      targetEvent.value === "All" ? data?.length : event.page.take;

    if (targetEvent.value) {
      setPageSizeValue(targetEvent.value);
    }
    setPage({
      ...event.page,
      take,
    });
    console.log(event.page)
  };

  const onFilterChange = async (e: any)=> {
    
    if(e.target.value){
        await axios.get('https://api.punkapi.com/v2/beers?abv_lt=8', {}).then((response: any)=> {
            if(response){
                setData(response.data)
            }
        }).catch((error: any)=> {
           console.log(error) 
        })
    }else{
        await axios.get('https://api.punkapi.com/v2/beers', {}).then((response: any)=> {
            if(response){
                setData(response.data)
            }
        }).catch((error: any)=> {
           console.log(error) 
        })
    }
   
  }


    return <>
    <label>Filter</label>
    <Switch onChange={(e: any)=> onFilterChange(e)}/>;
    <Grid
        style={{ height: "400px" }}
        data={data}
        skip={page.skip}
        take={page.take}
        total={data?.length}
        pageable={{
          buttonCount: 4,
          pageSizes: [5, 10, 15, "All"],
          pageSizeValue: pageSizeValue,
        }}
        onPageChange={pageChange}
      >
        <GridColumn field="id" />
        <GridColumn field="name" title="Name" />
        <GridColumn field="abv" title="ABV" />
        <GridColumn field="tagline" title="Tag" />
        <GridColumn field="first_brewed" title="First brewed on" />
        
      </Grid>
    </>
}

export default Main