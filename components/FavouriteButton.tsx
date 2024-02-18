import axios from "axios";
import React,{useCallback,useMemo} from "react";

import useCurrentUser from "@/hooks/useCurrentUser";
import useFavourites from "@/hooks/useFavourites";

import { AiOutlinePlus ,AiOutlineCheck} from "react-icons/ai";

interface FavouriteButtonProps{
    movieId:string;
}

const FavouriteButton : React.FC<FavouriteButtonProps> = ({movieId}) => {

    const { mutate :mutateFavourites} = useFavourites();
    const { data :currentUser,mutate} = useCurrentUser(); 
    
    const isFavourite = useMemo(()=>{
        const list = currentUser?.favourtieIds || [];
        return list.includes(movieId);
    },[currentUser,movieId]); 

    const toggleFavourites = useCallback(async ()=>{
        let response;
        if(isFavourite){
            response = await axios.delete('/api/favourite',{data:{movieId}})
        } else{
            // no need to add data:{movieId} explicitly for post 
            response = await axios.post('/api/favourite',{movieId})
        }

        const updateFavouriteIds = response?.data?.favourtieIds;

        mutate({
            ...currentUser,
            favourtieIds : updateFavouriteIds,
        });
        mutateFavourites();
    },[movieId,isFavourite,currentUser,mutate,mutateFavourites]);

    const Icon = isFavourite ? AiOutlineCheck : AiOutlinePlus;

    return (
        <div onClick={toggleFavourites}
            className="
            cursor-pointer
            group/item
            w-6 lg:w-10
            h-6 lg:h-10
            border-white
            border-2
            rounded-full
            flex
            justify-center
            items-center
            transition
            hover:border-neutral-300
        ">
            <Icon className="text-white" size={25}/>
        </div>
    )
};

export default FavouriteButton;