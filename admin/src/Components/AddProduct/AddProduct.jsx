import React, { useState } from 'react'
import './AddProduct.css'
import upload_area from '../../assets/upload_area.svg'

const AddProduct = () => {

  //state variable, variable name is 'image' and setter function will be 'setImage' initialized with 'false' 
  const [image,setImage] = useState(false); 

  //making functional 1)
  const [productDetails, setProductDetails] = useState({
    name: "",
    image:"",
    category: "women",
    new_price: "",
    old_price: ""
  })

  const imageHandler = (e) => {
    setImage(e.target.files[0]);
  }

  //making functional 2) arrow function
  const changeHandler = (e) => {
    // ... means speard operator 
    setProductDetails({...productDetails, [e.target.name]:e.target.value})
  }

  //function for ADD button
  const Add_Product = async () => {
    //ADDING WITH BACKEND START CODE 
    //adding logic with backkend 
    console.log(productDetails);
    let responseData;
    let product = productDetails;

    //from data
    let formData = new FormData();
    formData.append('product', image);

    //connect with end point of upload
    await fetch('http://localhost:4000/upload', {
      method:'POST',
      headers:{
        Accept:'application/json', 
      },
      body: formData,
    }).then((resp) => resp.json()).then((data) => { responseData = data;
      console.log('Upload response:', responseData); // Debug statement
     });

    if(responseData.success)
    {
        product.image = responseData.image_url;
        console.log('Product with image URL:', product); // Debug statement
        console.log(product);
    //connect with end point of upload end code 

    /* error 1 for add page 
        //send to this product in add product end point 
        await fetch('http://localhost:4000/addproduct', {
          method: 'POST',
          headers:{
            Accept:'application.json',
            'Content-Type':'application.json',
          },
          body: JSON.stringify(product),
        }).then((resp)=>resp.json()).then((data)=>{
          data.success?alert("Product Added"):alert("Failed")
        })
    }
  }
    */
    
      //connect with backend addpoint start code 
        await fetch('http://localhost:4000/addproduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        }).then((resp) => resp.json()).then((data) => {
          data.success ? alert("Product Added") : alert("Failed to Add Product")
        })
      }
    }

  //connect with backend addpoint end code 

  //ADDING WITH BACKEND END CODE 

  return (
    <div className='add-product'>

      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
      </div>
      
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Price</p>
          <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
        </div>
        <div className="addproduct-itemfield">
          <p>Offer Price</p>
          <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
        </div>
      </div>

      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changeHandler} name='category' className='add-product-selector'>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kid">Kid</option>
        </select>
      </div>

      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumnail-img' alt="" />
        </label>
        <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
      </div>

      <button onClick={()=>{Add_Product()}} className='addproduct-btn'>ADD</button>

    </div>
  )
}

export default AddProduct