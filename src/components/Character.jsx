/* eslint-disable react/prop-types */
import { useState } from 'react';
import './Character.css';

export function Character({characterInfo}) {
    const [seeMore, setSeeMore] = useState(false);
    const basePath = characterInfo.thumbnail;

    return (
        <div className="character-container" onClick={() => setSeeMore(!seeMore)}>
            <h1>{characterInfo.name}</h1>

            {!`${basePath.path}`.includes('image_not_available') ? (
                <img src={`${basePath.path}.${basePath.extension}`}/>   
            ) : (
                <img src="src/assets/sky.jpg"/>
            )} 

            {characterInfo.description && (
                seeMore ? (
                    <div className='description-container'>
                        <p>{characterInfo.description}</p>
                        <div className='see-more'>
                            <span>See Less</span>
                            <img src="src/assets/chevron.png" className='chevron top' />
                        </div>
                    </div>
                ) : (
                    <div className='see-more'>
                        <span>See More</span>
                        <img src="src/assets/chevron.png" className='chevron' />
                    </div>
                )
            )}
        </div>
    )
}