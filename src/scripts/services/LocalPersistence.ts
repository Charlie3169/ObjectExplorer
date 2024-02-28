const addCircleButton = document.getElementById(`add-circle-button`);
const clearCirclesButton = document.getElementById(`clear-circle-button`);

let itemsArray = localStorage.getItem(`circles`) ? JSON.parse(localStorage.getItem(`circles`)) : [] ;

window.onload = function()  
{            
    const data = JSON.parse(localStorage.getItem(`circles`));
    //for(i = 0; i < localStorage.getItem(`circles`).length; i++)
    //{       
        //redraw(data[i]);
    //}      
}

clearCirclesButton.addEventListener(`click`, function () 
{
    localStorage.clear();    
});

       
addCircleButton.addEventListener(`click`, function () 
{               
    //itemsArray.push(draw());
    localStorage.setItem(`circles`, JSON.stringify(itemsArray));    
});

/*
window.addEventListener('load', () => 
{
    const getStorage = () => localStorage.getItem('storage') === 'local' ? localStorage : sessionStorage
    const setStorageValue = (key, value) => getStorage().setItem(key, JSON.stringify(value))
    const getStorageValue = (key) => JSON.parse(getStorage().getItem(key))
  

    
})

*/