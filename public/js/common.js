console.log("connected");
const like_btn=document.getElementsByClassName('like-btn')


const likeButton = async (id)=>{
   try{
 const response = await axios({ 
        method: 'post',
        url: `/product/${id}/like`,
        headers:{
            'X-Requested-With':'XMLHttpRequest'
        },
      });
      console.log(response);
    }
    catch(e){
        window.location.replace('/login')
        console.log(e.message)
    }
}

for( let btn of like_btn)
{
    btn.addEventListener('click',()=>{
        const id = btn.getAttribute('product_id');
        if(btn.children[0].classList.contains('fas'))
        {
            btn.children[0].classList.remove('fas');
            btn.children[0].classList.add('far')

        }
        else{
            btn.children[0].classList.remove('far');
            btn.children[0].classList.add('fas')
        }
        likeButton(id)
    })
}

// const redcolor={
//     'background-color:red'
// }
